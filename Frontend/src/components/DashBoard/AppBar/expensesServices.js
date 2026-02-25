import axios from "axios";

const API_URL = "/api/expenses";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllExpenses = async () => {
  const response = await axios.get(`${API_URL}/budget-entries`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return response.data.budgetEntries;
};

export const addExpense = async (expense) => {
  const response = await axios.post(`${API_URL}/add-budget`, expense, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const updateExpense = async (id, expense) => {
  const response = await axios.put(`${API_URL}/update-budget/${id}`, expense, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/delete-budget/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return response.data;
};