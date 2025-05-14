const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, paymentId, orderId, signature, ...otherFields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Verify payment signature
    const sign = orderId + '|' + paymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      ...otherFields,
      email,
      username,
      password: hashedPassword,
      paymentStatus: 'completed',
      paymentId: paymentId
    });

    await user.save();

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        hasLibraryAccess: user.hasLibraryAccess,
        libraryPaymentStatus: user.libraryPaymentStatus
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Check username/email availability endpoint
router.post('/check-availability', async (req, res) => {
  try {
    const { username, email } = req.body;
    let usernameAvailable = true;
    let emailAvailable = true;

    if (username) {
      const userByUsername = await User.findOne({ username });
      if (userByUsername) usernameAvailable = false;
    }
    if (email) {
      const userByEmail = await User.findOne({ email });
      if (userByEmail) emailAvailable = false;
    }
    res.json({ usernameAvailable, emailAvailable });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ message: 'Server error during availability check' });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        status: user.status,
        hasLibraryAccess: user.hasLibraryAccess,
        libraryPaymentStatus: user.libraryPaymentStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile endpoint
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by username endpoint
router.get('/profile/:username', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile endpoint
router.put('/update/:username', authenticateToken, async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the authenticated user is updating their own profile
    if (req.user.username !== req.params.username) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Update user fields
    const updateFields = { ...req.body };
    delete updateFields.password; // Prevent password update through this endpoint
    delete updateFields.username; // Prevent username update
    delete updateFields.email; // Prevent email update

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;