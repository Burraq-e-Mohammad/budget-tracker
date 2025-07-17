const express = require('express');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'bc1e06add01f10cafe660f022492f1d144c9a0c77725cd846843208d70ed4e63'; // Ensure this matches your JWT secret key

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      details: error.message,
    });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, number, role } = req.body;

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      number,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Add User Error:', error);
    res.status(500).json({
      error: 'Failed to add user',
      details: error.message,
    });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, number, role } = req.body;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, number, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      details: error.message,
    });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      details: error.message,
    });
  }
});

module.exports = router;
