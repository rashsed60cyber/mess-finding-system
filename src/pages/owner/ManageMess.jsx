
import { useState } from "react";
import { Link } from "react-router-dom";

function ManageMess() {

  const owner = JSON.parse(
    localStorage.getItem(
      "messFinderCurrentOwner"
    )
  );

  const [messes, setMesses] = useState(() => {
    const saved =
      JSON.parse(
        localStorage.getItem(
          "messFinderOwnerMesses"
        )
      ) || [];

    if (!owner) {
      return [];
    }

    return saved.filter(
      (mess) =>
        mess.ownerId === owner.id
    );
  });

  if (!owner) {
    return (
      <div className="owner-login-required">

        <span>🔐</span>

        <h1>
          Owner Login Required
        </h1>

        <Link to="/owner/login">
          Owner Login
        </Link>

      </div>
    );
  }

  const deleteMess = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this mess?"
      );

    if (!confirmDelete) {
      return;
    }

    const allMesses =
      JSON.parse(
        localStorage.getItem(
          "messFinderOwnerMesses"
        )
      ) || [];

    const updatedAll =
      allMesses.filter(
        (mess) => mess.id !== id
      );

    localStorage.setItem(
      "messFinderOwnerMesses",
      JSON.stringify(updatedAll)
    );

    setMesses(
      updatedAll.filter(
        (mess) =>
          mess.ownerId === owner.id
      )
    );
  };

  return (
    <div className="manage-mess-page">

      <div className="manage-mess-container">

        <div className="manage-header">

          <div>
            <p>OWNER PANEL</p>

            <h1>
              Manage Your Messes
            </h1>

            <span>
              {messes.length} listing
              {messes.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          <div className="manage-header-actions">

            <Link
              to="/owner/dashboard"
              className="dashboard-back-btn"
            >
              Dashboard
            </Link>

            <Link
              to="/owner/add-mess"
              className="add-new-mess-btn"
            >
              + Add Mess
            </Link>

          </div>

        </div>

        {messes.length === 0 ? (

          <div className="owner-empty-state">

            <span>🏠</span>

            <h2>
              No Mess Added Yet
            </h2>

            <p>
              Create your first mess listing.
            </p>

            <Link to="/owner/add-mess">
              + Add Your First Mess
            </Link>

          </div>

        ) : (

          <div className="owner-mess-list">

            {messes.map((mess) => (

              <div
                className="owner-mess-card"
                key={mess.id}
              >

                <div className="owner-mess-image">

                  {mess.image ? (

                    <img
                      src={`${import.meta.env.BASE_URL}${mess.image}`}
                      alt={mess.name}
                    />

                  ) : (

                    <div>
                      <span>🏠</span>
                      <small>
                        Photo will be added later
                      </small>
                    </div>

                  )}

                </div>

                <div className="owner-mess-content">

                  <span className="owner-status">
                    ● Active
                  </span>

                  <h2>
                    {mess.name}
                  </h2>

                  <p>
                    📍 {mess.area}
                  </p>

                  <div className="owner-mess-stats">

                    <span>
                      💰 ৳{mess.rent}
                    </span>

                    <span>
                      📏 {mess.distance}m
                    </span>

                    <span>
                      🛏 {mess.seats} seats
                    </span>

                  </div>

                </div>

                <div className="owner-card-actions">

                  <button
                    type="button"
                    onClick={() =>
                      deleteMess(mess.id)
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ManageMess;
