
import { useState } from "react";
import { Link } from "react-router-dom";
import getAllMesses from "../utils/getAllMesses";

const initialPreferences = {
  maxRent: "",
  maxDistance: "",
  gender: "",
  minSeats: "1",
  wifi: false,
  meal: false,
  gas: false,
  singleRoom: false,
  verifiedOnly: false
};

const getRent = (mess) => {
  const rents = Array.isArray(mess.rooms)
    ? mess.rooms
        .map((room) => Number(room.rentPerSeat))
        .filter((rent) => Number.isFinite(rent) && rent > 0)
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

function rankMesses(messes, preferences) {
  return messes
    .filter((mess) => {
      const status = String(
        mess.verificationStatus || ""
      ).toLowerCase();

      if (status === "rejected") return false;

      if (preferences.verifiedOnly && mess.verified !== true) {
        return false;
      }

      if (
        preferences.gender &&
        String(mess.gender || "").toLowerCase() !==
          preferences.gender.toLowerCase()
      ) {
        return false;
      }

      if (getSeats(mess) < Number(preferences.minSeats || 1)) {
        return false;
      }

      if (
        preferences.maxRent &&
        (getRent(mess) <= 0 ||
          getRent(mess) > Number(preferences.maxRent))
      ) {
        return false;
      }

      if (
        preferences.maxDistance &&
        Number(mess.distance) > Number(preferences.maxDistance)
      ) {
        return false;
      }

      if (preferences.wifi && !hasFacility(mess, "wifi")) {
        return false;
      }

      if (preferences.meal && !hasMeal(mess)) {
        return false;
      }

      if (preferences.gas && !hasFacility(mess, "gas")) {
        return false;
      }

      if (preferences.singleRoom && !hasSingleRoom(mess)) {
        return false;
      }

      return true;
    })
    .map((mess) => {
      const rent = getRent(mess);
      const distance = Number(mess.distance) || 0;
      const seats = getSeats(mess);
      const rating = Math.min(
        5,
        Math.max(0, Number(mess.rating) || 0)
      );

      const budget = Number(preferences.maxRent);
      const maxDistance = Number(preferences.maxDistance);

      const rentScore = budget > 0
        ? Math.max(0, 100 - (rent / budget) * 50)
        : rent > 0
          ? Math.max(0, 100 - rent / 120)
          : 0;

      const distanceScore = maxDistance > 0
        ? Math.max(0, 100 - (distance / maxDistance) * 50)
        : Math.max(0, 100 - distance / 20);

      const facilityCount = [
        hasFacility(mess, "wifi"),
        hasMeal(mess),
        hasFacility(mess, "gas"),
        hasSingleRoom(mess)
      ].filter(Boolean).length;

      const facilityScore = facilityCount * 25;
      const ratingScore = rating * 20;
      const seatsScore = Math.min(seats, 5) * 20;
      const verificationScore = mess.verified ? 100 : 0;

      const matchScore = Math.round(
        rentScore * 0.25 +
        distanceScore * 0.2 +
        facilityScore * 0.2 +
        ratingScore * 0.15 +
        seatsScore * 0.1 +
        verificationScore * 0.1
      );

      const reasons = [];

      if (mess.verified) reasons.push("Verified listing");
      if (rent > 0) reasons.push(`৳${rent.toLocaleString()} rent`);
      if (Number.isFinite(distance)) {
        reasons.push(`${distance}m from campus`);
      }
      if (seats > 0) reasons.push(`${seats} seats available`);
      if (hasFacility(mess, "wifi")) reasons.push("WiFi");
      if (hasMeal(mess)) reasons.push("Meal system");
      if (hasFacility(mess, "gas")) reasons.push("Gas");
      if (hasSingleRoom(mess)) reasons.push("Single room");

      return {
        ...mess,
        displayRent: rent,
        displaySeats: seats,
        matchScore: Math.min(100, Math.max(0, matchScore)),
        matchReasons: reasons
      };
    })
    .sort((a, b) =>
      b.matchScore - a.matchScore ||
      b.rating - a.rating
    );
}

function BestMatch() {
  const [preferences, setPreferences] =
    useState(initialPreferences);

  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setPreferences((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const findBestMatch = (event) => {
    event.preventDefault();

    const messes = getAllMesses();
    setResults(rankMesses(messes, preferences));
    setSearched(true);
  };

  const resetPreferences = () => {
    setPreferences(initialPreferences);
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="best-match-page">
      <section className="best-match-header">
        <span>✨ SMART RECOMMENDATION</span>
        <h1>Find Your Best Match</h1>
        <p>
          Discover accommodation near MBSTU based on your
          budget, location and preferred facilities.
        </p>
      </section>

      <div className="best-match-container">
        <form
          className="preference-card"
          onSubmit={findBestMatch}
        >
          <h2>Your Preferences</h2>
          <p>Select what matters most to you.</p>

          <div className="preference-grid">
            <div className="preference-field">
              <label>Maximum Monthly Rent (৳)</label>
              <input
                type="number"
                min="0"
                name="maxRent"
                placeholder="Example: 5000"
                value={preferences.maxRent}
                onChange={handleChange}
              />
            </div>

            <div className="preference-field">
              <label>Maximum Distance</label>
              <select
                name="maxDistance"
                value={preferences.maxDistance}
                onChange={handleChange}
              >
                <option value="">Any Distance</option>
                <option value="300">Within 300m</option>
                <option value="500">Within 500m</option>
                <option value="1000">Within 1km</option>
                <option value="2000">Within 2km</option>
              </select>
            </div>

            <div className="preference-field">
              <label>Mess Type</label>
              <select
                name="gender"
                value={preferences.gender}
                onChange={handleChange}
              >
                <option value="">Any Type</option>
                <option value="Male">Male Mess</option>
                <option value="Female">Female Mess</option>
              </select>
            </div>

            <div className="preference-field">
              <label>Minimum Available Seats</label>
              <input
                type="number"
                min="1"
                name="minSeats"
                value={preferences.minSeats}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 className="facility-heading">
            Required Facilities
          </h3>

          <div className="preference-options">
            {[
              ["wifi", "📶 WiFi"],
              ["meal", "🍚 Meal System"],
              ["gas", "🔥 Gas"],
              ["singleRoom", "🚪 Single Room"],
              ["verifiedOnly", "🛡️ Verified Only"]
            ].map(([name, label]) => (
              <label key={name}>
                <input
                  type="checkbox"
                  name={name}
                  checked={preferences[name]}
                  onChange={handleChange}
                />
                <span>
                  <strong>{label}</strong>
                </span>
              </label>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 24
            }}
          >
            <button
              type="submit"
              className="find-match-btn"
            >
              ✨ Find My Best Match
            </button>

            <button
              type="button"
              onClick={resetPreferences}
              style={{
                padding: "12px 20px",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                background: "#fff",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              ↺ Reset
            </button>
          </div>
        </form>

        {searched && (
          <section className="recommendation-results">
            <div className="recommendation-heading">
              <span>🏆</span>
              <div>
                <h2>Your Best Matches</h2>
                <p>
                  {results.length} suitable mess
                  {results.length !== 1 ? "es" : ""} found.
                  Ranked by estimated compatibility.
                </p>
              </div>
            </div>

            {results.length === 0 ? (
              <div
                className="preference-card"
                style={{ textAlign: "center" }}
              >
                <h3>No Matching Mess Found</h3>
                <p>
                  Try increasing your budget or distance,
                  or removing some required facilities.
                </p>
              </div>
            ) : (
              <div className="recommendation-list">
                {results.slice(0, 5).map((mess, index) => (
                  <div
                    className="recommendation-card"
                    key={mess.id}
                  >
                    <div className="recommendation-rank">
                      #{index + 1}
                    </div>

                    <div className="recommendation-image">
                      {mess.image ? (
                        <img
                          src={
                            /^https?:\/\//.test(mess.image)
                              ? mess.image
                              : `${import.meta.env.BASE_URL}${String(
                                  mess.image
                                ).replace(/^\/+/, "")}`
                          }
                          alt={mess.name}
                        />
                      ) : (
                        <div>
                          <span>🏠</span>
                          <small>Photo coming later</small>
                        </div>
                      )}
                    </div>

                    <div className="recommendation-content">
                      <div className="match-score">
                        {mess.matchScore}% Match
                      </div>

                      <h3>{mess.name}</h3>

                      <p>
                        📍 {mess.area} • {mess.distance}m away
                      </p>

                      <strong>
                        ৳{mess.displayRent.toLocaleString()}/month
                      </strong>

                      <p>
                        🛏 {mess.displaySeats} seats available
                      </p>

                      <div className="match-reasons">
                        {mess.matchReasons.map((reason) => (
                          <span key={reason}>
                            ✓ {reason}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/mess/${mess.id}`}
                        style={{
                          display: "inline-block",
                          marginTop: 16,
                          color: "#16a34a",
                          fontWeight: 700,
                          textDecoration: "none"
                        }}
                      >
                        View Mess Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default BestMatch;

