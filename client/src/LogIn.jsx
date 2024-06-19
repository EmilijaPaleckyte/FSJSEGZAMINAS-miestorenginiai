import { Link, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import axios from "axios";
import { useState } from "react";

const LogIn = ({ setUser, setAuthorizationLevel }) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3005/login", values)
      .then((res) => {
        console.log("Server response:", res.data);
        if (res.data.Status === "Success") {
          const userData = {
            email: values.email, 
            role: res.data.Role,
            isAdmin: res.data.isAdmin,
          };
          setUser(userData);
          const authorizationLevel = res.data.isAdmin
            ? 5
            : res.data.Role === "user"
            ? 1
            : 0;
          setAuthorizationLevel(authorizationLevel);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem(
            "authorizationLevel",
            authorizationLevel.toString()
          );
          navigate("/profile");
        } else {
          setError(`Server responded with an error.`);
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        setError("An error occurred during login.");
      });
  };

  return (
    <div
      className="bg-white p-3 rounded"
      style={{ minWidth: "300px", maxWidth: "400px", width: "100%" }}
    >
      <h2>Prisijungimas</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email">
            <strong>El. paštas</strong>
          </label>
          <input
            type="email"
            placeholder="Įveskite el. paštą"
            name="email"
            className="form-control rounded-8"
            required
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">
            <strong>Slaptažodis</strong>
          </label>
          <input
            type="password"
            placeholder="Įveskite slaptažodį"
            name="password"
            className="form-control rounded-8"
            required
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-success w-100 rounded-0">
          Prisijungti
        </button>
        <Link
          to="/signup"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Sukurti paskyrą
        </Link>
        <button
          type="button"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          onClick={() => navigate("/")}
        >
          Atšaukti
        </button>
      </form>
    </div>
  );
};

LogIn.propTypes = {
  setUser: PropTypes.func.isRequired,
  setAuthorizationLevel: PropTypes.func.isRequired,
};

export default LogIn;
