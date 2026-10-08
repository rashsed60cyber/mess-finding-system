

import { Link, useParams } from "react-router-dom";
import getAllMesses from "../utils/getAllMesses";
import MessGallery from "../components/mess/MessGallery";
import Rating from "../components/mess/Rating";

const show = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not specified";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const money = (value) => {
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

  const mealAvailable = Boolean(
    mealInfo.available ?? mess.meal
  );

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
              </div>

              {Number(mess.reviewCount || 0) > 0 && (
                <Rating rating={Number(mess.rating || 0)} />
              )}
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
                ["Verification Status", mess.verificationStatus || (mess.verified ? "Verified" : "Pending Verification")]
              ]}
            />

            <section className="details-section">
              <h2>🛏️ Rooms & Seat Availability</h2>

              {rooms.length ? (
                <div className="mess-information-grid">
                  {rooms.map((room, index) => (
                    <div key={`${room.roomNumber || index}-${index}`}>
                      <h3>
                        Room {show(room.roomNumber)}
                      </h3>

                      <p>Type: {show(room.type)}</p>
                      <p>
                        Seats: {show(room.availableSeats)} available
                        / {show(room.totalSeats)} total
                      </p>
                      <p>
                        Rent: {money(room.rentPerSeat)} / seat
                      </p>
                      <p>
                        Attached Washroom: {show(room.attachedWashroom)}
                      </p>
                      <p>Balcony: {show(room.balcony)}</p>
                      <p>Furnished: {show(room.furnished)}</p>
                      <p>
                        Available From: {show(room.availableFrom)}
                      </p>
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
                ["Electricity", costs.electricity != null && money(costs.electricity)],
                ["Gas", costs.gas != null && money(costs.gas)],
                ["WiFi", costs.wifi != null && money(costs.wifi)],
                ["Water", costs.water != null && money(costs.water)],
                ["Meal", costs.meal != null && money(costs.meal)],
                ["Service Charge", costs.serviceCharge != null && money(costs.serviceCharge)],
                ["Security Deposit", costs.securityDeposit != null && money(costs.securityDeposit)],
                ["Other Charges", costs.other != null && money(costs.other)]
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
                ["Monthly Meal Cost", mealInfo.monthlyCost != null && money(mealInfo.monthlyCost)],
                ["Cost Per Meal", mealInfo.perMealCost != null && money(mealInfo.perMealCost)],
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
                ["Reported Ragging Concern", environment.raggingConcern],
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
              <h2>⭐ Student Reviews</h2>
              {Array.isArray(mess.reviews) && mess.reviews.length ? (
                mess.reviews.map((review, index) => (
                  <div key={review.id || index}>
                    <strong>{show(review.studentName || review.name)}</strong>
                    <p>Rating: {show(review.rating)} / 5</p>
                    <p>{show(review.comment || review.text)}</p>
                  </div>
                ))
              ) : (
                <p>No student reviews yet.</p>
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
              <a
                href={`tel:${phone}`}
                className="compare-details-btn"
              >
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
              Please confirm rent, availability and conditions
              directly with the owner before making payment.
            </small>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default MessDetails;

