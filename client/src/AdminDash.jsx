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
      console.error(
        "Klaida gaunant vartotojus:",
        error.response?.data || error
      );
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/events", {
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Klaida gaunant įvykius:", error.response?.data || error);
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
        "Klaida gaunant kategorijas:",
        error.response?.data || error
      );
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!newRole) {
      alert("Reikia nurodyti rolę");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/users/${userId}/update-role`,
        { role: newRole },
        { withCredentials: true }
      );
      console.log(response.data);
      fetchUsers(); // Atnaujinti vartotojų sąrašą
    } catch (error) {
      console.error(
        `Klaida atnaujinant vartotojo rolę ${userId}:`,
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
      fetchUsers(); // Atnaujinti vartotojų sąrašą
    } catch (error) {
      console.error(
        `Klaida paskiriant vartotoją ${userId} kaip administratorių:`,
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
      fetchEvents(); // Atnaujinti įvykių sąrašą
    } catch (error) {
      console.error(
        `Klaida patvirtinant įvykį ${eventId}:`,
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
      fetchEvents(); // Atnaujinti įvykių sąrašą
    } catch (error) {
      console.error(
        `Klaida blokuojant įvykį ${eventId}:`,
        error.response?.data || error
      );
    }
  };

  const handleCreateCategory = async () => {
    const categoryName = prompt("Įveskite naujos kategorijos pavadinimą:");
    if (!categoryName) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/admin/categories`,
        { name: categoryName },
        { withCredentials: true }
      );
      console.log(response.data);
      fetchCategories(); // Atnaujinti kategorijų sąrašą
    } catch (error) {
      console.error(
        "Klaida kuriant kategoriją:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="container">
      <h2>Administratoriaus skydas</h2>

      <h3>Vartotojai:</h3>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Vartotojo vardas</th>
            <th className="th">El. paštas</th>
            <th className="th">Rolė</th>
            <th className="th">Veiksmai</th>
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
                      Paskirti administratoriumi
                    </button>
                    <button
                      className="button"
                      onClick={() => handleUpdateRole(user.id, "user")}
                    >
                      Paskirti vartotoju
                    </button>
                  </>
                )}
                {user.role === "user" && (
                  <button
                    className="button"
                    onClick={() => handlePromoteToAdmin(user.id)}
                  >
                    Paskirti administratoriumi
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3>Įvykiai:</h3>
        <table className="table">
          <thead>
            <tr>
              <th className="th">Pavadinimas</th>
              <th className="th">Kategorija</th>
              <th className="th">Būsena</th>
              <th className="th">Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan="4">Nėra įvykių</td>
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
                        Patvirtinti
                      </button>
                      <button
                        className="button"
                        onClick={() => handleBlockEvent(event.id)}
                      >
                        Blokuoti
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="button" onClick={handleCreateCategory}>
          Sukurti kategoriją
        </button>

        <h3>Kategorijos:</h3>
        <ul>
          {categories.length === 0 && <li>Nėra kategorijų</li>}
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
