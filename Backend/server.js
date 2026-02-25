const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const PORT = process.env.PORT || 4000;

// Import API routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expensesRoutes');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cors());


// API Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
