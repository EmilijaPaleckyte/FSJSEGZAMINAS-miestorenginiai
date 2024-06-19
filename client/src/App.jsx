import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import About from "./About";
import AdminDashboard from "./AdminDash";
import Contacts from "./Contacts";
import Home from "./Home";
import LogIn from "./LogIn";
import Profile from "./Profile";
import Signup from "./Signup";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [authorizationLevel, setAuthorizationLevel] = useState(() => {
    const level = localStorage.getItem("authorizationLevel");
    return level ? parseInt(level, 10) : 0;
  });

  const handleLogout = () => {
    setUser(null);
    setAuthorizationLevel(0);
    localStorage.removeItem("user");
    localStorage.removeItem("authorizationLevel");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={
            <LogIn
              setUser={setUser}
              setAuthorizationLevel={setAuthorizationLevel}
            />
          }
        />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/about" element={<About />} />
        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/signup" replace />
            )
          }
        />
        {/* Admin Dashboard Route */}
        <Route
          path="/admindash"
          element={
            authorizationLevel > 0 ? (
              <AdminDashboard handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Redirect to login if user tries to access admin route without sufficient authorization */}
        <Route
          path="/admin"
          element={
            authorizationLevel > 0 ? (
              <Navigate to="/admindash" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
