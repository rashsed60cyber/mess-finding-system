import { useState } from "react";

import messes from "../data/messes";
import { getRecommendations }
  from "../utils/recommendation";

const initialPreferences = {
  maxRent: "",
  maxDistance: "",
  gender: "",
  wifi: false,
  meal: false,
  singleRoom: false
};

function BestMatch() {

  const [preferences, setPreferences] =
    useState(initialPreferences);

  const [results, setResults] =
    useState([]);

  const [searched, setSearched] =
    useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setPreferences((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  const findBestMatch = (event) => {
    event.preventDefault();

    const recommendations =
      getRecommendations(
        messes,
        preferences
      );

    setResults(recommendations);
    setSearched(true);
  };

  return (
    <div className="best-match-page">

      <section className="best-match-header">

        <span>✨ SMART RECOMMENDATION</span>

        <h1>Find Your Best Match</h1>

        <p>
          Tell us what you need and we'll rank
          the available messes for you.
        </p>

      </section>

      <div className="best-match-container">

        <form
          className="preference-card"
          onSubmit={findBestMatch}
        >

          <h2>Your Preferences</h2>

          <p>
            Select the features that matter to you.
          </p>

          <div className="preference-grid">

            <div className="preference-field">
              <label>Maximum Monthly Rent</label>

              <input
                type="number"
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
                <option value="">
                  Any Distance
                </option>

                <option value="300">
                  Within 300m
                </option>

                <option value="500">
                  Within 500m
                </option>

                <option value="1000">
                  Within 1km
                </option>

                <option value="2000">
                  Within 2km
                </option>
              </select>
            </div>

            <div className="preference-field">
              <label>Mess Type</label>

              <select
                name="gender"
                value={preferences.gender}
                onChange={handleChange}
              >
                <option value="">
                  Any
                </option>

                <option value="Male">
                  Male Mess
                </option>

                <option value="Female">
                  Female Mess
                </option>
              </select>
            </div>

          </div>

          <h3 className="facility-heading">
            Required Facilities
          </h3>

          <div className="preference-options">

            <label>
              <input
                type="checkbox"
                name="wifi"
                checked={preferences.wifi}
                onChange={handleChange}
              />

              <span>
                📶
                <strong>WiFi</strong>
              </span>
            </label>

            <label>
              <input
                type="checkbox"
                name="meal"
                checked={preferences.meal}
                onChange={handleChange}
              />

              <span>
                🍚
                <strong>Meal</strong>
              </span>
            </label>

            <label>
              <input
                type="checkbox"
                name="singleRoom"
                checked={preferences.singleRoom}
                onChange={handleChange}
              />

              <span>
                🚪
                <strong>Single Room</strong>
              </span>
            </label>

          </div>

          <button
            type="submit"
            className="find-match-btn"
          >
            ✨ Find My Best Match
          </button>

        </form>

        {searched && (
          <section className="recommendation-results">

            <div className="recommendation-heading">
              <span>🏆</span>

              <div>
                <h2>Your Best Matches</h2>
                <p>
                  Ranked according to your preferences.
                </p>
              </div>
            </div>

            <div className="recommendation-list">

              {results.slice(0, 3).map(
                (mess, index) => (

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
                          src={`${import.meta.env.BASE_URL}${mess.image}`}
                          alt={mess.name}
                        />
                      ) : (
                        <div>
                          <span>🏠</span>
                          <small>
                            Photo coming later
                          </small>
                        </div>
                      )}

                    </div>

                    <div className="recommendation-content">

                      <div className="match-score">
                        {mess.matchScore}% Match
                      </div>

                      <h3>{mess.name}</h3>

                      <p>
                        📍 {mess.area}
                        {" • "}
                        {mess.distance}m away
                      </p>

                      <strong>
                        ৳{mess.rent}/month
                      </strong>

                      <div className="match-reasons">

                        {mess.matchReasons.map(
                          (reason, reasonIndex) => (
                            <span key={reasonIndex}>
                              ✓ {reason}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>
        )}

      </div>

    </div>
  );
}

export default BestMatch;
