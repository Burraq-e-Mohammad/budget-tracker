// src/components/DashBoard/AppBar/Users.js
import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    role: "",
  });
  const [sortBy, setSortBy] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users", {
        headers: { "Content-Type": "application/json" },
        timeout: 5000, // Set timeout to 5 seconds
      });
      const formattedData = response.data.map((user) => ({
        key: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        number: user.number,
        role: user.role,
      }));
      setUsers(formattedData);
      setFilteredUsers(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      if (error.code === "ECONNREFUSED") {
        alert("Failed to fetch users: Server is not responding. Please check if the backend is running on http://localhost:4000.");
      } else if (error.code === "ERR_NETWORK") {
        alert("Failed to fetch users: Network error. Please check your internet connection.");
      } else {
        alert(`Failed to fetch users: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setNewUser({ firstName: "", lastName: "", email: "", number: "", role: "" });
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUserId(user.key);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      number: user.number,
      role: user.role,
    });
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setNewUser({ firstName: "", lastName: "", email: "", number: "", role: "" });
    setSelectedUserId("");
  };

  const handleAddUser = async () => {
    try {
      // Validate required fields
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role) {
        throw new Error("Please fill in all required fields (First Name, Last Name, Email, Role)");
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        throw new Error("Invalid email format");
      }
      // Validate number format (if provided)
      if (newUser.number && !/^\+?\d{10,15}$/.test(newUser.number)) {
        throw new Error("Invalid phone number format");
      }

      await axios.post("/api/users", newUser, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      alert("User added successfully!");
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding user:", error.message);
      if (error.code === "ECONNREFUSED") {
        alert("Failed to add user: Server is not responding. Please check if the backend is running on http://localhost:4000.");
      } else if (error.code === "ERR_NETWORK") {
        alert("Failed to add user: Network error. Please check your internet connection.");
      } else {
        alert(`Failed to add user: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleEditUser = async () => {
    try {
      // Validate required fields
      if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role) {
        throw new Error("Please fill in all required fields (First Name, Last Name, Email, Role)");
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        throw new Error("Invalid email format");
      }
      // Validate number format (if provided)
      if (newUser.number && !/^\+?\d{10,15}$/.test(newUser.number)) {
        throw new Error("Invalid phone number format");
      }

      await axios.put(`/api/users/${selectedUserId}`, newUser, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      alert("User updated successfully!");
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating user:", error.message);
      if (error.code === "ECONNREFUSED") {
        alert("Failed to update user: Server is not responding. Please check if the backend is running on http://localhost:4000.");
      } else if (error.code === "ERR_NETWORK") {
        alert("Failed to update user: Network error. Please check your internet connection.");
      } else {
        alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/users/${selectedUserId}`, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
      alert("User deleted successfully!");
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting user:", error.message);
      if (error.code === "ECONNREFUSED") {
        alert("Failed to delete user: Server is not responding. Please check if the backend is running on http://localhost:4000.");
      } else if (error.code === "ERR_NETWORK") {
        alert("Failed to delete user: Network error. Please check your internet connection.");
      } else {
        alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleSort = () => {
    let sortedData = [...users];
    if (sortBy === "FirstName") {
      sortedData.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === "Role") {
      sortedData.sort((a, b) => a.role.localeCompare(b.role));
    }
    setFilteredUsers(sortedData);
  };

  const handleFilterBySearch = () => {
    const filteredData = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="table-container">
      <div className="custom-header">
        <div className="header-left">Users</div>
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
              <MenuItem value="FirstName">First Name</MenuItem>
              <MenuItem value="Role">Role</MenuItem>
            </Select>
          </FormControl>
          <TextField
            className="search-box"
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleFilterBySearch()}
          />
          <Button onClick={handleSort} variant="contained" color="primary">
            Apply
          </Button>
          <Button onClick={handleFilterBySearch} variant="contained" color="primary">
            Search
          </Button>
        </div>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading...</td>
            </tr>
          ) : (
            currentUsers.map((user) => (
              <tr key={user.key} className="rows">
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.number}</td>
                <td>{user.role}</td>
                <td>
                  <IconButton className="edit-btn" onClick={() => handleOpenEditDialog(user)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton className="delete-btn" onClick={() => handleOpenDeleteDialog(user.key)}>
                    <FaTrash />
                  </IconButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="custom-footer">
        Showing {currentUsers.length} / {filteredUsers.length}
      </div>
      <Stack spacing={2} sx={{ alignItems: "center", marginTop: "20px" }}>
        <Pagination
          count={Math.ceil(filteredUsers.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Number"
            type="tel"
            fullWidth
            value={newUser.number}
            onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Number"
            type="tel"
            fullWidth
            value={newUser.number}
            onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditUser} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;