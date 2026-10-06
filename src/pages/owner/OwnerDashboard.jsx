
import { Link, useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();

  const owner = JSON.parse(
    localStorage.getItem("messFinderCurrentOwner")
  );

  const ownerMesses = JSON.parse(
    localStorage.getItem("messFinderOwnerMesses")
  ) || [];

  if (!owner) {
    return (
      <div className="owner-login-required">
        <span>🔐</span>

        <h1>Owner Login Required</h1>

        <p>
          Please login to access the owner dashboard.
        </p>

        <Link to="/owner/login">
          Owner Login
        </Link>
      </div>
    );
  }

  const myMesses = ownerMesses.filter(
    (mess) => mess.ownerId === owner.id
  );

  const totalSeats = myMesses.reduce(
    (total, mess) =>
      total + Number(mess.seats || 0),
    0
  );

  const handleLogout = () => {
    localStorage.removeItem(
      "messFinderCurrentOwner"
    );

    navigate("/owner/login");
  };

  return (
    <div className="owner-dashboard-page">

      <div className="owner-dashboard-container">

        <div className="owner-dashboard-header">

          <div>
            <p>OWNER DASHBOARD</p>
            <h1>Welcome, {owner.name}</h1>
            <span>
              Manage your mess listings from here.
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <div className="owner-stats">

          <div>
            <span>🏠</span>
            <p>Total Messes</p>
            <strong>{myMesses.length}</strong>
          </div>

          <div>
            <span>🛏</span>
            <p>Available Seats</p>
            <strong>{totalSeats}</strong>
          </div>

          <div>
            <span>👤</span>
            <p>Owner Account</p>
            <strong>Active</strong>
          </div>

        </div>

        <div className="owner-actions">

          <Link
            to="/owner/add-mess"
            className="owner-action-card"
          >
            <span>➕</span>
            <h3>Add New Mess</h3>
            <p>
              Create a new mess listing.
            </p>
          </Link>

          <Link
            to="/owner/manage-mess"
            className="owner-action-card"
          >
            <span>⚙️</span>
            <h3>Manage Messes</h3>
            <p>
              View and delete your listings.
            </p>
          </Link>

          <Link
            to="/find-mess"
            className="owner-action-card"
          >
            <span>👁️</span>
            <h3>Browse Website</h3>
            <p>
              View the student search page.
            </p>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OwnerDashboard;
