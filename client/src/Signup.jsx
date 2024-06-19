import "./styles/UsersButton.css";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useState } from "react";

function Signup() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3005/signup", values, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data.Status === "Success") {
          navigate("/login");
        } else {
          setError(`Server responded with an error: ${res.data.Error}`);
        }
      })
      .catch((err) => {
        console.error("Error during signup:", err);
        setError("An error occurred during signup.");
      });
  };

  return (
    <div className="bg-white p-3 rounded" style={{ width: "300px" }}>
      <h2>Registracija</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username">
            <strong>Slapyvardis</strong>
          </label>
          <input
            type="text"
            placeholder="Įveskite slapyvardį"
            name="username"
            onChange={(e) => setValues({ ...values, username: e.target.value })}
            className="form-control rounded-0"
            value={values.username}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email">
            <strong>El. paštas</strong>
          </label>
          <input
            type="email"
            placeholder="Įveskite el. paštą"
            name="email"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            className="form-control rounded-0"
            value={values.email}
            required
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
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            className="form-control rounded-0"
            value={values.password}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-100 rounded-0 button"
        >
          Užsiregistruoti
        </button>
        <Link
          to="/login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none button" style={{ color: "#6c757d" }}
        >
          Prisijungti
        </Link>
        <button
          type="button"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none button" style={{ color: "#6c757d" }}
          onClick={() => navigate("/")}
        >
          Atšaukti
        </button>
      </form>
    </div>
  );
}

export default Signup;
