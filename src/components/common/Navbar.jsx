import { NavLink, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getOwner = () => {
    try {
      return JSON.parse(
        localStorage.getItem("messFinderCurrentOwner")
      );
    } catch {
      return null;
    }
  };

  const getAdmin = () => {
    try {
      return JSON.parse(
        localStorage.getItem("messFinderCurrentAdmin")
      );
    } catch {
      return null;
    }
  };

  const getProctor = () => {
    try {
      return JSON.parse(
        localStorage.getItem("messFinderCurrentProctor")
      );
    } catch {
      return null;
    }
  };

  const owner = getOwner();
  const admin = getAdmin();
  const proctor = getProctor();

  const activeRole = admin
    ? "admin"
    : proctor
    ? "proctor"
    : owner
    ? "owner"
    : user
    ? "student"
    : "guest";

  const handleLogout = () => {
    if (activeRole === "student") {
      logout();
    }

    if (activeRole === "owner") {
      localStorage.removeItem(
        "messFinderCurrentOwner"
      );
    }

    if (activeRole === "admin") {
      localStorage.removeItem(
        "messFinderCurrentAdmin"
      );
    }

    if (activeRole === "proctor") {
      localStorage.removeItem(
        "messFinderCurrentProctor"
      );
    }

    navigate("/");
    window.location.reload();
  };

  const getUserName = () => {
    if (activeRole === "admin") {
      return admin?.name || "Administrator";
    }

    if (activeRole === "proctor") {
      return proctor?.name || "Proctor";
    }

    if (activeRole === "owner") {
      return owner?.name || "Mess Owner";
    }

    if (activeRole === "student") {
      return user?.name || "Student";
    }

    return "";
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          <span className="logo-icon">
            🏠
          </span>

          <span>
            Mess
            <span className="logo-highlight">
              Finder
            </span>
          </span>
        </Link>

        <nav className="nav-links">

          {activeRole === "guest" && (
            <>
              <NavLink to="/">
                Home
              </NavLink>

              <NavLink to="/find-mess">
                Find Mess
              </NavLink>

              <NavLink to="/best-match">
                Best Match
              </NavLink>

              <NavLink to="/compare">
                Compare
              </NavLink>
            </>
          )}

          {activeRole === "student" && (
            <>
              <NavLink to="/">
                Home
              </NavLink>

              <NavLink to="/find-mess">
                Find Mess
              </NavLink>

              <NavLink to="/best-match">
                Best Match
              </NavLink>

              <NavLink to="/compare">
                Compare
              </NavLink>

              <NavLink to="/student-support">
                Support
              </NavLink>
            </>
          )}

          {activeRole === "owner" && (
            <>
              <NavLink to="/">
                Home
              </NavLink>

              <NavLink to="/owner/dashboard">
                Dashboard
              </NavLink>

              <NavLink to="/owner/add-mess">
                Add Mess
              </NavLink>

              <NavLink to="/owner/manage-mess">
                Manage Mess
              </NavLink>
            </>
          )}

          {activeRole === "proctor" && (
            <>
              <NavLink to="/">
                Home
              </NavLink>

              <NavLink to="/proctor">
                Proctor Dashboard
              </NavLink>

              <NavLink to="/proctor/reports">
                Reports
              </NavLink>

              <NavLink to="/proctor/visits">
                Mess Visits
              </NavLink>
            </>
          )}

          {activeRole === "admin" && (
            <>
              <NavLink to="/">
                Home
              </NavLink>

              <NavLink to="/admin">
                Admin Dashboard
              </NavLink>

              <NavLink to="/find-mess">
                Listings
              </NavLink>
            </>
          )}

        </nav>

        <div className="nav-actions">

          {activeRole !== "guest" ? (
            <>
              <span className="nav-user">

                {activeRole === "student" && "🎓 "}
                {activeRole === "owner" && "🏠 "}
                {activeRole === "proctor" && "🛡️ "}
                {activeRole === "admin" && "⚙️ "}

                {getUserName()}

              </span>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/choose-login"
                className="login-link"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-register-btn"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;
