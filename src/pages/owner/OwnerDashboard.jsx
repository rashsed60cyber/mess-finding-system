import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function OwnerDashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    isOwner,
    loading
  } = useAuth();

  let ownerMesses = [];

  try {
    ownerMesses =
      JSON.parse(
        localStorage.getItem(
          "messFinderOwnerMesses"
        )
      ) || [];
  } catch {
    ownerMesses = [];
  }

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="owner-login-required">
        <span>⏳</span>

        <h1>Loading...</h1>

        <p>
          Please wait while we check your
          account.
        </p>
      </div>
    );
  }

  /* =========================
     OWNER ACCESS CHECK
  ========================= */
  if (!user || !isOwner) {
    return (
      <div className="owner-login-required">

        <span>🔐</span>

        <h1>Owner Login Required</h1>

        <p>
          Please login as a mess owner to
          access the owner dashboard.
        </p>

        <Link to="/owner/login">
          Owner Login
        </Link>

      </div>
    );
  }

  /* =========================
     OWNER'S MESSES
  ========================= */
  const myMesses = ownerMesses.filter(
    (mess) =>
      Number(mess.ownerId) ===
      Number(user.id)
  );

  const totalSeats = myMesses.reduce(
    (total, mess) =>
      total + Number(mess.seats || 0),
    0
  );

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <div className="owner-dashboard-page">

      <div className="owner-dashboard-container">

        {/* HEADER */}

        <div className="owner-dashboard-header">

          <div>

            <p>
              OWNER DASHBOARD
            </p>

            <h1>
              Welcome, {user.name}
            </h1>

            <span>
              Manage your mess listings
              from here.
            </span>

          </div>

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        {/* STATISTICS */}

        <div className="owner-stats">

          <div>

            <span>🏠</span>

            <p>
              Total Messes
            </p>

            <strong>
              {myMesses.length}
            </strong>

          </div>

          <div>

            <span>🛏</span>

            <p>
              Available Seats
            </p>

            <strong>
              {totalSeats}
            </strong>

          </div>

          <div>

            <span>👤</span>

            <p>
              Owner Account
            </p>

            <strong>
              Active
            </strong>

          </div>

        </div>

        {/* OWNER ACTIONS */}

        <div className="owner-actions">

          <Link
            to="/owner/add-mess"
            className="owner-action-card"
          >

            <span>➕</span>

            <h3>
              Add New Mess
            </h3>

            <p>
              Create a new mess listing.
            </p>

          </Link>

          <Link
            to="/owner/manage-mess"
            className="owner-action-card"
          >

            <span>⚙️</span>

            <h3>
              Manage Messes
            </h3>

            <p>
              View, edit and delete your
              listings.
            </p>

          </Link>

          <Link
            to="/find-mess"
            className="owner-action-card"
          >

            <span>👁️</span>

            <h3>
              Browse Website
            </h3>

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
