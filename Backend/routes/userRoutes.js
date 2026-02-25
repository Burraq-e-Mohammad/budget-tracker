const express = require('express');
const User = require('../models/users');
const generateToken = require('../utils/jwt');
const protect = require('../middleware/authMiddleware'); 
const router = express.Router();

// ================= AUTH ROUTES =================

// POST /api/users/SignUp
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

// POST /api/users/SignIn
router.post('/SignIn', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
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

// ================= CRUD ROUTES =================

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ error: 'Failed to retrieve users', details: error.message });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, number, role, password } = req.body;

    const newUser = new User({ firstName, lastName, email, number, role, password });
    await newUser.save();

    res.status(201).json({ 
      message: 'User added successfully', 
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        number: newUser.number,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error('Add User Error:', error);
    res.status(500).json({ error: 'Failed to add user', details: error.message });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, number, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, number, role },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

module.exports = router;
