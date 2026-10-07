
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function ProctorLogin() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    /*
      DEMO PROCTOR ACCOUNT

      Email:
      proctor@mbstu.ac.bd

      Password:
      proctor123
    */

    if (
      email === "proctor@mbstu.ac.bd" &&
      password === "proctor123"
    ) {
      /*
        Only one role active at a time.
      */

      logout();

      localStorage.removeItem(
        "messFinderCurrentOwner"
      );

      localStorage.removeItem(
        "messFinderCurrentAdmin"
      );

      const proctorSession = {
        id: "proctor-1",
        name: "MBSTU Proctor",
        email: "proctor@mbstu.ac.bd",
        role: "proctor",
      };

      localStorage.setItem(
        "messFinderCurrentProctor",
        JSON.stringify(proctorSession)
      );

      navigate("/proctor");

      window.location.reload();

      return;
    }

    setError(
      "Invalid proctor email or password."
    );
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🛡️
        </div>

        <h1>
          Proctor Login
        </h1>

        <p className="auth-subtitle">
          Access the student accommodation
          welfare and mess monitoring system.
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">

            <label>
              Official Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="proctor@mbstu.ac.bd"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Login as Proctor
          </button>

        </form>

        <p className="auth-bottom-text">
          ←{" "}
          <Link to="/choose-login">
            Back to Login Options
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ProctorLogin;
