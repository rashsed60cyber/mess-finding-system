

import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "messFinderOwnerMesses";

function readJSON(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function getStatus(mess) {
  if (mess.verified === true) return "Verified";

  const status = String(
    mess.verificationStatus || ""
  ).toLowerCase();

  if (status.includes("reject")) return "Rejected";
  if (status.includes("verif") && !status.includes("pending")) {
    return "Verified";
  }

  return "Pending Verification";
}

function AdminDashboard() {
  const [ownerMesses, setOwnerMesses] = useState(() => {
    const saved = readJSON(STORAGE_KEY);
    return Array.isArray(saved) ? saved : [];
  });

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const students = readJSON("messFinderUsers");
  const owners = readJSON("messFinderOwners");

  const studentCount = Array.isArray(students)
    ? students.length
    : 0;

  const ownerCount = Array.isArray(owners)
    ? owners.length
    : 0;

  const verifiedCount = ownerMesses.filter(
    (mess) => getStatus(mess) === "Verified"
  ).length;

  const pendingCount = ownerMesses.filter(
    (mess) => getStatus(mess) === "Pending Verification"
  ).length;

  const rejectedCount = ownerMesses.filter(
    (mess) => getStatus(mess) === "Rejected"
  ).length;

  const updateStatus = (id, status) => {
    const action =
      status === "Verified"
        ? "verify"
        : status === "Rejected"
          ? "reject"
          : "move back to pending";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this listing?`
    );

    if (!confirmed) return;

    const latest = readJSON(STORAGE_KEY);

    if (!Array.isArray(latest)) {
      setMessage("Unable to load saved listings.");
      return;
    }

    const existing = latest.find(
      (mess) => String(mess.id) === String(id)
    );

    if (!existing) {
      setMessage("Listing was not found.");
      return;
    }

    const updated = latest.map((mess) => {
      if (String(mess.id) !== String(id)) {
        return mess;
      }

      return {
        ...mess,
        verified: status === "Verified",
        verificationStatus:
          status === "Pending Verification"
            ? "Pending Verification"
            : status,
        verifiedAt:
          status === "Verified"
            ? new Date().toISOString()
            : null,
        updatedAt: new Date().toISOString()
      };
    });

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
      setOwnerMesses(updated);
      setMessage(`Listing status updated to ${status}.`);
    } catch {
      setMessage("Unable to save verification status.");
    }
  };

  const deleteListing = (id) => {
    const confirmed = window.confirm(
      "Permanently delete this mess listing? This cannot be undone."
    );

    if (!confirmed) return;

    const latest = readJSON(STORAGE_KEY);

    if (!Array.isArray(latest)) {
      setMessage("Unable to load saved listings.");
      return;
    }

    const updated = latest.filter(
      (mess) => String(mess.id) !== String(id)
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
      setOwnerMesses(updated);
      setMessage("Listing deleted successfully.");
    } catch {
      setMessage("Unable to delete listing.");
    }
  };

  const visibleMesses = ownerMesses.filter((mess) => {
    const status = getStatus(mess);

    const matchesFilter =
      filter === "All" || filter === status;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [
        mess.name,
        mess.area,
        mess.address,
        mess.ownerEmail
      ]
        .some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

    return matchesFilter && matchesSearch;
  });

  const statusStyle = (status) => {
    const styles = {
      Verified: {
        background: "#dcfce7",
        color: "#166534"
      },
      Rejected: {
        background: "#fee2e2",
        color: "#991b1b"
      },
      "Pending Verification": {
        background: "#fef3c7",
        color: "#92400e"
      }
    };

    return {
      ...styles[status],
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "nowrap"
    };
  };

  const actionButton = (background) => ({
    border: "none",
    borderRadius: 7,
    background,
    color: "#ffffff",
    padding: "8px 11px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer"
  });

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-heading">
          <p>ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <span>
            Manage listings, verification and system overview.
          </span>
        </div>

        <div className="admin-stats">
          <div>
            <span>🎓</span>
            <strong>{studentCount}</strong>
            <p>Registered Students</p>
          </div>

          <div>
            <span>👨‍💼</span>
            <strong>{ownerCount}</strong>
            <p>Mess Owners</p>
          </div>

          <div>
            <span>🏠</span>
            <strong>{ownerMesses.length}</strong>
            <p>Total Owner Listings</p>
          </div>

          <div>
            <span>🟢</span>
            <strong>{verifiedCount}</strong>
            <p>Verified Listings</p>
          </div>

          <div>
            <span>🟡</span>
            <strong>{pendingCount}</strong>
            <p>Pending Verification</p>
          </div>

          <div>
            <span>🔴</span>
            <strong>{rejectedCount}</strong>
            <p>Rejected Listings</p>
          </div>
        </div>

        <section className="admin-section">
          <h2>🏠 Owner Mess Listings</h2>

          <p style={{ color: "#64748b", marginBottom: 18 }}>
            Review accommodation listings and update their
            verification status.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20
            }}
          >
            <input
              type="search"
              placeholder="Search mess name, area or owner..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{
                flex: "1 1 240px",
                padding: 12,
                border: "1px solid #cbd5e1",
                borderRadius: 9
              }}
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              style={{
                padding: 12,
                border: "1px solid #cbd5e1",
                borderRadius: 9
              }}
            >
              <option value="All">All Listings</option>
              <option value="Pending Verification">
                Pending Verification
              </option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {message && (
            <p
              role="status"
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                padding: 12,
                borderRadius: 9,
                marginBottom: 18
              }}
            >
              {message}
            </p>
          )}

          {visibleMesses.length === 0 ? (
            <div className="admin-empty">
              No listings found.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mess</th>
                    <th>Area</th>
                    <th>Rent</th>
                    <th>Seats</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleMesses.map((mess) => {
                    const status = getStatus(mess);

                    const seats =
                      mess.availableSeats ??
                      mess.seats ??
                      0;

                    return (
                      <tr key={mess.id}>
                        <td>
                          <strong>{mess.name}</strong>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 5
                            }}
                          >
                            ID: {mess.id}
                          </div>
                        </td>

                        <td>{mess.area || "N/A"}</td>

                        <td>
                          ৳{Number(mess.rent || 0).toLocaleString()}
                        </td>

                        <td>{seats}</td>

                        <td>{mess.gender || "N/A"}</td>

                        <td>
                          <span style={statusStyle(status)}>
                            {status}
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 7,
                              minWidth: 190
                            }}
                          >
                            <Link
                              to={`/mess/${mess.id}`}
                              style={{
                                ...actionButton("#2563eb"),
                                textDecoration: "none"
                              }}
                            >
                              👁 View
                            </Link>

                            {status !== "Verified" && (
                              <button
                                type="button"
                                style={actionButton("#16a34a")}
                                onClick={() =>
                                  updateStatus(mess.id, "Verified")
                                }
                              >
                                ✓ Verify
                              </button>
                            )}

                            {status !== "Rejected" && (
                              <button
                                type="button"
                                style={actionButton("#ea580c")}
                                onClick={() =>
                                  updateStatus(mess.id, "Rejected")
                                }
                              >
                                ✕ Reject
                              </button>
                            )}

                            {status !== "Pending Verification" && (
                              <button
                                type="button"
                                style={actionButton("#64748b")}
                                onClick={() =>
                                  updateStatus(
                                    mess.id,
                                    "Pending Verification"
                                  )
                                }
                              >
                                ↺ Pending
                              </button>
                            )}

                            <button
                              type="button"
                              style={actionButton("#dc2626")}
                              onClick={() =>
                                deleteListing(mess.id)
                              }
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p
          style={{
            marginTop: 24,
            color: "#64748b",
            fontSize: 13
          }}
        >
          Demo mode: Verification changes are saved in this
          browser only. Production requires secure admin
          authentication and a shared database.
        </p>

      </div>
    </div>
  );
}

export default AdminDashboard;

