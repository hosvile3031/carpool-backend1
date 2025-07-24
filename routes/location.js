const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/location/geocode
// @desc    Geocode an address into latitude and longitude
// @access  Private
router.get('/geocode', authenticateToken, async (req, res) => {
  try {
    const { address } = req.query;

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const { results } = response.data;
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const { lat, lng } = results[0].geometry.location;
    res.json({
      success: true,
      location: {
        latitude: lat,
        longitude: lng
      }
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      success: false,
      message: 'Error geocoding address'
    });
  }
});

// @route   GET /api/location/directions
// @desc    Get directions between two locations
// @access  Private
router.get('/directions', authenticateToken, async (req, res) => {
  try {
    const { origin, destination } = req.query;

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const { routes } = response.data;
    if (routes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      route: routes[0]
    });

  } catch (error) {
    console.error('Directions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting directions'
    });
  }
});

module.exports = router;

