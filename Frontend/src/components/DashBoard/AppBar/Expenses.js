import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import LinearProgressWithLabel from "./LinearProgress"; // Import the new component
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "./Expenses.css";
import { getAllExpenses, addExpense, updateExpense, deleteExpense } from "./expensesServices";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [currentExpense, setCurrentExpense] = useState({
    transactionName: "",
    price: "",
    date: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortBy, setSortBy] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Assume a max expenditure for normalization (e.g., 10000 PKR)
  const MAX_EXPENDITURE = 10000; // Adjust based on your use case

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      const formattedData = data.map((expense) => ({
        key: expense._id,
        transactionName: expense.transactionName,
        expenditure: (parseFloat(expense.price) / MAX_EXPENDITURE) * 100, // Normalize to percentage
        price: parseFloat(expense.price),
        date: new Date(expense.date).toLocaleDateString(),
        user: expense.userId?.email || "Unknown",
      }));
      setExpenses(formattedData);
      setFilteredExpenses(formattedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("Failed to fetch expenses");
    }
  };

  const handleOpenAddDialog = () => {
    setCurrentExpense({ transactionName: "", price: "", date: "" });
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (expense) => {
    setSelectedExpenseId(expense.key);
    setCurrentExpense({
      transactionName: expense.transactionName,
      price: expense.price,
      date: expense.date,
    });
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setCurrentExpense({ transactionName: "", price: "", date: "" });
    setSelectedExpenseId("");
  };

  const handleSubmit = async (isEditing) => {
    try {
      if (isEditing) {
        await updateExpense(selectedExpenseId, currentExpense);
        alert("Expense updated successfully!");
      } else {
        await addExpense(currentExpense);
        alert("Expense added successfully!");
      }
      fetchExpenses();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpense(selectedExpenseId);
      alert("Expense deleted successfully!");
      fetchExpenses();
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  const handleSort = () => {
    let sortedData = [...expenses];
    if (sortBy === "Date") {
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "Expenditure") {
      sortedData.sort((a, b) => b.price - a.price);
    }
    if (selectedDate) {
      sortedData = sortedData.filter(
        (item) => new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
      );
    }
    setFilteredExpenses(sortedData);
  };

  const handleFilterBySearch = () => {
    const filteredData = expenses.filter((item) =>
      item.transactionName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredExpenses(filteredData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="table-container">
      <div className="expenses-top">
      </div>
      <div className="custom-header">
        <div className="header-left">Expenses</div>
                <div className="btn-container">
          <Button variant="contained" onClick={handleOpenAddDialog}>
            Add Expense
          </Button>
        </div>
        <div className="header-right">
          <FormControl variant="outlined" style={{ height: "40px" }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              style={{ height: "40px" }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="Expenditure">Expenditure</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Filter by Date"
          />
          <TextField
            className="search-box"
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSort} variant="contained" color="primary">
            Apply
          </Button>
          <Button onClick={handleFilterBySearch} variant="contained" color="primary">
            Search
          </Button>
        </div>
      </div>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Total Expenditure</th>
            <th>Price(PKR)</th>
            <th>Date</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.key}>
              <td>{item.transactionName}</td>
              <td>
                <LinearProgressWithLabel value={item.expenditure} />
              </td>
              <td>{item.price}</td>
              <td>{item.date}</td>
              <td>{item.user}</td>
              <td>
                <IconButton className="edit-btn" onClick={() => handleOpenEditDialog(item)}>
                  <FaEdit />
                </IconButton>
                <IconButton className="delete-btn" onClick={() => handleOpenDeleteDialog(item.key)}>
                  <FaTrash />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="custom-footer">
        Showing {currentData.length} / {filteredExpenses.length}
      </div>
      <Stack spacing={2} sx={{ alignItems: "center", marginTop: "20px" }}>
        <Pagination
          count={Math.ceil(filteredExpenses.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* Add Expense Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Transaction Name"
            fullWidth
            value={currentExpense.transactionName}
            onChange={(e) =>
              setCurrentExpense({ ...currentExpense, transactionName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price(PKR)"
            fullWidth
            value={currentExpense.price}
            onChange={(e) =>
              setCurrentExpense({ ...currentExpense, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentExpense.date}
            onChange={(e) =>
              setCurrentExpense({ ...currentExpense, date: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(false)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Transaction Name"
            fullWidth
            value={currentExpense.transactionName}
            onChange={(e) =>
              setCurrentExpense({ ...currentExpense, transactionName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price(PKR)"
            fullWidth
            value={currentExpense.price}
            onChange={(e) =>
              setCurrentExpense({ ...currentExpense, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentExpense.date}
            onChange={(e) =>
              setCurrentExpense({ ...currentExpense, date: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(true)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this expense?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Expenses;