
import { useState } from "react";
import { Link } from "react-router-dom";
import getAllMesses from "../utils/getAllMesses";

const getRent = (mess) => {
  const rents = Array.isArray(mess.rooms)
    ? mess.rooms
        .map((room) => Number(room.rentPerSeat))
        .filter((value) => Number.isFinite(value) && value > 0)
    : [];

  return rents.length
    ? Math.min(...rents)
    : Number(mess.rent) || 0;
};

const getSeats = (mess) => {
  if (mess.availableSeats != null) {
    return Number(mess.availableSeats) || 0;
  }

  if (Array.isArray(mess.rooms) && mess.rooms.length) {
    return mess.rooms.reduce(
      (sum, room) =>
        sum + (Number(room.availableSeats) || 0),
      0
    );
  }

  return Number(mess.seats) || 0;
};

const getTotalSeats = (mess) =>
  Number(mess.totalSeats) ||
  (Array.isArray(mess.rooms)
    ? mess.rooms.reduce(
        (sum, room) => sum + (Number(room.totalSeats) || 0),
        0
      )
    : Number(mess.seats) || 0);

const hasFacility = (mess, name) =>
  mess.facilities?.[name] === true || mess[name] === true;

const hasMeal = (mess) =>
  mess.mealInfo?.available === true || mess.meal === true;

const hasSingleRoom = (mess) =>
  mess.singleRoom === true ||
  (Array.isArray(mess.rooms) &&
    mess.rooms.some((room) =>
      String(room.type || "").toLowerCase().includes("single")
    ));

const formatMoney = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;

const yesNo = (value) =>
  value ? (
    <span className="available">✓ Available</span>
  ) : (
    <span className="unavailable">✕ No</span>
  );

const imageUrl = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) return image;

  return `${import.meta.env.BASE_URL}${String(image).replace(
    /^\/+/,
    ""
  )}`;
};

function Compare() {
  const messes = getAllMesses().filter(
    (mess) =>
      String(mess.verificationStatus || "").toLowerCase() !==
      "rejected"
  );

  const [selectedIds, setSelectedIds] = useState([
    "",
    "",
    ""
  ]);

  const handleSelect = (index, value) => {
    setSelectedIds((previous) =>
      previous.map((id, position) =>
        position === index ? value : id
      )
    );
  };

  const selectedMesses = selectedIds
    .map((id) =>
      id
        ? messes.find(
            (mess) => String(mess.id) === String(id)
          )
        : null
    )
    .filter(Boolean);

  const isAlreadySelected = (messId, currentIndex) =>
    selectedIds.some(
      (id, index) =>
        index !== currentIndex &&
        id !== "" &&
        String(id) === String(messId)
    );

  const clearComparison = () => {
    setSelectedIds(["", "", ""]);
  };

  const rows = [
    {
      label: "💰 Monthly Rent (From)",
      render: (mess) => (
        <strong>{formatMoney(getRent(mess))}</strong>
      )
    },
    {
      label: "📏 Campus Distance",
      render: (mess) => `${mess.distance ?? "N/A"}m`
    },
    {
      label: "👥 Mess Type",
      render: (mess) => mess.gender || "Not specified"
    },
    {
      label: "🚪 Total Rooms",
      render: (mess) =>
        mess.totalRooms ??
        (Array.isArray(mess.rooms) ? mess.rooms.length : 0)
    },
    {
      label: "🛏 Available Seats",
      render: (mess) =>
        `${getSeats(mess)} / ${getTotalSeats(mess)}`
    },
    {
      label: "🛡️ Verification",
      render: (mess) =>
        mess.verified ? (
          <span className="available">✓ Verified</span>
        ) : (
          <span>Pending Verification</span>
        )
    },
    {
      label: "📶 WiFi",
      render: (mess) => yesNo(hasFacility(mess, "wifi"))
    },
    {
      label: "🍚 Meal System",
      render: (mess) => yesNo(hasMeal(mess))
    },
    {
      label: "🔥 Gas",
      render: (mess) => yesNo(hasFacility(mess, "gas"))
    },
    {
      label: "🚪 Single Room",
      render: (mess) => yesNo(hasSingleRoom(mess))
    },
    {
      label: "📹 CCTV",
      render: (mess) => yesNo(hasFacility(mess, "cctv"))
    },
    {
      label: "💡 IPS",
      render: (mess) => yesNo(hasFacility(mess, "ips"))
    },
    {
      label: "🚿 Total Washrooms",
      render: (mess) =>
        mess.washroom?.total ?? "Not specified"
    },
    {
      label: "🧹 Washroom Condition",
      render: (mess) =>
        mess.washroom?.condition || "Not specified"
    },
    {
      label: "🍽️ Meal Cost",
      render: (mess) =>
        hasMeal(mess)
          ? formatMoney(mess.mealInfo?.monthlyCost)
          : "Not available"
    },
    {
      label: "⭐ Student Rating",
      render: (mess) => {
        const rating = Number(mess.rating) || 0;
        return rating > 0
          ? `${rating.toFixed(1)} / 5`
          : "Not rated";
      }
    },
    {
      label: "📝 Reviews",
      render: (mess) =>
        mess.reviewCount ??
        (Array.isArray(mess.reviews)
          ? mess.reviews.length
          : 0)
    },
    {
      label: "📞 Owner Contact",
      render: (mess) =>
        mess.contact?.phone || "Not specified"
    }
  ];

  return (
    <div className="compare-page">
      <section className="compare-header">
        <span>⚖️ MESS COMPARISON</span>
        <h1>Compare Messes</h1>
        <p>
          Compare up to three student accommodations near
          MBSTU side by side.
        </p>
      </section>

      <div className="compare-container">
        <section className="compare-selector">
          <div className="compare-selector-heading">
            <div>
              <h2>Select Messes</h2>
              <p>Choose at least two messes to compare.</p>
            </div>

            <button
              type="button"
              onClick={clearComparison}
            >
              ↺ Clear
            </button>
          </div>

          <div className="compare-select-grid">
            {[0, 1, 2].map((index) => (
              <div className="compare-select-box" key={index}>
                <label>
                  {index === 0
                    ? "First Mess"
                    : index === 1
                      ? "Second Mess"
                      : "Third Mess (Optional)"}
                </label>

                <select
                  value={selectedIds[index]}
                  onChange={(event) =>
                    handleSelect(index, event.target.value)
                  }
                >
                  <option value="">Select a mess</option>

                  {messes.map((mess) => (
                    <option
                      key={mess.id}
                      value={mess.id}
                      disabled={isAlreadySelected(
                        mess.id,
                        index
                      )}
                    >
                      {mess.name} — {mess.area} (
                      {formatMoney(getRent(mess))})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {selectedMesses.length >= 2 ? (
          <section className="comparison-section">
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>

                    {selectedMesses.map((mess, index) => (
                      <th key={mess.id}>
                        <div className="compare-mess-heading">
                          <div className="compare-photo-placeholder">
                            {mess.image ? (
                              <img
                                src={imageUrl(mess.image)}
                                alt={mess.name}
                              />
                            ) : (
                              <>
                                <span>🏠</span>
                                <small>Photo coming later</small>
                              </>
                            )}
                          </div>

                          <h3>{mess.name}</h3>
                          <p>📍 {mess.area}</p>

                          <span className="compare-label">
                            MESS {index + 1}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label}>
                      <td>
                        <strong>{row.label}</strong>
                      </td>

                      {selectedMesses.map((mess) => (
                        <td key={mess.id}>
                          {row.render(mess)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr>
                    <td>
                      <strong>🔎 Full Details</strong>
                    </td>

                    {selectedMesses.map((mess) => (
                      <td key={mess.id}>
                        <Link
                          className="compare-view-btn"
                          to={`/mess/${mess.id}`}
                        >
                          View Details →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p
              style={{
                marginTop: 16,
                color: "#64748b",
                fontSize: 13
              }}
            >
              Information is based on available listing data.
              Verify rent, availability and facilities with
              the owner before making a decision.
            </p>
          </section>
        ) : (
          <div className="compare-empty">
            <span>⚖️</span>
            <h2>Start Comparing</h2>
            <p>
              Select at least two messes above to see their
              detailed comparison.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;

