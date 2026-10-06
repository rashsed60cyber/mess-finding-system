
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2>🏠 MessFinder</h2>
          <p>
            A web-based mess finding system designed to help students
            find suitable accommodation easily.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/find-mess">Find Mess</Link>
          <Link to="/best-match">Best Match</Link>
          <Link to="/compare">Compare</Link>
        </div>

        <div className="footer-section">
          <h3>Account</h3>

          <Link to="/login">Student Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/owner/login">Mess Owner</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} MessFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
