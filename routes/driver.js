const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   POST /api/driver/register
// @desc    Register as a driver
// @access  Private
router.post('/register', authenticateToken, upload.single('vehicleImage'), [
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  body('vehicle.make').trim().notEmpty().withMessage('Vehicle make is required'),
  body('vehicle.model').trim().notEmpty().withMessage('Vehicle model is required'),
  body('vehicle.year').isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please enter a valid vehicle year'),
  body('vehicle.licensePlate').trim().notEmpty().withMessage('License plate is required'),
  body('vehicle.color').trim().notEmpty().withMessage('Vehicle color is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { licenseNumber, vehicle } = req.body;
    const userId = req.user.userId;

    // Check if user is already a driver
    const existingDriver = await Driver.findOne({ user: userId });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a driver'
      });
    }

    // Check if license number or license plate already exists
    const duplicateDriver = await Driver.findOne({
      $or: [
        { licenseNumber },
        { 'vehicle.licensePlate': vehicle.licensePlate }
      ]
    });

    if (duplicateDriver) {
      return res.status(400).json({
        success: false,
        message: 'License number or license plate already exists'
      });
    }

    // Parse vehicle object if it's a string (from form data)
    let vehicleData;
    try {
      vehicleData = typeof vehicle === 'string' ? JSON.parse(vehicle) : vehicle;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle data format'
      });
    }

    // Add image path if uploaded
    if (req.file) {
      vehicleData.image = req.file.path;
    }

    // Create driver record
    const driver = new Driver({
      user: userId,
      licenseNumber,
      vehicle: vehicleData
    });

    await driver.save();

    // Update user role to driver
    await User.findByIdAndUpdate(userId, { role: 'driver' });

    // Populate user data for response
    await driver.populate('user', '-password');

    res.status(201).json({
      success: true,
      message: 'Driver registration successful. Your account is pending verification.',
      driver
    });

  } catch (error) {
    console.error('Driver registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during driver registration'
    });
  }
});

// @route   GET /api/driver/profile
// @desc    Get driver profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.userId })
      .populate('user', '-password');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    res.json({
      success: true,
      driver
    });

  } catch (error) {
    console.error('Driver profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/driver/profile
// @desc    Update driver profile
// @access  Private
router.put('/profile', authenticateToken, upload.single('vehicleImage'), [
  body('licenseNumber').optional().trim().notEmpty().withMessage('License number cannot be empty'),
  body('vehicle.make').optional().trim().notEmpty().withMessage('Vehicle make cannot be empty'),
  body('vehicle.model').optional().trim().notEmpty().withMessage('Vehicle model cannot be empty'),
  body('vehicle.year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please enter a valid vehicle year'),
  body('vehicle.licensePlate').optional().trim().notEmpty().withMessage('License plate cannot be empty'),
  body('vehicle.color').optional().trim().notEmpty().withMessage('Vehicle color cannot be empty')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const driver = await Driver.findOne({ user: req.user.userId });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    const updates = req.body;

    // Handle vehicle updates
    if (updates.vehicle) {
      let vehicleData;
      try {
        vehicleData = typeof updates.vehicle === 'string' ? JSON.parse(updates.vehicle) : updates.vehicle;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid vehicle data format'
        });
      }

      // Merge with existing vehicle data
      driver.vehicle = { ...driver.vehicle.toObject(), ...vehicleData };
    }

    // Handle license number update
    if (updates.licenseNumber) {
      driver.licenseNumber = updates.licenseNumber;
    }

    // Handle vehicle image update
    if (req.file) {
      driver.vehicle.image = req.file.path;
    }

    // Mark as unverified if critical info changed
    if (updates.licenseNumber || updates.vehicle) {
      driver.isVerified = false;
    }

    await driver.save();
    await driver.populate('user', '-password');

    res.json({
      success: true,
      message: 'Driver profile updated successfully',
      driver
    });

  } catch (error) {
    console.error('Driver profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/driver/verification-status
// @desc    Get driver verification status
// @access  Private
router.get('/verification-status', authenticateToken, async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.userId })
      .select('isVerified');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    res.json({
      success: true,
      isVerified: driver.isVerified,
      status: driver.isVerified ? 'verified' : 'pending'
    });

  } catch (error) {
    console.error('Verification status fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/driver/stats
// @desc    Get driver statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.userId })
      .select('ridesCompleted ratings');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    res.json({
      success: true,
      stats: {
        ridesCompleted: driver.ridesCompleted,
        averageRating: driver.ratings.average,
        totalRatings: driver.ratings.count
      }
    });

  } catch (error) {
    console.error('Driver stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin route to verify driver (would typically be in admin routes)
// @route   PUT /api/driver/verify/:driverId
// @desc    Verify a driver (Admin only)
// @access  Private (Admin)
router.put('/verify/:driverId', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const driver = await Driver.findById(req.params.driverId)
      .populate('user', 'firstName lastName email');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    driver.isVerified = true;
    await driver.save();

    res.json({
      success: true,
      message: 'Driver verified successfully',
      driver
    });

  } catch (error) {
    console.error('Driver verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
