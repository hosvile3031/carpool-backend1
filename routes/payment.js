const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/payments/initialize
// @desc    Initialize Paystack payment
// @access  Private
router.post('/initialize', authenticateToken, async (req, res) => {
  try {
    const { amount, email } = req.body;

    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    res.json({
      success: true,
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference
    });

  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing payment'
    });
  }
});

// @route   GET /api/payments/verify/:reference
// @desc    Verify Paystack payment
// @access  Private
router.get('/verify/:reference', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    res.json({
      success: response.data.data.status === 'success',
      message: response.data.data.gateway_response,
      data: response.data.data
    });

  } catch (error) {
    console.error('Paystack verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
});

module.exports = router;

