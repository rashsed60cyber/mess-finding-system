import { useState } from "react";
import { Link } from "react-router-dom";
import getAllMesses from "../utils/getAllMesses";

function Compare() {
  const messes = getAllMesses();
  const [selectedIds, setSelectedIds] = useState(["", "", ""]);

  const handleSelect = (index, value) => {
    const updated = [...selectedIds];
    updated[index] = value;
    setSelectedIds(updated);
  };

  const selectedMesses = selectedIds.map((id) =>
    id ? messes.find((mess) => mess.id === Number(id)) : null
  );

  const isAlreadySelected = (messId, currentIndex) =>
    selectedIds.some(
      (id, index) =>
        index !== currentIndex && Number(id) === messId
    );

  const clearComparison = () => {
    setSelectedIds(["", "", ""]);
  };

  return (
    <div className="compare-page">
      <section className="compare-header">
        <span>⚖️ MESS COMPARISON</span>
        <h1>Compare Messes</h1>
        <p>
          Select up to three messes and compare their rent,
          distance, facilities and ratings side by side.
        </p>
      </section>

      <div className="compare-container">
        <section className="compare-selector">
          <div className="compare-selector-heading">
            <div>
              <h2>Select Messes</h2>
              <p>Choose at least two messes to compare.</p>
            </div>

            <button type="button" onClick={clearComparison}>
              Clear
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
                      disabled={isAlreadySelected(mess.id, index)}
                    >
                      {mess.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {selectedMesses.filter(Boolean).length >= 2 ? (
          <section className="comparison-section">
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>

                    {selectedMesses.map(
                      (mess, index) =>
                        mess && (
                          <th key={mess.id}>
                            <div className="compare-mess-heading">
                              <div className="compare-photo-placeholder">
                                {mess.image ? (
                                  <img
                                    src={`${import.meta.env.BASE_URL}${mess.image}`}
                                    alt={mess.name}
                                  />
                                ) : (
                                  <>
                                    <span>🏠</span>
                                    <small>
                                      Photo will be added later
                                    </small>
                                  </>
                                )}
                              </div>

                              <h3>{mess.name}</h3>
                              <p>📍 {mess.area}</p>

                              {index === 0 && (
                                <span className="compare-label">
                                  MESS {index + 1}
                                </span>
                              )}
                            </div>
                          </th>
                        )
                    )}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>💰 Monthly Rent</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            <strong>৳{mess.rent}</strong>
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>📏 Distance</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.distance}m
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>👥 Mess Type</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.gender}
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>🛏 Available Seats</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.seats}
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>📶 WiFi</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.wifi ? (
                              <span className="available">
                                ✓ Available
                              </span>
                            ) : (
                              <span className="unavailable">
                                ✕ No
                              </span>
                            )}
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>🍚 Meal System</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.meal ? (
                              <span className="available">
                                ✓ Available
                              </span>
                            ) : (
                              <span className="unavailable">
                                ✕ No
                              </span>
                            )}
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>🔥 Gas</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.gas ? (
                              <span className="available">
                                ✓ Available
                              </span>
                            ) : (
                              <span className="unavailable">
                                ✕ No
                              </span>
                            )}
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>🚪 Single Room</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            {mess.singleRoom ? (
                              <span className="available">
                                ✓ Available
                              </span>
                            ) : (
                              <span className="unavailable">
                                ✕ No
                              </span>
                            )}
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>⭐ Rating</td>
                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            <strong>{mess.rating} / 5</strong>
                          </td>
                        )
                    )}
                  </tr>

                  <tr>
                    <td>Details</td>

                    {selectedMesses.map(
                      (mess) =>
                        mess && (
                          <td key={mess.id}>
                            <Link
                              className="compare-view-btn"
                              to={`/mess/${mess.id}`}
                            >
                              View Details
                            </Link>
                          </td>
                        )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className="compare-empty">
            <span>⚖️</span>
            <h2>Start Comparing</h2>
            <p>
              Select at least two messes above to see the
              comparison.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compare;
