
import { useState } from "react";
import {
  NavLink,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const roleLinks = {
  guest: [
    { to: "/", label: "Home" },
    { to: "/find-mess", label: "Find Mess" },
    { to: "/best-match", label: "Best Match" },
    { to: "/compare", label: "Compare" }
  ],
  student: [
    { to: "/", label: "Home" },
    { to: "/find-mess", label: "Find Mess" },
    { to: "/best-match", label: "Best Match" },
    { to: "/compare", label: "Compare" },
    { to: "/student-support", label: "Support" }
  ],
  owner: [
    { to: "/", label: "Home" },
    { to: "/owner/dashboard", label: "Dashboard" },
    { to: "/owner/add-mess", label: "Add Mess" },
    { to: "/owner/manage-mess", label: "Manage Mess" }
  ],
  proctor: [
    { to: "/", label: "Home" },
    { to: "/proctor", label: "Proctor Dashboard" },
    { to: "/proctor/reports", label: "Reports" },
    { to: "/proctor/visits", label: "Mess Visits" }
  ],
  admin: [
    { to: "/", label: "Home" },
    { to: "/admin", label: "Admin Dashboard" },
    { to: "/find-mess", label: "Listings" }
  ]
};

function readSession(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const owner = readSession("messFinderCurrentOwner");
  const admin = readSession("messFinderCurrentAdmin");
  const proctor = readSession("messFinderCurrentProctor");

  const activeRole = admin
    ? "admin"
    : proctor
    ? "proctor"
    : owner
    ? "owner"
    : user
    ? "student"
    : "guest";

  const links = roleLinks[activeRole];

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

  const roleIcon = {
    student: "🎓",
    owner: "🏠",
    proctor: "🛡️",
    admin: "⚙️"
  };

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();

    if (activeRole === "student") {
      logout();
    }

    localStorage.removeItem("messFinderCurrentOwner");
    localStorage.removeItem("messFinderCurrentAdmin");
    localStorage.removeItem("messFinderCurrentProctor");

    navigate("/");
    window.location.reload();
  };

  const renderLinks = () =>
    links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === "/"}
        onClick={closeMenu}
      >
        {link.label}
      </NavLink>
    ));

  return (
    <header className="navbar">
      <div className="nav-container">

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">🏠</span>
          <span>
            Mess
            <span className="logo-highlight">
              Finder
            </span>
          </span>
        </Link>

        <nav
          className="nav-links desktop-nav-links"
          aria-label="Main navigation"
        >
          {renderLinks()}
        </nav>

        <div className="nav-actions desktop-nav-actions">
          {activeRole !== "guest" ? (
            <>
              <span className="nav-user">
                {roleIcon[activeRole]} {getUserName()}
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

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`mobile-nav-panel ${
          menuOpen ? "mobile-nav-open" : ""
        }`}
        hidden={!menuOpen}
      >
        {activeRole !== "guest" && (
          <div className="mobile-nav-user">
            {roleIcon[activeRole]} {getUserName()}
          </div>
        )}

        <nav
          className="mobile-nav-links"
          aria-label="Mobile navigation"
        >
          {renderLinks()}
        </nav>

        <div className="mobile-nav-actions">
          {activeRole !== "guest" ? (
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/choose-login"
                className="login-link"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-register-btn"
                onClick={closeMenu}
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

