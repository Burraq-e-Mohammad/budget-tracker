const express = require('express');
const User = require('../models/users');
const generateToken = require('../utils/jwt');
const router = express.Router();

// User sign-up route
router.post('/SignUp', async (req, res) => {
  console.log("Received sign up data:", req.body);
  try {
    const { firstName, lastName, email, password, amount } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ firstName, lastName, email, password, amount });

    await user.save();

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      amount: user.amount,
      token: generateToken(user._id),
      message: 'Sign up successful'
    });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user', details: error.message });
  }
});

// User sign-in route
router.post('/SignIn', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await user.comparePassword(password))) {
      // Generate a token and respond with user info
      const token = generateToken(user._id);
      res.json({
        email: user.email,
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', details: error.message });
  }
});

module.exports = router;
