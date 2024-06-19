import "./styles/AdminDash.css";

import { useEffect, useState } from "react";

import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
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
      console.error(`Error updating role for user ${userId}:`, error.response?.data || error);
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
      console.error(`Error promoting user ${userId} to admin:`, error.response?.data || error);
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
                    <button className="button" onClick={() => handleUpdateRole(user.id, "admin")}>
                      Make Admin
                    </button>
                    <button className="button" onClick={() => handleUpdateRole(user.id, "user")}>
                      Make User
                    </button>
                  </>
                )}
                {user.role === "user" && (
                  <button className="button" onClick={() => handlePromoteToAdmin(user.id)}>
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
