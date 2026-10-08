

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import getAllMesses from "../utils/getAllMesses";
import MessGallery from "../components/mess/MessGallery";

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const show = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const money = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "Not specified";
  }
  const number = Number(value);
  return Number.isFinite(number)
    ? `৳${number.toLocaleString("en-BD")}`
    : "Not specified";
};

const facilityNames = {
  wifi: "📶 WiFi",
  gas: "🔥 Gas",
  water: "💧 Water",
  electricity: "⚡ Electricity",
  studyTable: "📚 Study Table",
  balcony: "🌿 Balcony",
  cctv: "📹 CCTV",
  securityGuard: "🛡️ Security Guard",
  generator: "🔋 Generator",
  ips: "🔌 IPS",
  parking: "🚲 Parking",
  kitchen: "🍳 Kitchen",
  dining: "🍽️ Dining",
  commonRoom: "🏠 Common Room",
  laundry: "🧺 Laundry",
  hotWater: "🚿 Hot Water"
};

const reviewStyle = {
  card: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 18,
    marginTop: 14
  },
  input: {
    width: "100%",
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    font: "inherit",
    boxSizing: "border-box"
  },
  button: {
    padding: "11px 18px",
    border: 0,
    borderRadius: 9,
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700
  }
};

function InfoSection({ title, items }) {
  const visible = items.filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== ""
  );

  if (!visible.length) return null;

  return (
    <section className="details-section">
      <h2>{title}</h2>
      <div className="mess-information-grid">
        {visible.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{show(value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function MessDetails() {
  const { id } = useParams();

  const mess = getAllMesses().find(
    (item) => String(item.id) === String(id)
  );

  const [storedReviews, setStoredReviews] = useState(() =>
    readJSON("messFinderStudentReviews", [])
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [reviewError, setReviewError] = useState("");

  const student = readJSON("messFinderCurrentUser", null);
  const studentId = String(student?.id ?? student?.email ?? "");
  const studentName =
    student?.name || student?.fullName || student?.email || "Student";

  if (!mess) {
    return (
      <div className="details-not-found">
        <span>🏠</span>
        <h1>Mess Not Found</h1>
        <p>This mess listing could not be found.</p>
        <Link to="/find-mess">← Back to Find Mess</Link>
      </div>
    );
  }

  const rooms = Array.isArray(mess.rooms) ? mess.rooms : [];
  const facilities = mess.facilities || {};
  const costs = mess.costs || {};
  const washroom = mess.washroom || {};
  const mealInfo = mess.mealInfo || {};
  const cook = mealInfo.cook || {};
  const menu = mealInfo.menu || {};
  const rules = mess.rules || {};
  const environment = mess.environment || {};
  const problems = mess.problems || {};
  const contact = mess.contact || {};

  const totalSeats =
    mess.totalSeats ??
    (rooms.length
      ? rooms.reduce(
          (sum, room) => sum + Number(room.totalSeats || 0),
          0
        )
      : mess.seats ?? 0);

  const availableSeats =
    mess.availableSeats ??
    (rooms.length
      ? rooms.reduce(
          (sum, room) => sum + Number(room.availableSeats || 0),
          0
        )
      : mess.seats ?? 0);

  const mealAvailable = Boolean(mealInfo.available ?? mess.meal);

  const availableFacilities = Object.entries(facilities)
    .filter(([, value]) => value === true)
    .map(([key]) => facilityNames[key] || key);

  if (mess.wifi && !facilities.wifi) {
    availableFacilities.push("📶 WiFi");
  }
  if (mess.gas && !facilities.gas) {
    availableFacilities.push("🔥 Gas");
  }

  const phone = String(contact.phone || "").trim();
  const whatsapp = String(contact.whatsapp || "").replace(/\D/g, "");

  const originalReviews = Array.isArray(mess.reviews)
    ? mess.reviews
    : [];

  const localReviews = Array.isArray(storedReviews)
    ? storedReviews.filter(
        (review) => String(review.messId) === String(mess.id)
      )
    : [];

  const reviews = [...originalReviews, ...localReviews];

  const validRatings = reviews
    .map((review) => Number(review.rating))
    .filter((value) => value >= 1 && value <= 5);

  const averageRating = validRatings.length
    ? validRatings.reduce((sum, value) => sum + value, 0) /
      validRatings.length
    : 0;

  const myReview = localReviews.find(
    (review) =>
      studentId &&
      String(review.studentId) === studentId
  );

  const saveReview = (event) => {
    event.preventDefault();
    setReviewError("");

    if (!studentId) {
      setReviewError("Please log in as a student first.");
      return;
    }

    const cleanComment = comment.trim();

    if (cleanComment.length < 10) {
      setReviewError("Please write at least 10 characters.");
      return;
    }

    const current = readJSON("messFinderStudentReviews", []);
    const list = Array.isArray(current) ? current : [];

    const existingIndex = list.findIndex(
      (review) =>
        String(review.messId) === String(mess.id) &&
        String(review.studentId) === studentId
    );

    const now = new Date().toISOString();

    const newReview = {
      id:
        existingIndex >= 0
          ? list[existingIndex].id
          : `${Date.now()}-${studentId}`,
      messId: String(mess.id),
      studentId,
      studentName,
      rating: Number(rating),
      comment: cleanComment,
      createdAt:
        existingIndex >= 0
          ? list[existingIndex].createdAt
          : now,
      updatedAt: now
    };

    const updated = [...list];

    if (existingIndex >= 0) {
      updated[existingIndex] = newReview;
    } else {
      updated.push(newReview);
    }

    try {
      localStorage.setItem(
        "messFinderStudentReviews",
        JSON.stringify(updated)
      );
      setStoredReviews(updated);
      setComment("");
      setRating(5);
      setEditingId(null);
    } catch {
      setReviewError("Unable to save review in browser storage.");
    }
  };

  const editReview = (review) => {
    setEditingId(review.id);
    setRating(Number(review.rating) || 5);
    setComment(review.comment || "");
    setReviewError("");
  };

  const deleteReview = (reviewId) => {
    if (!window.confirm("Delete your review?")) return;

    const current = readJSON("messFinderStudentReviews", []);
    const list = Array.isArray(current) ? current : [];

    const updated = list.filter(
      (review) =>
        !(
          String(review.id) === String(reviewId) &&
          String(review.studentId) === studentId &&
          String(review.messId) === String(mess.id)
        )
    );

    try {
      localStorage.setItem(
        "messFinderStudentReviews",
        JSON.stringify(updated)
      );
      setStoredReviews(updated);
      setEditingId(null);
      setComment("");
      setRating(5);
    } catch {
      setReviewError("Unable to delete review.");
    }
  };

  return (
    <div className="mess-details-page">
      <div className="details-container">
        <Link to="/find-mess" className="back-link">
          ← Back to Search
        </Link>

        <MessGallery mess={mess} />

        <div className="details-layout">
          <main className="details-main">
            <div className="details-title-row">
              <div>
                <p className="details-location">
                  📍 {show(mess.area)}
                  {mess.address ? ` • ${mess.address}` : ""}
                </p>

                <h1>{mess.name}</h1>

                <p>
                  {mess.verified
                    ? "✅ Verified Listing"
                    : "🟡 Verification Pending"}
                </p>

                {validRatings.length > 0 && (
                  <p>
                    ⭐ {averageRating.toFixed(1)} / 5
                    {" "}({validRatings.length} reviews)
                  </p>
                )}
              </div>
            </div>

            <p className="details-description">
              {mess.description || "No description provided."}
            </p>

            <InfoSection
              title="🏠 Accommodation Overview"
              items={[
                ["Mess Type", mess.gender],
                ["University", mess.university],
                ["Area", mess.area],
                ["Address", mess.address],
                ["Campus Distance", `${mess.distance ?? 0} meters`],
                ["Total Rooms", mess.totalRooms ?? rooms.length],
                ["Total Seats", totalSeats],
                ["Available Seats", availableSeats],
                [
                  "Verification Status",
                  mess.verificationStatus ||
                    (mess.verified ? "Verified" : "Pending Verification")
                ]
              ]}
            />

            <section className="details-section">
              <h2>🛏️ Rooms & Seat Availability</h2>
              {rooms.length ? (
                <div className="mess-information-grid">
                  {rooms.map((room, index) => (
                    <div key={`${room.roomNumber || index}-${index}`}>
                      <h3>Room {show(room.roomNumber)}</h3>
                      <p>Type: {show(room.type)}</p>
                      <p>
                        Seats: {show(room.availableSeats)} available
                        / {show(room.totalSeats)} total
                      </p>
                      <p>Rent: {money(room.rentPerSeat)} / seat</p>
                      <p>
                        Attached Washroom: {show(room.attachedWashroom)}
                      </p>
                      <p>Balcony: {show(room.balcony)}</p>
                      <p>Furnished: {show(room.furnished)}</p>
                      <p>Available From: {show(room.availableFrom)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Detailed room information is not available.</p>
              )}
            </section>

            <section className="details-section">
              <h2>✨ Facilities</h2>
              <div className="details-facilities">
                {availableFacilities.length ? (
                  [...new Set(availableFacilities)].map((item) => (
                    <div key={item}>
                      <strong>{item}</strong>
                      <p>Available</p>
                    </div>
                  ))
                ) : (
                  <p>No facilities specified yet.</p>
                )}
              </div>
            </section>

            <InfoSection
              title="💰 Additional Costs"
              items={[
                ["Electricity", costs.electricity != null ? money(costs.electricity) : null],
                ["Gas", costs.gas != null ? money(costs.gas) : null],
                ["WiFi", costs.wifi != null ? money(costs.wifi) : null],
                ["Water", costs.water != null ? money(costs.water) : null],
                ["Meal", costs.meal != null ? money(costs.meal) : null],
                ["Service Charge", costs.serviceCharge != null ? money(costs.serviceCharge) : null],
                ["Security Deposit", costs.securityDeposit != null ? money(costs.securityDeposit) : null],
                ["Other Charges", costs.other != null ? money(costs.other) : null]
              ]}
            />

            <InfoSection
              title="🚿 Washroom Details"
              items={[
                ["Total Washrooms", washroom.total],
                ["Attached Washrooms", washroom.attached],
                ["Common Washrooms", washroom.common],
                ["Students Per Washroom", washroom.studentsPerWashroom],
                ["Shower", washroom.shower],
                ["Hot Water", washroom.hotWater],
                ["Cleaning Frequency", washroom.cleaningFrequency],
                ["Condition", washroom.condition]
              ]}
            />

            <InfoSection
              title="🍚 Meal System & Cook"
              items={[
                ["Meal Available", mealAvailable],
                ["Meal System", mealInfo.system],
                ["Meals Per Day", mealInfo.mealsPerDay],
                ["Monthly Meal Cost", mealInfo.monthlyCost != null ? money(mealInfo.monthlyCost) : null],
                ["Cost Per Meal", mealInfo.perMealCost != null ? money(mealInfo.perMealCost) : null],
                ["Cook / Khala", cook.name],
                ["Cook Experience", cook.experience],
                ["Food Rating", mealInfo.foodRating],
                ["Kitchen Cleanliness", mealInfo.kitchenCleanliness],
                ["Breakfast", menu.breakfast],
                ["Lunch", menu.lunch],
                ["Dinner", menu.dinner]
              ]}
            />

            <InfoSection
              title="📜 Mess Rules"
              items={[
                ["Gate Closing Time", rules.gateClosingTime],
                ["Guest Policy", rules.guestPolicy],
                ["Smoking Allowed", rules.smokingAllowed],
                ["Pets Allowed", rules.petsAllowed],
                ["Cooking Allowed", rules.cookingAllowed],
                ["Students Only", rules.studentOnly],
                ["Advance Notice", rules.advanceNotice],
                ["Additional Rules", rules.additionalRules]
              ]}
            />

            <InfoSection
              title="🌿 Environment & Safety"
              items={[
                ["Noise Level", environment.noiseLevel],
                ["Political Activity", environment.politicalActivity],
                ["Owner-Provided Safety Information", environment.raggingConcern],
                ["Security Level", environment.securityLevel],
                ["Study Environment", environment.studyEnvironment],
                ["Student Friendly", environment.studentFriendly]
              ]}
            />

            <InfoSection
              title="⚠️ Known Problems"
              items={[
                ["Water", problems.water],
                ["Electricity", problems.electricity],
                ["Internet", problems.internet],
                ["Cleanliness", problems.cleanliness],
                ["Security", problems.security],
                ["Noise", problems.noise],
                ["Overcrowding", problems.overcrowding],
                ["Other Problems", problems.description]
              ]}
            />

            <InfoSection
              title="📞 Owner Contact"
              items={[
                ["Owner Name", contact.ownerName],
                ["Phone", contact.phone],
                ["WhatsApp", contact.whatsapp],
                ["Alternate Phone", contact.alternatePhone],
                ["Preferred Contact", contact.preferredContact]
              ]}
            />

            <section className="details-section">
              <h2>⭐ Student Reviews & Ratings</h2>

              <p>
                {validRatings.length
                  ? `Average: ${averageRating.toFixed(1)} / 5 from ${validRatings.length} reviews`
                  : "No ratings yet. Be the first to review."}
              </p>

              {reviews.map((review, index) => {
                const ownReview =
                  studentId &&
                  String(review.studentId) === studentId &&
                  localReviews.some(
                    (item) => String(item.id) === String(review.id)
                  );

                return (
                  <div key={review.id || index} style={reviewStyle.card}>
                    <strong>
                      {show(review.studentName || review.name)}
                    </strong>

                    <p>
                      {"⭐".repeat(
                        Math.max(
                          0,
                          Math.min(5, Math.round(Number(review.rating) || 0))
                        )
                      )}
                      {" "}({show(review.rating)}/5)
                    </p>

                    <p>{show(review.comment || review.text)}</p>

                    {ownReview && (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => editReview(review)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteReview(review.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {!studentId ? (
                <div style={reviewStyle.card}>
                  <p>Log in as a student to write a review.</p>
                  <Link to="/login">Student Login →</Link>
                </div>
              ) : (
                <form onSubmit={saveReview} style={reviewStyle.card}>
                  <h3>
                    {editingId || myReview
                      ? "Edit Your Review"
                      : "Write a Review"}
                  </h3>

                  <label htmlFor="student-review-rating">
                    Your Rating
                  </label>

                  <select
                    id="student-review-rating"
                    value={rating}
                    onChange={(event) =>
                      setRating(Number(event.target.value))
                    }
                    style={reviewStyle.input}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent (5)</option>
                    <option value={4}>⭐⭐⭐⭐ Good (4)</option>
                    <option value={3}>⭐⭐⭐ Average (3)</option>
                    <option value={2}>⭐⭐ Poor (2)</option>
                    <option value={1}>⭐ Very Poor (1)</option>
                  </select>

                  <label
                    htmlFor="student-review-comment"
                    style={{ display: "block", marginTop: 14 }}
                  >
                    Your Experience
                  </label>

                  <textarea
                    id="student-review-comment"
                    rows={5}
                    maxLength={1000}
                    required
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    placeholder="Share your experience with this mess..."
                    style={reviewStyle.input}
                  />

                  {reviewError && (
                    <p role="alert" style={{ color: "#dc2626" }}>
                      {reviewError}
                    </p>
                  )}

                  <button
                    type="submit"
                    style={{
                      ...reviewStyle.button,
                      marginTop: 12
                    }}
                  >
                    {editingId || myReview
                      ? "✓ Update Review"
                      : "✓ Submit Review"}
                  </button>
                </form>
              )}
            </section>
          </main>

          <aside className="booking-card">
            <p>Monthly Rent From</p>
            <h2>
              {money(mess.rent)}
              <small>/seat/month</small>
            </h2>

            <hr />

            <div className="booking-info">
              <span>🛏 {availableSeats} seats available</span>
              <span>🚪 {mess.totalRooms ?? rooms.length} rooms</span>
              <span>📏 {mess.distance ?? 0}m from campus</span>
              <span>
                {mealAvailable ? "🍚 Meal Available" : "🍚 No Meal System"}
              </span>
            </div>

            {phone ? (
              <a href={`tel:${phone}`} className="compare-details-btn">
                📞 Call Mess Owner
              </a>
            ) : (
              <p className="contact-note">
                Owner phone number is not provided.
              </p>
            )}

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="compare-details-btn"
              >
                💬 WhatsApp Owner
              </a>
            )}

            <Link to="/compare" className="compare-details-btn">
              ⚖️ Compare Mess
            </Link>

            <small className="contact-note">
              Confirm rent, availability and conditions directly
              with the owner before making payment.
            </small>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default MessDetails;


