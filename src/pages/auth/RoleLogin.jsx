
import { Link } from "react-router-dom";

function RoleLogin() {
  return (
    <div className="role-login-page">

      <div className="role-login-container">

        <div className="role-login-heading">

          <span className="role-login-badge">
            🎓 MBSTU STUDENT ACCOMMODATION
          </span>

          <h1>
            Welcome to MessFinder
          </h1>

          <p>
            Choose how you want to access the
            MessFinder platform.
          </p>

        </div>

        <div className="role-login-grid">

          <Link
            to="/login"
            className="role-login-card"
          >
            <div className="role-login-icon">
              🎓
            </div>

            <h2>Student</h2>

            <p>
              Find messes, compare rooms,
              read reviews and get student
              welfare support.
            </p>

            <span>
              Student Login →
            </span>
          </Link>

          <Link
            to="/owner/login"
            className="role-login-card"
          >
            <div className="role-login-icon">
              🏠
            </div>

            <h2>Mess Owner</h2>

            <p>
              Add your mess, manage rooms,
              seats, rent, facilities and
              availability.
            </p>

            <span>
              Owner Login →
            </span>
          </Link>

          <Link
            to="/proctor/login"
            className="role-login-card"
          >
            <div className="role-login-icon">
              🛡️
            </div>

            <h2>University Proctor</h2>

            <p>
              Review student welfare reports,
              manage mess visits and follow up
              accommodation concerns.
            </p>

            <span>
              Proctor Login →
            </span>
          </Link>

          <Link
            to="/admin/login"
            className="role-login-card"
          >
            <div className="role-login-icon">
              ⚙️
            </div>

            <h2>Administrator</h2>

            <p>
              Manage users, owners, listings,
              moderation and system activity.
            </p>

            <span>
              Admin Login →
            </span>
          </Link>

        </div>

        <div className="role-login-footer">

          <p>
            New student?
            {" "}
            <Link to="/register">
              Create Student Account
            </Link>
          </p>

          <p>
            New mess owner?
            {" "}
            <Link to="/owner/register">
              Register as Mess Owner
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default RoleLogin;
