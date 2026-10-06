import { Link } from "react-router-dom";

function MessCard({ mess }) {
  return (
    <article className="mess-card">

      <div className="mess-image">

        {mess.image ? (
          <img
            src={`${import.meta.env.BASE_URL}${mess.image}`}
            alt={mess.name}
          />
        ) : (
          <div className="image-placeholder">
            <span>🏠</span>
            <p>Mess Photo</p>
            <small>Photo will be added later</small>
          </div>
        )}

        <span className="mess-rating">
          ⭐ {mess.rating}
        </span>

        {mess.seats > 0 && (
          <span className="seat-badge">
            {mess.seats} Seats Available
          </span>
        )}

      </div>

      <div className="mess-card-content">

        <p className="mess-area">
          📍 {mess.area}
        </p>

        <h3>{mess.name}</h3>

        <div className="mess-info">
          <span>💰 ৳{mess.rent}/month</span>
          <span>📏 {mess.distance}m away</span>
        </div>

        <div className="facility-tags">
          {mess.wifi && <span>📶 WiFi</span>}
          {mess.meal && <span>🍚 Meal</span>}
          {mess.gas && <span>🔥 Gas</span>}
          {mess.singleRoom && <span>🚪 Single</span>}
        </div>

        <Link
          to={`/mess/${mess.id}`}
          className="view-details-btn"
        >
          View Details →
        </Link>

      </div>

    </article>
  );
}

export default MessCard;
