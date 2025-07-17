const express = require('express');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const router = express.Router();

const secretKey = 'bc1e06add01f10cafe660f022492f1d144c9a0c77725cd846843208d70ed4e63'; // Ensure this matches your JWT secret key

router.post('/add-budget', async (req, res) => {
  try {
    const { date, transactionName, price } = req.body; // Ensure `price` is used instead of `amount`

    // Extract token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Find the user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Create a new budget entry
    const budgetEntry = {
      date,
      transactionName,
      price, // Use `price` instead of `amount`
    };

    // Add the budget entry to the user's budget entries
    user.budgetEntries.push(budgetEntry);
    await user.save();

    // Calculate the total budget amount
    const totalAmount = user.budgetEntries.reduce((sum, entry) => sum + entry.price, 0);

    // Check if the total budget amount exceeds the user's budget limit
    if (totalAmount > user.amount) {
      return res.status(200).json({
        message: 'Budget entry added, but limit exceeded!',
        budgetEntries: user.budgetEntries,
      });
    }

    res.status(200).json({
      message: 'Budget entry added successfully',
      budgetEntries: user.budgetEntries,
    });
  } catch (error) {
    console.error('Add Budget Entry Error:', error);
    res.status(500).json({
      error: 'Failed to add budget entry',
      details: error.message,
    });
  }
});
// GET /api/expenses/budget-entries
router.get('/budget-entries', async (req, res) => {
  try {
    // Extract token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Return the user's budget entries
    res.status(200).json({
      budgetEntries: user.budgetEntries,
    });
  } catch (error) {
    console.error('Get Budget Entries Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve budget entries',
      details: error.message,
    });
  }
});

// PUT /api/expenses/update-budget/:id
router.put('/update-budget/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, transactionName, price } = req.body;

    // Extract token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Find the budget entry by ID
    const budgetEntry = user.budgetEntries.id(id);

    if (!budgetEntry) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }

    // Update the budget entry
    budgetEntry.date = date;
    budgetEntry.transactionName = transactionName;
    budgetEntry.price = price;

    await user.save();

    res.status(200).json({
      message: 'Budget entry updated successfully',
      budgetEntries: user.budgetEntries,
    });
  } catch (error) {
    console.error('Update Budget Entry Error:', error);
    res.status(500).json({
      error: 'Failed to update budget entry',
      details: error.message,
    });
  }
});

// DELETE /api/expenses/delete-budget/:id
router.delete('/delete-budget/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Extract token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Find the index of the budget entry by ID
    const budgetEntryIndex = user.budgetEntries.findIndex(entry => entry._id.toString() === id);

    if (budgetEntryIndex === -1) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }

    // Remove the budget entry
    user.budgetEntries.splice(budgetEntryIndex, 1);
    await user.save();

    res.status(200).json({
      message: 'Budget entry deleted successfully',
      budgetEntries: user.budgetEntries,
    });
  } catch (error) {
    console.error('Delete Budget Entry Error:', error);
    res.status(500).json({
      error: 'Failed to delete budget entry',
      details: error.message,
    });
  }
});




module.exports = router;
