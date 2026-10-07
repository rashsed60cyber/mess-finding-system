
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function ManageMess() {
  const getOwner = () => {
    try {
      return JSON.parse(
        localStorage.getItem("messFinderCurrentOwner")
      );
    } catch {
      return null;
    }
  };

  const owner = getOwner();

  const [messes, setMesses] = useState(() => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem("messFinderOwnerMesses")
        ) || [];

      if (!owner || !Array.isArray(saved)) {
        return [];
      }

      return saved.filter(
        (mess) => mess.ownerId === owner.id
      );
    } catch {
      return [];
    }
  });

  const summary = useMemo(() => {
    const totalRooms = messes.reduce(
      (sum, mess) =>
        sum +
        Number(
          mess.totalRooms ||
            mess.rooms?.length ||
            0
        ),
      0
    );

    const totalSeats = messes.reduce(
      (sum, mess) =>
        sum +
        Number(
          mess.totalSeats ||
            mess.seats ||
            0
        ),
      0
    );

    const availableSeats = messes.reduce(
      (sum, mess) =>
        sum +
        Number(
          mess.availableSeats ??
            mess.seats ??
            0
        ),
      0
    );

    const pendingVerification =
      messes.filter(
        (mess) =>
          mess.verificationStatus ===
          "Pending Verification"
      ).length;

    return {
      totalRooms,
      totalSeats,
      availableSeats,
      pendingVerification,
    };
  }, [messes]);

  if (!owner) {
    return (
      <div className="owner-login-required">
        <span>🔐</span>

        <h1>Owner Login Required</h1>

        <p>
          Please sign in as a mess owner to manage
          your listings.
        </p>

        <Link to="/owner/login">
          Owner Login
        </Link>
      </div>
    );
  }

  const deleteMess = (id) => {
    const selectedMess = messes.find(
      (mess) => mess.id === id
    );

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${
        selectedMess?.name || "this mess"
      }"? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    let allMesses = [];

    try {
      allMesses =
        JSON.parse(
          localStorage.getItem(
            "messFinderOwnerMesses"
          )
        ) || [];
    } catch {
      allMesses = [];
    }

    const updatedAll = allMesses.filter(
      (mess) => mess.id !== id
    );

    localStorage.setItem(
      "messFinderOwnerMesses",
      JSON.stringify(updatedAll)
    );

    setMesses(
      updatedAll.filter(
        (mess) => mess.ownerId === owner.id
      )
    );
  };

  const getVerificationStatus = (mess) => {
    if (mess.verificationStatus) {
      return mess.verificationStatus;
    }

    if (mess.verified) {
      return "Verified";
    }

    return "Pending Verification";
  };

  const getStatusClass = (status) => {
    const normalized =
      status.toLowerCase();

    if (normalized.includes("verified")) {
      if (normalized.includes("pending")) {
        return "pending";
      }

      return "verified";
    }

    if (
      normalized.includes("rejected") ||
      normalized.includes("suspended")
    ) {
      return "rejected";
    }

    return "pending";
  };

  const getAvailableSeats = (mess) => {
    if (
      mess.availableSeats !== undefined &&
      mess.availableSeats !== null
    ) {
      return Number(mess.availableSeats);
    }

    if (Array.isArray(mess.rooms)) {
      return mess.rooms.reduce(
        (sum, room) =>
          sum +
          Number(room.availableSeats || 0),
        0
      );
    }

    return Number(mess.seats || 0);
  };

  const getTotalSeats = (mess) => {
    if (mess.totalSeats) {
      return Number(mess.totalSeats);
    }

    if (Array.isArray(mess.rooms)) {
      return mess.rooms.reduce(
        (sum, room) =>
          sum +
          Number(room.totalSeats || 0),
        0
      );
    }

    return Number(mess.seats || 0);
  };

  const getRoomCount = (mess) => {
    if (mess.totalRooms) {
      return Number(mess.totalRooms);
    }

    return Array.isArray(mess.rooms)
      ? mess.rooms.length
      : 0;
  };

  const getRent = (mess) => {
    if (mess.rent) {
      return Number(mess.rent);
    }

    if (Array.isArray(mess.rooms)) {
      const rents = mess.rooms
        .map((room) =>
          Number(room.rentPerSeat || 0)
        )
        .filter((rent) => rent > 0);

      if (rents.length) {
        return Math.min(...rents);
      }
    }

    return 0;
  };

  const getFacilities = (mess) => {
    if (!mess.facilities) {
      return [];
    }

    const facilityLabels = {
      wifi: "WiFi",
      gas: "Gas",
      water: "Water",
      electricity: "Electricity",
      studyTable: "Study Table",
      balcony: "Balcony",
      cctv: "CCTV",
      securityGuard: "Security",
      generator: "Generator",
      ips: "IPS",
      parking: "Parking",
      kitchen: "Kitchen",
      dining: "Dining",
      commonRoom: "Common Room",
      laundry: "Laundry",
      hotWater: "Hot Water",
    };

    return Object.entries(
      mess.facilities
    )
      .filter(([, enabled]) =>
        Boolean(enabled)
      )
      .map(
        ([key]) =>
          facilityLabels[key] || key
      );
  };

  const formatUpdatedDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return "Not available";
    }

    return parsed.toLocaleDateString();
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
              Manage accommodation details,
              availability and listing information.
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


        <div className="owner-manage-summary">

          <div className="owner-summary-card">
            <span>🏠</span>

            <div>
              <strong>
                {messes.length}
              </strong>

              <small>
                Total Listings
              </small>
            </div>
          </div>

          <div className="owner-summary-card">
            <span>🚪</span>

            <div>
              <strong>
                {summary.totalRooms}
              </strong>

              <small>
                Total Rooms
              </small>
            </div>
          </div>

          <div className="owner-summary-card">
            <span>🛏️</span>

            <div>
              <strong>
                {summary.availableSeats}
                <em>
                  /{summary.totalSeats}
                </em>
              </strong>

              <small>
                Available Seats
              </small>
            </div>
          </div>

          <div className="owner-summary-card">
            <span>🛡️</span>

            <div>
              <strong>
                {summary.pendingVerification}
              </strong>

              <small>
                Pending Verification
              </small>
            </div>
          </div>

        </div>


        {messes.length === 0 ? (
          <div className="owner-empty-state">

            <span>🏠</span>

            <h2>
              No Mess Added Yet
            </h2>

            <p>
              Create your first detailed
              accommodation listing for students.
            </p>

            <Link to="/owner/add-mess">
              + Add Your First Mess
            </Link>

          </div>
        ) : (
          <div className="owner-detailed-mess-list">

            {messes.map((mess) => {
              const verificationStatus =
                getVerificationStatus(mess);

              const availableSeats =
                getAvailableSeats(mess);

              const totalSeats =
                getTotalSeats(mess);

              const roomCount =
                getRoomCount(mess);

              const rent =
                getRent(mess);

              const facilities =
                getFacilities(mess);

              const mealAvailable =
                Boolean(
                  mess.meal ||
                    mess.mealInfo?.available
                );

              return (
                <article
                  className="owner-detailed-card"
                  key={mess.id}
                >

                  <div className="owner-detailed-image">

                    {mess.image ? (
                      <img
                        src={`${import.meta.env.BASE_URL}${mess.image}`}
                        alt={mess.name}
                      />
                    ) : (
                      <div>
                        <span>🏠</span>

                        <small>
                          Photos can be added later
                        </small>
                      </div>
                    )}

                    <span
                      className={`owner-verification-badge ${getStatusClass(
                        verificationStatus
                      )}`}
                    >
                      {verificationStatus ===
                      "Verified"
                        ? "✓ "
                        : "● "}

                      {verificationStatus}
                    </span>

                  </div>


                  <div className="owner-detailed-content">

                    <div className="owner-detailed-title">

                      <div>
                        <span className="owner-listing-type">
                          {mess.gender ||
                            "Student"}{" "}
                          Accommodation
                        </span>

                        <h2>
                          {mess.name}
                        </h2>

                        <p>
                          📍{" "}
                          {mess.area ||
                            "Area not specified"}

                          {mess.address
                            ? ` • ${mess.address}`
                            : ""}
                        </p>
                      </div>

                      <div className="owner-seat-status">
                        <strong>
                          {availableSeats}
                        </strong>

                        <span>
                          seats available
                        </span>
                      </div>

                    </div>


                    <div className="owner-detail-stats">

                      <div>
                        <span>
                          Rent From
                        </span>

                        <strong>
                          ৳{rent || 0}
                        </strong>

                        <small>
                          per seat/month
                        </small>
                      </div>

                      <div>
                        <span>
                          Rooms
                        </span>

                        <strong>
                          {roomCount}
                        </strong>

                        <small>
                          listed rooms
                        </small>
                      </div>

                      <div>
                        <span>
                          Seats
                        </span>

                        <strong>
                          {availableSeats}/
                          {totalSeats}
                        </strong>

                        <small>
                          available / total
                        </small>
                      </div>

                      <div>
                        <span>
                          Distance
                        </span>

                        <strong>
                          {mess.distance || 0}m
                        </strong>

                        <small>
                          from campus
                        </small>
                      </div>

                    </div>


                    <div className="owner-manage-info-grid">

                      <div>
                        <span>
                          🍽️ Meal System
                        </span>

                        <strong>
                          {mealAvailable
                            ? "Available"
                            : "Not Available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          🚿 Washrooms
                        </span>

                        <strong>
                          {mess.washroom?.total ||
                            "Not specified"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          👨‍🍳 Cook / Khala
                        </span>

                        <strong>
                          {mess.mealInfo?.cook
                            ?.name ||
                            "Not specified"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          🕒 Last Updated
                        </span>

                        <strong>
                          {formatUpdatedDate(
                            mess.updatedAt ||
                              mess.createdAt
                          )}
                        </strong>
                      </div>

                    </div>


                    <div className="owner-facility-preview">

                      <span className="owner-preview-label">
                        Facilities
                      </span>

                      <div>
                        {facilities.length > 0 ? (
                          <>
                            {facilities
                              .slice(0, 6)
                              .map(
                                (facility) => (
                                  <span
                                    key={
                                      facility
                                    }
                                  >
                                    ✓{" "}
                                    {facility}
                                  </span>
                                )
                              )}

                            {facilities.length >
                              6 && (
                              <span>
                                +
                                {facilities.length -
                                  6}{" "}
                                more
                              </span>
                            )}
                          </>
                        ) : (
                          <span>
                            No facilities
                            specified
                          </span>
                        )}
                      </div>

                    </div>


                    {mess.description && (
                      <p className="owner-description-preview">
                        {mess.description}
                      </p>
                    )}


                    <div className="owner-detailed-footer">

                      <div className="owner-listing-note">
                        Listing ID:{" "}
                        <strong>
                          {mess.id}
                        </strong>
                      </div>

                      <div className="owner-card-actions">

                        <Link
                          to={`/mess/${mess.id}`}
                          className="owner-view-btn"
                        >
                          👁 View Details
                        </Link>

                        <Link
                          to={`/owner/edit-mess/${mess.id}`}
                          className="owner-edit-btn"
                        >
                          ✏️ Edit
                        </Link>

                        <button
                          type="button"
                          className="owner-delete-btn"
                          onClick={() =>
                            deleteMess(
                              mess.id
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default ManageMess;
