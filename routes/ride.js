const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Ride = require('../models/Ride');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/rides
// @desc    Create a new ride
// @access  Private
router.post('/', authenticateToken, [
  body('origin.address').notEmpty().withMessage('Origin address is required'),
  body('origin.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('origin.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('destination.address').notEmpty().withMessage('Destination address is required'),
  body('destination.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('destination.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('departureTime').isISO8601().withMessage('Valid departure time is required'),
  body('availableSeats').isInt({ min: 1 }).withMessage('Available seats must be at least 1'),
  body('pricePerSeat').isFloat({ min: 0 }).withMessage('Price per seat must be a positive number')
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

    const driverId = req.user.userId;
    const { origin, destination, departureTime, availableSeats, pricePerSeat, notes } = req.body;

    const ride = new Ride({
      driver: driverId,
      origin: {
        address: origin.address,
        coordinates: {
          latitude: origin.latitude,
          longitude: origin.longitude
        }
      },
      destination: {
        address: destination.address,
        coordinates: {
          latitude: destination.latitude,
          longitude: destination.longitude
        }
      },
      departureTime,
      availableSeats,
      pricePerSeat,
      notes
    });

    await ride.save();

    res.status(201).json({
      success: true,
      message: 'Ride created successfully',
      ride
    });
  } catch (error) {
    console.error('Ride creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during ride creation'
    });
  }
});

// @route   GET /api/rides
// @desc    Get available rides
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    const query = {
      status: 'active',
      departureTime: { $gte: new Date(date || Date.now()) },
      'origin.address': { $regex: origin, $options: 'i' },
      'destination.address': { $regex: destination, $options: 'i' }
    };

    const rides = await Ride.find(query).populate('driver').sort('departureTime');

    res.json({
      success: true,
      rides
    });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/rides/:rideId
// @desc    Get a single ride
// @access  Private
router.get('/:rideId', authenticateToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId).populate('driver passengers.user');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.json({
      success: true,
      ride
    });
  } catch (error) {
    console.error('Error fetching ride:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/rides/:rideId/book
// @desc    Book a ride
// @access  Private
router.put('/:rideId/book', authenticateToken, [
  body('seatsBooked').isInt({ min: 1 }).withMessage('Seats booked must be at least 1'),
  body('paymentReference').notEmpty().withMessage('Payment reference is required')
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

    const { rideId } = req.params;
    const { seatsBooked, paymentReference } = req.body;
    const userId = req.user.userId;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.remainingSeats < seatsBooked) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    ride.passengers.push({
      user: userId,
      seatsBooked,
      paymentReference,
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    await ride.save();

    res.json({
      success: true,
      message: 'Ride booked successfully',
      ride
    });
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during booking'
    });
  }
});

module.exports = router;
