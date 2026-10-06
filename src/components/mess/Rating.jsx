
function Rating({ rating = 0 }) {
  const roundedRating = Math.round(rating);

  return (
    <div className="rating-component">
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= roundedRating ? "★" : "☆"}
          </span>
        ))}
      </div>

      <strong>{rating.toFixed(1)}</strong>
      <span className="rating-text">/ 5</span>
    </div>
  );
}

export default Rating;
