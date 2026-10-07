import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function OwnerLogin() {
  const navigate = useNavigate();

  const { loginOwner } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    let owners = [];

    try {
      owners =
        JSON.parse(
          localStorage.getItem(
            "messFinderOwners"
          )
        ) || [];
    } catch {
      owners = [];
    }

    const owner = owners.find(
      (item) =>
        item.email
          .trim()
          .toLowerCase() === email &&
        item.password === password
    );

    if (!owner) {
      setError(
        "Invalid email or password."
      );

      return;
    }

    /*
      AuthContext will:
      1. Create the owner session
      2. Save messFinderCurrentOwner
      3. Remove any student session
      4. Update Navbar immediately
    */
    loginOwner(owner);

    navigate("/owner/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🏢
        </div>

        <h1>
          Owner Login
        </h1>

        <p className="auth-subtitle">
          Login to manage your mess listings.
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="owner@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Login as Owner
          </button>

        </form>

        <p className="auth-bottom-text">

          Don't have an owner account?{" "}

          <Link to="/owner/register">
            Register as Owner
          </Link>

        </p>

        <p className="auth-bottom-text">

          Student?{" "}

          <Link to="/login">
            Student Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default OwnerLogin;
