const express = require('express');
const User = require('../models/users');
const { randomUUID } = require('crypto');
const router = express.Router();

router.post('/add-budget', async (req, res) => {
  try {
    const { date, transactionName, price } = req.body; // Ensure `price` is used instead of `amount`
    // For simplicity, attach expenses to the first user in the store
    let user = await User.first();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Create a new budget entry
    const budgetEntry = {
      _id: randomUUID(),
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
    // Return budget entries for the first user
    const user = await User.first();

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

    // Use the first user for budgeting
    const user = await User.first();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Find the budget entry by ID
    const index = user.budgetEntries.findIndex((entry) => entry._id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }

    // Update the budget entry
    user.budgetEntries[index] = {
      ...user.budgetEntries[index],
      date,
      transactionName,
      price,
    };

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
    // Use the first user for budgeting
    const user = await User.first();

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
