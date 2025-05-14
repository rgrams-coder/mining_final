const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order for registration payment
router.post('/create-order', async (req, res) => {
  try {
    const amount = req.body.amount || 1000; // Default to 1000 INR if not provided
    const options = {
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: 'registration_' + Date.now(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// Create order for library access payment
router.post('/create-library-access-order', async (req, res) => {
  try {
    const amount = 15000; // Amount for library access in INR
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: 'library_access_' + Date.now(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating library access order:', error);
    res.status(500).json({ message: 'Error creating library payment order' });
  }
});

// Verify library payment and grant access
router.post('/verify-library-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId // Assuming userId is sent from the frontend after successful login/auth
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified, now update user's library access
      const User = require('../models/User'); // Import User model
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.hasLibraryAccess = true;
      user.libraryPaymentStatus = 'completed';
      await user.save();

      res.json({ verified: true, message: 'Library access granted.' });
    } else {
      res.status(400).json({ verified: false, message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error('Library payment verification error:', error);
    res.status(500).json({ message: 'Error verifying library payment' });
  }
});

module.exports = router;