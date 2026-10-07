import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

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

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    /*
      Demo Admin Account

      Email: admin@messfinder.com
      Password: admin123
    */

    if (
      email === "admin@messfinder.com" &&
      password === "admin123"
    ) {
      const adminSession = {
        name: "Administrator",
        email: "admin@messfinder.com",
        role: "admin",
      };

      localStorage.setItem(
        "messFinderCurrentAdmin",
        JSON.stringify(adminSession)
      );

      navigate("/admin");
      return;
    }

    setError("Invalid admin email or password.");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          🛡️
        </div>

        <h1>Admin Login</h1>

        <p className="auth-subtitle">
          Sign in to access the MessFinder
          administration dashboard.
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="admin@messfinder.com"
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
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Login as Admin
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;
