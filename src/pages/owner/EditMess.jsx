
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const numberValue = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const sections = {
  costs: [
    ["electricity", "Electricity"],
    ["gas", "Gas"],
    ["wifi", "WiFi"],
    ["water", "Water"],
    ["meal", "Meal"],
    ["serviceCharge", "Service Charge"],
    ["securityDeposit", "Security Deposit"],
    ["other", "Other Charges"]
  ],
  facilities: [
    ["wifi", "WiFi"],
    ["gas", "Gas"],
    ["water", "Water"],
    ["electricity", "Electricity"],
    ["studyTable", "Study Table"],
    ["balcony", "Balcony"],
    ["cctv", "CCTV"],
    ["securityGuard", "Security Guard"],
    ["generator", "Generator"],
    ["ips", "IPS"],
    ["parking", "Parking"],
    ["kitchen", "Kitchen"],
    ["dining", "Dining"],
    ["commonRoom", "Common Room"],
    ["laundry", "Laundry"],
    ["hotWater", "Hot Water"]
  ],
  washroom: [
    ["total", "Total Washrooms"],
    ["attached", "Attached Washrooms"],
    ["common", "Common Washrooms"],
    ["studentsPerWashroom", "Students Per Washroom"],
    ["shower", "Shower Available"],
    ["hotWater", "Hot Water"],
    ["cleaningFrequency", "Cleaning Frequency"],
    ["condition", "Condition"]
  ],
  rules: [
    ["gateClosingTime", "Gate Closing Time"],
    ["guestPolicy", "Guest Policy"],
    ["smokingAllowed", "Smoking Allowed"],
    ["petsAllowed", "Pets Allowed"],
    ["cookingAllowed", "Cooking Allowed"],
    ["studentOnly", "Students Only"],
    ["advanceNotice", "Advance Notice"],
    ["additionalRules", "Additional Rules"]
  ],
  environment: [
    ["noiseLevel", "Noise Level"],
    ["politicalActivity", "Political Activity"],
    ["raggingConcern", "Ragging Concern"],
    ["securityLevel", "Security Level"],
    ["studyEnvironment", "Study Environment"],
    ["studentFriendly", "Student Friendly"]
  ],
  problems: [
    ["water", "Water Problems"],
    ["electricity", "Electricity Problems"],
    ["internet", "Internet Problems"],
    ["cleanliness", "Cleanliness Problems"],
    ["security", "Security Problems"],
    ["noise", "Noise Problems"],
    ["overcrowding", "Overcrowding"],
    ["description", "Other Problems"]
  ],
  contact: [
    ["ownerName", "Owner Name"],
    ["phone", "Phone"],
    ["whatsapp", "WhatsApp"],
    ["alternatePhone", "Alternate Phone"],
    ["preferredContact", "Preferred Contact"]
  ]
};

const booleanFields = new Set([
  "facilities.wifi",
  "facilities.gas",
  "facilities.water",
  "facilities.electricity",
  "facilities.studyTable",
  "facilities.balcony",
  "facilities.cctv",
  "facilities.securityGuard",
  "facilities.generator",
  "facilities.ips",
  "facilities.parking",
  "facilities.kitchen",
  "facilities.dining",
  "facilities.commonRoom",
  "facilities.laundry",
  "facilities.hotWater",
  "washroom.shower",
  "washroom.hotWater",
  "rules.smokingAllowed",
  "rules.petsAllowed",
  "rules.cookingAllowed",
  "rules.studentOnly",
  "environment.studentFriendly"
]);

const numericFields = new Set([
  ...sections.costs.map(([key]) => `costs.${key}`),
  "washroom.total",
  "washroom.attached",
  "washroom.common",
  "washroom.studentsPerWashroom"
]);

const roomTemplate = () => ({
  roomNumber: "",
  type: "Shared",
  totalSeats: 1,
  availableSeats: 1,
  rentPerSeat: 0,
  attachedWashroom: false,
  balcony: false,
  furnished: false,
  availableFrom: "",
  photos: []
});

function EditMess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const owner = readJSON("messFinderCurrentOwner", null);
  const allMesses = readJSON("messFinderOwnerMesses", []);

  const original = Array.isArray(allMesses)
    ? allMesses.find(
        (mess) =>
          String(mess.id) === String(id) &&
          String(mess.ownerId) === String(owner?.id)
      )
    : null;

  const [form, setForm] = useState(() => {
    if (!original) return null;

    return {
      ...original,
      costs: { ...(original.costs || {}) },
      facilities: { ...(original.facilities || {}) },
      washroom: { ...(original.washroom || {}) },
      mealInfo: {
        ...(original.mealInfo || {}),
        cook: { ...(original.mealInfo?.cook || {}) },
        menu: { ...(original.mealInfo?.menu || {}) }
      },
      rules: { ...(original.rules || {}) },
      environment: { ...(original.environment || {}) },
      problems: { ...(original.problems || {}) },
      contact: { ...(original.contact || {}) },
      rooms: Array.isArray(original.rooms)
        ? original.rooms.map((room) => ({ ...room }))
        : []
    };
  });

  const [error, setError] = useState("");

  if (!owner) {
    return (
      <div className="owner-login-required">
        <h1>Owner Login Required</h1>
        <Link to="/owner/login">Owner Login</Link>
      </div>
    );
  }

  if (!original || !form) {
    return (
      <div className="owner-login-required">
        <h1>Mess Not Found</h1>
        <Link to="/owner/manage-mess">Back to Manage Messes</Link>
      </div>
    );
  }

  const setField = (path, value) => {
    const parts = path.split(".");

    setForm((previous) => {
      const next = structuredClone(previous);
      let target = next;

      for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
      }

      target[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const renderField = (path, label) => {
    const parts = path.split(".");
    let value = form;

    parts.forEach((part) => {
      value = value?.[part];
    });

    const isBoolean = booleanFields.has(path);
    const isNumber = numericFields.has(path);

    return (
      <div className="owner-form-field" key={path}>
        <label>{label}</label>

        {isBoolean ? (
          <label>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => setField(path, e.target.checked)}
            />
            {" "}Available / Yes
          </label>
        ) : (
          <input
            type={isNumber ? "number" : "text"}
            min={isNumber ? "0" : undefined}
            value={value ?? ""}
            onChange={(e) =>
              setField(
                path,
                isNumber ? e.target.value : e.target.value
              )
            }
          />
        )}
      </div>
    );
  };

  const renderSection = (title, key) => (
    <section className="form-section">
      <h2>{title}</h2>
      <div className="owner-form-grid">
        {sections[key].map(([field, label]) =>
          renderField(`${key}.${field}`, label)
        )}
      </div>
    </section>
  );

  const updateRoom = (index, key, value) => {
    setForm((previous) => ({
      ...previous,
      rooms: previous.rooms.map((room, i) =>
        i === index ? { ...room, [key]: value } : room
      )
    }));
  };

  const save = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name?.trim() || !form.area?.trim()) {
      setError("Mess name and area are required.");
      return;
    }

    if (numberValue(form.distance) < 0) {
      setError("Distance cannot be negative.");
      return;
    }

    for (const room of form.rooms) {
      const total = numberValue(room.totalSeats);
      const available = numberValue(room.availableSeats);

      if (
        !room.roomNumber?.toString().trim() ||
        total < 1 ||
        available < 0 ||
        available > total ||
        numberValue(room.rentPerSeat) < 0
      ) {
        setError(
          "Check room numbers, rents and seats. Available seats cannot exceed total seats."
        );
        return;
      }
    }

    const totalSeats = form.rooms.length
      ? form.rooms.reduce(
          (sum, room) => sum + numberValue(room.totalSeats),
          0
        )
      : numberValue(form.totalSeats ?? form.seats);

    const availableSeats = form.rooms.length
      ? form.rooms.reduce(
          (sum, room) => sum + numberValue(room.availableSeats),
          0
        )
      : numberValue(form.availableSeats ?? form.seats);

    if (availableSeats > totalSeats) {
      setError("Available seats cannot exceed total seats.");
      return;
    }

    const rents = form.rooms
      .map((room) => numberValue(room.rentPerSeat))
      .filter((rent) => rent > 0);

    const rent = rents.length
      ? Math.min(...rents)
      : numberValue(form.rent);

    const updated = {
      ...form,
      distance: numberValue(form.distance),
      rooms: form.rooms.map((room) => ({
        ...room,
        totalSeats: numberValue(room.totalSeats),
        availableSeats: numberValue(room.availableSeats),
        rentPerSeat: numberValue(room.rentPerSeat)
      })),
      costs: Object.fromEntries(
        Object.entries(form.costs).map(([key, value]) => [
          key,
          numericFields.has(`costs.${key}`)
            ? numberValue(value)
            : value
        ])
      ),
      totalRooms: form.rooms.length || numberValue(form.totalRooms),
      totalSeats,
      availableSeats,
      seats: availableSeats,
      rent,
      meal: Boolean(form.mealInfo.available),
      wifi: Boolean(form.facilities.wifi),
      gas: Boolean(form.facilities.gas),
      updatedAt: new Date().toISOString()
    };

    const latest = readJSON("messFinderOwnerMesses", []);
    if (!Array.isArray(latest)) {
      setError("Unable to read saved listings.");
      return;
    }

    const index = latest.findIndex(
      (mess) =>
        String(mess.id) === String(id) &&
        String(mess.ownerId) === String(owner.id)
    );

    if (index === -1) {
      setError("Listing no longer exists or is not yours.");
      return;
    }

    latest[index] = updated;

    try {
      localStorage.setItem(
        "messFinderOwnerMesses",
        JSON.stringify(latest)
      );
      navigate("/owner/manage-mess");
    } catch {
      setError("Unable to save. Please check browser storage.");
    }
  };

  return (
    <div className="add-mess-page">
      <div className="add-mess-container">
        <div className="add-mess-heading">
          <div>
            <p>OWNER PANEL</p>
            <h1>Edit Mess</h1>
            <span>Update your accommodation listing.</span>
          </div>
          <Link to="/owner/manage-mess">← Manage Messes</Link>
        </div>

        <form className="add-mess-form" onSubmit={save}>
          <section className="form-section">
            <h2>Basic Information</h2>
            <div className="owner-form-grid">
              {[
                ["name", "Mess Name"],
                ["area", "Area"],
                ["address", "Full Address"],
                ["distance", "Distance (meters)"],
                ["gender", "Mess Type"]
              ].map(([key, label]) => (
                <div className="owner-form-field" key={key}>
                  <label>{label}</label>
                  <input
                    type={key === "distance" ? "number" : "text"}
                    value={form[key] ?? ""}
                    onChange={(e) => setField(key, e.target.value)}
                    required={key === "name" || key === "area"}
                  />
                </div>
              ))}
            </div>
            <div className="owner-form-field">
              <label>Description</label>
              <textarea
                rows="5"
                value={form.description ?? ""}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Room Management</h2>

            {form.rooms.map((room, index) => (
              <div className="form-section" key={index}>
                <h3>Room {index + 1}</h3>
                <div className="owner-form-grid">
                  {[
                    ["roomNumber", "Room Number"],
                    ["type", "Room Type"],
                    ["totalSeats", "Total Seats"],
                    ["availableSeats", "Available Seats"],
                    ["rentPerSeat", "Rent Per Seat"],
                    ["availableFrom", "Available From"]
                  ].map(([key, label]) => (
                    <div className="owner-form-field" key={key}>
                      <label>{label}</label>
                      <input
                        type={
                          ["totalSeats", "availableSeats", "rentPerSeat"].includes(key)
                            ? "number"
                            : key === "availableFrom"
                              ? "date"
                              : "text"
                        }
                        min="0"
                        value={room[key] ?? ""}
                        onChange={(e) =>
                          updateRoom(index, key, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="owner-checkbox-grid">
                  {[
                    ["attachedWashroom", "Attached Washroom"],
                    ["balcony", "Balcony"],
                    ["furnished", "Furnished"]
                  ].map(([key, label]) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={Boolean(room[key])}
                        onChange={(e) =>
                          updateRoom(index, key, e.target.checked)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      rooms: previous.rooms.filter((_, i) => i !== index)
                    }))
                  }
                >
                  Remove Room
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setForm((previous) => ({
                  ...previous,
                  rooms: [...previous.rooms, roomTemplate()]
                }))
              }
            >
              + Add Room
            </button>
          </section>

          {renderSection("Monthly Costs", "costs")}
          {renderSection("Facilities", "facilities")}
          {renderSection("Washroom Details", "washroom")}

          <section className="form-section">
            <h2>Meal & Cook Information</h2>
            <div className="owner-checkbox-grid">
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(form.mealInfo.available)}
                  onChange={(e) =>
                    setField("mealInfo.available", e.target.checked)
                  }
                />
                <span>Meal System Available</span>
              </label>
            </div>

            <div className="owner-form-grid">
              {[
                ["system", "Meal System"],
                ["mealsPerDay", "Meals Per Day"],
                ["monthlyCost", "Monthly Meal Cost"],
                ["perMealCost", "Cost Per Meal"],
                ["foodRating", "Food Rating"],
                ["kitchenCleanliness", "Kitchen Cleanliness"]
              ].map(([key, label]) =>
                renderField(`mealInfo.${key}`, label)
              )}

              {[
                ["name", "Cook / Khala Name"],
                ["phone", "Cook Phone"],
                ["experience", "Cook Experience"]
              ].map(([key, label]) =>
                renderField(`mealInfo.cook.${key}`, label)
              )}

              {[
                ["breakfast", "Breakfast"],
                ["lunch", "Lunch"],
                ["dinner", "Dinner"]
              ].map(([key, label]) =>
                renderField(`mealInfo.menu.${key}`, label)
              )}
            </div>
          </section>

          {renderSection("Mess Rules", "rules")}
          {renderSection("Environment & Safety", "environment")}
          {renderSection("Known Problems", "problems")}
          {renderSection("Owner Contact", "contact")}

          {error && (
            <p role="alert" style={{ color: "#dc2626", fontWeight: 700 }}>
              {error}
            </p>
          )}

          <button className="save-mess-btn" type="submit">
            ✓ Save All Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditMess;

