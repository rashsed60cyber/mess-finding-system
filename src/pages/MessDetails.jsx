
import { Link, useParams } from "react-router-dom";
import MessGallery from "../components/mess/MessGallery";
import Rating from "../components/mess/Rating";

function MessDetails() {
  const { id } = useParams();

  const mess = messes.find(
    (item) => item.id === Number(id)
  );

  if (!mess) {
    return (
      <div className="details-not-found">
        <span>🏠</span>
        <h1>Mess Not Found</h1>

        <p>
          The mess you are looking for could not be found.
        </p>

        <Link to="/find-mess">
          ← Back to Find Mess
        </Link>
      </div>
    );
  }

  return (
    <div className="mess-details-page">

      <div className="details-container">

        <Link
          to="/find-mess"
          className="back-link"
        >
          ← Back to Search
        </Link>

        <MessGallery mess={mess} />

        <div className="details-layout">

          <section className="details-main">

            <div className="details-title-row">

              <div>
                <p className="details-location">
                  📍 {mess.area}
                </p>

                <h1>{mess.name}</h1>
              </div>

              <Rating rating={mess.rating} />

            </div>

            <p className="details-description">
              {mess.description}
            </p>

            <div className="details-section">
              <h2>Facilities</h2>

              <div className="details-facilities">

                <div>
                  <span>📶</span>
                  <strong>WiFi</strong>
                  <p>
                    {mess.wifi
                      ? "Available"
                      : "Not Available"}
                  </p>
                </div>

                <div>
                  <span>🍚</span>
                  <strong>Meal System</strong>
                  <p>
                    {mess.meal
                      ? "Available"
                      : "Not Available"}
                  </p>
                </div>

                <div>
                  <span>🔥</span>
                  <strong>Gas</strong>
                  <p>
                    {mess.gas
                      ? "Available"
                      : "Not Available"}
                  </p>
                </div>

                <div>
                  <span>🚪</span>
                  <strong>Single Room</strong>
                  <p>
                    {mess.singleRoom
                      ? "Available"
                      : "Not Available"}
                  </p>
                </div>

              </div>
            </div>

            <div className="details-section">

              <h2>About This Mess</h2>

              <div className="mess-information-grid">

                <div>
                  <span>👥 Mess Type</span>
                  <strong>{mess.gender}</strong>
                </div>

                <div>
                  <span>📍 Area</span>
                  <strong>{mess.area}</strong>
                </div>

                <div>
                  <span>📏 Campus Distance</span>
                  <strong>{mess.distance} meters</strong>
                </div>

                <div>
                  <span>🛏 Available Seats</span>
                  <strong>{mess.seats}</strong>
                </div>

              </div>

            </div>

          </section>

          <aside className="booking-card">

            <p>Monthly Rent</p>

            <h2>
              ৳{mess.rent}
              <small>/month</small>
            </h2>

            <hr />

            <div className="booking-info">
              <span>
                🛏 {mess.seats} seats available
              </span>

              <span>
                📏 {mess.distance}m from campus
              </span>
            </div>

            <button type="button">
              Contact Mess Owner
            </button>

            <Link
              to="/compare"
              className="compare-details-btn"
            >
              ⚖️ Compare Mess
            </Link>

            <small className="contact-note">
              Owner contact information will be added later.
            </small>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default MessDetails;
