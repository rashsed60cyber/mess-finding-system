
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    const result =
      login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          🏠
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue to MessFinder.
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          <div className="forgot-password">
            <button type="button">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Login
          </button>

        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Link
          to="/owner/login"
          className="owner-account-link"
        >
          🏢 Login as Mess Owner
        </Link>

        <p className="auth-bottom-text">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
