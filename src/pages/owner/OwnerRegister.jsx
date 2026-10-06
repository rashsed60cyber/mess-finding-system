
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function OwnerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (
      !name ||
      !email ||
      !phone ||
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

    let owners = [];

    try {
      owners =
        JSON.parse(localStorage.getItem("messFinderOwners")) || [];
    } catch {
      owners = [];
    }

    const ownerExists = owners.some(
      (owner) => owner.email.toLowerCase() === email
    );

    if (ownerExists) {
      setError("An owner account with this email already exists.");
      return;
    }

    const newOwner = {
      id: Date.now(),
      name,
      email,
      phone,
      password: formData.password,
      role: "owner",
    };

    localStorage.setItem(
      "messFinderOwners",
      JSON.stringify([...owners, newOwner])
    );

    setSuccess("Owner account created successfully.");

    setTimeout(() => {
      navigate("/owner/login");
    }, 700);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏢</div>

        <h1>Owner Registration</h1>

        <p className="auth-subtitle">
          Create an owner account to list and manage your mess.
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "12px 14px",
              marginBottom: "20px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              color: "#15803d",
              fontSize: "13px",
            }}
          >
            ✓ {success}
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
              required
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
              required
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
              required
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
              required
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
              required
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
