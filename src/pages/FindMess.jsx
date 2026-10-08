
import { useState } from "react";
import getAllMesses from "../utils/getAllMesses";
import MessCard from "../components/mess/MessCard";

const initialFilters = {
  area: "",
  maxRent: "",
  maxDistance: "",
  gender: "",
  minSeats: "",
  wifi: false,
  meal: false,
  gas: false,
  singleRoom: false,
  verified: false,
  sortBy: "default"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #dbe3ec",
  borderRadius: "10px",
  background: "#fff",
  font: "inherit",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "7px",
  color: "#334155"
};

function FindMess() {
  const [filters, setFilters] = useState(initialFilters);
  const [searchText, setSearchText] = useState("");

  const allMesses = getAllMesses();

  const areas = [
    ...new Set(
      allMesses
        .map((mess) => String(mess.area || "").trim())
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b));

  const getAvailableSeats = (mess) => {
    if (mess.availableSeats !== undefined &&
        mess.availableSeats !== null) {
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

  const getRent = (mess) => {
    const roomRents = Array.isArray(mess.rooms)
      ? mess.rooms
          .map((room) => Number(room.rentPerSeat))
          .filter((rent) => Number.isFinite(rent) && rent > 0)
      : [];

    if (roomRents.length) {
      return Math.min(...roomRents);
    }

    return Number(mess.rent) || 0;
  };

  const hasFacility = (mess, key) => {
    return (
      mess.facilities?.[key] === true ||
      mess[key] === true
    );
  };

  const hasMeal = (mess) => {
    return (
      mess.mealInfo?.available === true ||
      mess.meal === true
    );
  };

  const hasSingleRoom = (mess) => {
    return (
      mess.singleRoom === true ||
      (Array.isArray(mess.rooms) &&
        mess.rooms.some((room) =>
          String(room.type || "")
            .toLowerCase()
            .includes("single")
        ))
    );
  };

  const filteredMesses = allMesses
    .filter((mess) => {
      const query = searchText.trim().toLowerCase();

      const searchMatch =
        !query ||
        [
          mess.name,
          mess.area,
          mess.address,
          mess.university
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

      const areaMatch =
        !filters.area ||
        String(mess.area || "").toLowerCase() ===
          filters.area.toLowerCase();

      const rent = getRent(mess);

      const rentMatch =
        !filters.maxRent ||
        (rent > 0 && rent <= Number(filters.maxRent));

      const distanceMatch =
        !filters.maxDistance ||
        Number(mess.distance) <= Number(filters.maxDistance);

      const genderMatch =
        !filters.gender ||
        String(mess.gender || "").toLowerCase() ===
          filters.gender.toLowerCase();

      const seatsMatch =
        !filters.minSeats ||
        getAvailableSeats(mess) >= Number(filters.minSeats);

      const wifiMatch =
        !filters.wifi || hasFacility(mess, "wifi");

      const mealMatch =
        !filters.meal || hasMeal(mess);

      const gasMatch =
        !filters.gas || hasFacility(mess, "gas");

      const singleMatch =
        !filters.singleRoom || hasSingleRoom(mess);

      const verifiedMatch =
        !filters.verified || mess.verified === true;

      // Rejected listings should not appear in student search.
      const notRejected =
        String(mess.verificationStatus || "")
          .toLowerCase() !== "rejected";

      return (
        searchMatch &&
        areaMatch &&
        rentMatch &&
        distanceMatch &&
        genderMatch &&
        seatsMatch &&
        wifiMatch &&
        mealMatch &&
        gasMatch &&
        singleMatch &&
        verifiedMatch &&
        notRejected
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "rentLow":
          return getRent(a) - getRent(b);

        case "rentHigh":
          return getRent(b) - getRent(a);

        case "distance":
          return Number(a.distance || 0) -
            Number(b.distance || 0);

        case "seats":
          return getAvailableSeats(b) -
            getAvailableSeats(a);

        case "rating":
          return Number(b.rating || 0) -
            Number(a.rating || 0);

        default:
          return 0;
      }
    });

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchText("");
  };

  const activeFilters = [
    filters.area,
    filters.maxRent,
    filters.maxDistance,
    filters.gender,
    filters.minSeats,
    filters.wifi,
    filters.meal,
    filters.gas,
    filters.singleRoom,
    filters.verified
  ].filter(Boolean).length;

  return (
    <div className="find-mess-page">
      <section className="find-header">
        <p className="page-label">
          MBSTU STUDENT ACCOMMODATION
        </p>

        <h1>Find Your Perfect Mess</h1>

        <p>
          Explore student accommodation near Mawlana Bhashani
          Science and Technology University.
        </p>

        <div className="main-search">
          <span>🔍</span>
          <input
            type="search"
            placeholder="Search by mess name, area or address..."
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />
        </div>
      </section>

      <section className="mess-search-container">
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 22,
            marginBottom: 28
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                🔎 Search Filters
              </h2>
              <p style={{ color: "#64748b", marginTop: 5 }}>
                {activeFilters} active filters
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              style={{
                padding: "10px 16px",
                borderRadius: 9,
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              ↺ Reset Filters
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16
            }}
          >
            <div>
              <label style={labelStyle}>Area</label>
              <select
                style={inputStyle}
                value={filters.area}
                onChange={(event) =>
                  updateFilter("area", event.target.value)
                }
              >
                <option value="">All Areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Maximum Rent (৳)</label>
              <input
                type="number"
                min="0"
                style={inputStyle}
                placeholder="e.g. 5000"
                value={filters.maxRent}
                onChange={(event) =>
                  updateFilter("maxRent", event.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                Maximum Distance (meters)
              </label>
              <input
                type="number"
                min="0"
                style={inputStyle}
                placeholder="e.g. 500"
                value={filters.maxDistance}
                onChange={(event) =>
                  updateFilter("maxDistance", event.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Mess Type</label>
              <select
                style={inputStyle}
                value={filters.gender}
                onChange={(event) =>
                  updateFilter("gender", event.target.value)
                }
              >
                <option value="">All Types</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any / Mixed</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Minimum Available Seats
              </label>
              <input
                type="number"
                min="0"
                style={inputStyle}
                placeholder="e.g. 2"
                value={filters.minSeats}
                onChange={(event) =>
                  updateFilter("minSeats", event.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Sort Results</label>
              <select
                style={inputStyle}
                value={filters.sortBy}
                onChange={(event) =>
                  updateFilter("sortBy", event.target.value)
                }
              >
                <option value="default">Default</option>
                <option value="rentLow">Rent: Low to High</option>
                <option value="rentHigh">Rent: High to Low</option>
                <option value="distance">Nearest First</option>
                <option value="seats">Most Seats Available</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 22
            }}
          >
            {[
              ["wifi", "📶 WiFi"],
              ["meal", "🍚 Meal System"],
              ["gas", "🔥 Gas"],
              ["singleRoom", "🚪 Single Room"],
              ["verified", "🛡️ Verified Only"]
            ].map(([key, label]) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: filters[key]
                    ? "#dcfce7"
                    : "#f1f5f9",
                  border: filters[key]
                    ? "1px solid #86efac"
                    : "1px solid #e2e8f0",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={(event) =>
                    updateFilter(key, event.target.checked)
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="results-heading">
          <div>
            <h2>Available Messes</h2>
            <p>
              {filteredMesses.length}{" "}
              mess{filteredMesses.length !== 1 ? "es" : ""} found
            </p>
          </div>
        </div>

        {filteredMesses.length > 0 ? (
          <div className="mess-grid">
            {filteredMesses.map((mess) => (
              <MessCard key={mess.id} mess={mess} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span>🔎</span>
            <h3>No Mess Found</h3>
            <p>
              Try changing your search or filter requirements.
            </p>
            <button type="button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default FindMess;

