import "./styles/AdminDash.css";

import { useEffect, useState } from "react";

import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/users", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/events", {
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error.response?.data || error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin/categories",
        {
          withCredentials: true,
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error
      );
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!newRole) {
      alert("Role is required");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/users/${userId}/update-role`,
        { role: newRole },
        { withCredentials: true }
      );
      console.log(response.data);
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error(
        `Error updating role for user ${userId}:`,
        error.response?.data || error
      );
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/admin/users/${userId}/promote-to-admin`,
        null,
        { withCredentials: true }
      );
      console.log(response.data);
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error(
        `Error promoting user ${userId} to admin:`,
        error.response?.data || error
      );
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/events/${eventId}/approve`,
        null,
        { withCredentials: true }
      );
      console.log(response.data);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error(
        `Error approving event ${eventId}:`,
        error.response?.data || error
      );
    }
  };

  const handleBlockEvent = async (eventId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/events/${eventId}/block`,
        null,
        { withCredentials: true }
      );
      console.log(response.data);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error(
        `Error blocking event ${eventId}:`,
        error.response?.data || error
      );
    }
  };

  const handleCreateCategory = async () => {
    const categoryName = prompt("Enter new category name:");
    if (!categoryName) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/admin/categories`,
        { name: categoryName },
        { withCredentials: true }
      );
      console.log(response.data);
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      console.error("Error creating category:", error.response?.data || error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <h3>Users:</h3>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Username</th>
            <th className="th">Email</th>
            <th className="th">Role</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="td">{user.username}</td>
              <td className="td">{user.email}</td>
              <td className="td">{user.role}</td>
              <td className="td">
                {user.role !== "admin" && (
                  <>
                    <button
                      className="button"
                      onClick={() => handleUpdateRole(user.id, "admin")}
                    >
                      Make Admin
                    </button>
                    <button
                      className="button"
                      onClick={() => handleUpdateRole(user.id, "user")}
                    >
                      Make User
                    </button>
                  </>
                )}
                {user.role === "user" && (
                  <button
                    className="button"
                    onClick={() => handlePromoteToAdmin(user.id)}
                  >
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3>Events:</h3>
        <table className="table">
          <thead>
            <tr>
              <th className="th">Title</th>
              <th className="th">Category</th>
              <th className="th">Status</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan="4">No events available</td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id}>
                <td className="td">{event.title}</td>
                <td className="td">{event.category}</td>
                <td className="td">{event.status}</td>
                <td className="td">
                  {event.status === "pending" && (
                    <>
                      <button
                        className="button"
                        onClick={() => handleApproveEvent(event.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="button"
                        onClick={() => handleBlockEvent(event.id)}
                      >
                        Block
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="button" onClick={handleCreateCategory}>
          Create Category
        </button>

        <h3>Categories:</h3>
        <ul>
          {categories.length === 0 && <li>No categories available</li>}
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
