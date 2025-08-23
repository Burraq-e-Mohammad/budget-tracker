const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


// Directly specifying MongoDB URI and port
const MONGODB_URI = 'mongodb+srv://bq:9ts0xwZiySYM4yAs@cluster0.2h0lv.mongodb.net/budget-tracker?retryWrites=true&w=majority&appName=Cluster0';
const PORT = 4000;

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

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
