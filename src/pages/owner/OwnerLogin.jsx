
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function OwnerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const owners =
      JSON.parse(localStorage.getItem("messFinderOwners")) || [];

    const ownerExists = owners.some(
      (owner) =>
        owner.email.toLowerCase() ===
        formData.email.trim().toLowerCase()
    );

    if (ownerExists) {
      setError("An owner account with this email already exists.");
      return;
    }

    const newOwner = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: "owner"
    };

    localStorage.setItem(
      "messFinderOwners",
      JSON.stringify([...owners, newOwner])
    );

    navigate("/owner/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          🏢
        </div>

        <h1>Owner Registration</h1>

        <p className="auth-subtitle">
          Create an owner account to list and manage your mess.
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>Owner Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="owner@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="01XXXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter password again"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Create Owner Account
          </button>

        </form>

        <p className="auth-bottom-text">
          Already registered?{" "}
          <Link to="/owner/login">
            Owner Login
          </Link>
        </p>

        <p className="auth-bottom-text">
          Are you a student?{" "}
          <Link to="/register">
            Student Registration
          </Link>
        </p>

      </div>
    </div>
  );
}

export default OwnerRegister;
