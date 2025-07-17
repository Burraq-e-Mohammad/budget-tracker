// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update this with your backend API URL

// Set up axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const signUp = (userData) => api.post('/users/signup', userData);
export const login = (credentials) => api.post('/users/login', credentials);

// Expense API calls
export const addExpense = (expenseData, token) => api.post('/expenses/add', expenseData, {
  headers: { Authorization: `Bearer ${token}` },
});
export const getExpenses = (token) => api.get('/expenses', {
  headers: { Authorization: `Bearer ${token}` },
});
