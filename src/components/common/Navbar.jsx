import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          <span className="logo-icon">🏠</span>
          <span>
            Mess<span className="logo-highlight">Finder</span>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/find-mess">Find Mess</NavLink>
          <NavLink to="/best-match">Best Match</NavLink>
          <NavLink to="/compare">Compare</NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="login-link">
            Login
          </Link>

          <Link to="/register" className="nav-register-btn">
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
