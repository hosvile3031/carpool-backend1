const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Ride = require('../models/Ride');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/ratings
// @desc    Create a new rating
// @access  Private
router.post('/', authenticateToken, [
  body('rideId').notEmpty().withMessage('Ride ID is required'),
  body('ratedUserId').notEmpty().withMessage('Rated user ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
  body('categories.punctuality').optional().isInt({ min: 1, max: 5 }),
  body('categories.communication').optional().isInt({ min: 1, max: 5 }),
  body('categories.cleanliness').optional().isInt({ min: 1, max: 5 }),
  body('categories.safety').optional().isInt({ min: 1, max: 5 }),
  body('categories.overall').optional().isInt({ min: 1, max: 5 })
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

    const { rideId, ratedUserId, rating, review, categories } = req.body;
    const userId = req.user.userId;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if the user is part of the ride
    const isDriver = ride.driver.equals(userId);
    const isPassenger = ride.passengers.some(p => p.user.equals(userId));
    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        success: false,
        message: 'You are not part of this ride'
      });
    }

    // Check if the rated user is part of the ride
    const ratedUserIsDriver = ride.driver.equals(ratedUserId);
    const ratedUserIsPassenger = ride.passengers.some(p => p.user.equals(ratedUserId));
    if (!ratedUserIsDriver && !ratedUserIsPassenger) {
      return res.status(403).json({
        success: false,
        message: 'Rated user is not part of this ride'
      });
    }

    // Create rating
    const raterType = isDriver ? 'driver' : 'passenger';
    const ratingData = new Rating({
      ride: rideId,
      ratedBy: userId,
      ratedUser: ratedUserId,
      raterType,
      rating,
      review,
      categories
    });

    await ratingData.save();

    // Update user's average rating
    const userRatings = await Rating.find({ ratedUser: ratedUserId });
    const averageRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;

    await User.findByIdAndUpdate(ratedUserId, {
      'rating.average': averageRating,
      'rating.count': userRatings.length
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: ratingData
    });

  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ratings
// @desc    Get ratings by user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId, page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (userId) {
      query.ratedUser = userId;
    }

    const ratings = await Rating.find(query)
      .populate('ride', 'origin.destination departureTime')
      .populate('ratedBy', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Rating.countDocuments(query);

    res.json({
      success: true,
      ratings,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRatings: total,
        hasMore: skip + ratings.length < total
      }
    });

  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/ratings/:ratingId
// @desc    Get a single rating
// @access  Private
router.get('/:ratingId', authenticateToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId)
      .populate('ride', 'origin.destination departureTime')
      .populate('ratedBy', 'firstName lastName profilePicture');

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    res.json({
      success: true,
      rating
    });

  } catch (error) {
    console.error('Error fetching rating:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

