const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('unreadOnly').optional().isBoolean().withMessage('UnreadOnly must be boolean')
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
    const unreadOnly = req.query.unreadOnly === 'true';

    const query = { recipient: req.user.userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.userId,
      isRead: false
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasMore: skip + notifications.length < total
      },
      unreadCount
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/:notificationId/mark-read
// @desc    Mark notification as read
// @access  Private
router.put('/:notificationId/mark-read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.notificationId,
        recipient: req.user.userId 
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { 
        recipient: req.user.userId,
        isRead: false 
      },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/notifications/:notificationId
// @desc    Delete a notification
// @access  Private
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      recipient: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.post('/preferences', authenticateToken, [
  body('email').optional().isBoolean().withMessage('Email preference must be boolean'),
  body('push').optional().isBoolean().withMessage('Push preference must be boolean'),
  body('sms').optional().isBoolean().withMessage('SMS preference must be boolean')
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

    const User = require('../models/User');
    const updateData = {};
    
    if (req.body.email !== undefined) {
      updateData['preferences.notifications.email'] = req.body.email;
    }
    if (req.body.push !== undefined) {
      updateData['preferences.notifications.push'] = req.body.push;
    }
    if (req.body.sms !== undefined) {
      updateData['preferences.notifications.sms'] = req.body.sms;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Notification preferences updated',
      preferences: user.preferences.notifications
    });

  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Notification.aggregate([
      { $match: { recipient: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          },
          byType: {
            $push: {
              type: '$type',
              isRead: '$isRead'
            }
          }
        }
      }
    ]);

    const typeStats = {};
    if (stats.length > 0) {
      stats[0].byType.forEach(item => {
        if (!typeStats[item.type]) {
          typeStats[item.type] = { total: 0, unread: 0 };
        }
        typeStats[item.type].total++;
        if (!item.isRead) {
          typeStats[item.type].unread++;
        }
      });
    }

    res.json({
      success: true,
      stats: {
        total: stats.length > 0 ? stats[0].total : 0,
        unread: stats.length > 0 ? stats[0].unread : 0,
        byType: typeStats
      }
    });

  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
