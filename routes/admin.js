const express = require('express');
const { body, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalRatings = await Rating.countDocuments();

    // Get new registrations this month
    const newUsers = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const newDrivers = await Driver.countDocuments({ createdAt: { $gte: lastMonth } });

    // Get ride statistics
    const activeRides = await Ride.countDocuments({ status: 'active' });
    const completedRides = await Ride.countDocuments({ status: 'completed' });

    // Get verification status
    const pendingDrivers = await Driver.countDocuments({ isVerified: false });
    const verifiedDrivers = await Driver.countDocuments({ isVerified: true });

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');

    const recentRides = await Ride.find()
      .populate('driver', 'user')
      .populate('driver.user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('origin destination departureTime status createdAt');

    res.json({
      success: true,
      dashboard: {
        overview: {
          totalUsers,
          totalDrivers,
          totalRides,
          totalRatings,
          newUsers,
          newDrivers
        },
        rides: {
          active: activeRides,
          completed: completedRides,
          total: totalRides
        },
        drivers: {
          pending: pendingDrivers,
          verified: verifiedDrivers,
          total: totalDrivers
        },
        recentActivity: {
          users: recentUsers,
          rides: recentRides
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin)
router.get('/users', authenticateToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('role').optional().isIn(['passenger', 'driver', 'admin']),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.role) {
      query.role = req.query.role;
    }
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasMore: skip + users.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:userId/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin)
router.put('/users/:userId/status', authenticateToken, requireAdmin, [
  body('isActive').isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: req.body.isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send notification to user
    const notificationData = {
      recipient: user._id,
      type: 'system_announcement',
      title: req.body.isActive ? 'Account Activated' : 'Account Deactivated',
      message: req.body.isActive 
        ? 'Your account has been activated and you can now use all features.'
        : 'Your account has been temporarily deactivated. Please contact support for more information.',
      priority: 'high'
    };

    await notificationService.createNotification(notificationData);

    res.json({
      success: true,
      message: `User ${req.body.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/drivers
// @desc    Get all drivers with filtering and pagination
// @access  Private (Admin)
router.get('/drivers', authenticateToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('isVerified').optional().isBoolean()
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.isVerified !== undefined) {
      query.isVerified = req.query.isVerified === 'true';
    }

    const drivers = await Driver.find(query)
      .populate('user', 'firstName lastName email phone createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Driver.countDocuments(query);

    res.json({
      success: true,
      drivers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalDrivers: total,
        hasMore: skip + drivers.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/drivers/:driverId/verify
// @desc    Verify a driver
// @access  Private (Admin)
router.put('/drivers/:driverId/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { isVerified: true },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Send notification to driver
    const notificationData = {
      recipient: driver.user._id,
      type: 'driver_verified',
      title: 'Driver Account Verified',
      message: 'Congratulations! Your driver account has been verified. You can now start offering rides.',
      priority: 'high'
    };

    await notificationService.createNotification(notificationData);

    res.json({
      success: true,
      message: 'Driver verified successfully',
      driver
    });

  } catch (error) {
    console.error('Error verifying driver:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/announcements
// @desc    Send bulk announcement to users
// @access  Private (Admin)
router.post('/announcements', authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('targetUsers').optional().isArray().withMessage('Target users must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, message, priority = 'medium', targetUsers } = req.body;

    let userIds;
    if (targetUsers && targetUsers.length > 0) {
      userIds = targetUsers;
    } else {
      // Send to all active users
      const users = await User.find({ isActive: true }).select('_id');
      userIds = users.map(user => user._id);
    }

    const notificationData = {
      type: 'system_announcement',
      title,
      message,
      priority,
      sender: req.user.userId
    };

    const result = await notificationService.sendBulkNotification(userIds, notificationData);

    res.json({
      success: true,
      message: 'Announcement sent successfully',
      recipientCount: result.count
    });

  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get system analytics
// @access  Private (Admin)
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User registration trends
    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Ride creation trends
    const rideCreations = await Ride.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Rating distribution
    const ratingDistribution = await Rating.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular routes
    const popularRoutes = await Ride.aggregate([
      {
        $group: {
          _id: {
            origin: '$origin.address',
            destination: '$destination.address'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      analytics: {
        userRegistrations,
        rideCreations,
        ratingDistribution,
        popularRoutes
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
