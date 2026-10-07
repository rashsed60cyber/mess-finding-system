import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const createRoom = () => ({
  id: Date.now() + Math.random(),
  roomNumber: "",
  type: "",
  totalSeats: "",
  availableSeats: "",
  rentPerSeat: "",
  attachedWashroom: false,
  balcony: false,
  furnished: false,
  availableFrom: "Available Now",
  photos: []
});

const initialForm = {
  name: "",
  area: "",
  address: "",
  distance: "",
  gender: "",
  description: "",

  electricityCost: "",
  gasCost: "",
  wifiCost: "",
  waterCost: "",
  mealCost: "",
  serviceCharge: "",
  securityDeposit: "",
  otherCost: "",

  wifi: false,
  meal: false,
  gas: false,
  water: true,
  electricity: true,
  studyTable: false,
  balcony: false,
  cctv: false,
  securityGuard: false,
  generator: false,
  ips: false,
  parking: false,
  kitchen: true,
  dining: false,
  commonRoom: false,
  laundry: false,
  hotWater: false,

  totalWashrooms: "",
  attachedWashrooms: "",
  commonWashrooms: "",
  studentsPerWashroom: "",
  shower: true,
  washroomHotWater: false,
  cleaningFrequency: "",
  washroomCondition: "",

  mealsPerDay: "",
  mealSystem: "",
  mealMonthlyCost: "",
  perMealCost: "",
  cookName: "",
  cookPhone: "",
  cookExperience: "",
  breakfast: "",
  lunch: "",
  dinner: "",
  kitchenCleanliness: "",

  gateClosingTime: "",
  guestPolicy: "",
  smokingAllowed: false,
  petsAllowed: false,
  cookingAllowed: true,
  studentOnly: true,
  advanceNotice: "",

  noiseLevel: "",
  politicalActivity: "",
  raggingConcern: "",
  securityLevel: "",
  studyEnvironment: "",
  studentFriendly: true,

  waterProblem: false,
  electricityProblem: false,
  internetProblem: false,
  cleanlinessProblem: false,
  securityProblem: false,
  noiseProblem: false,
  overcrowdingProblem: false,
  problemDescription: "",

  ownerName: "",
  phone: "",
  whatsapp: "",
  alternatePhone: ""
};

function AddMess() {
  const navigate = useNavigate();

  let owner = null;

  try {
    owner = JSON.parse(
      localStorage.getItem("messFinderCurrentOwner")
    );
  } catch {
    owner = null;
  }

  const [formData, setFormData] =
    useState(initialForm);

  const [rooms, setRooms] =
    useState([createRoom()]);

  const [error, setError] =
    useState("");

  if (!owner) {
    return (
      <div className="owner-login-required">
        <span>🔐</span>

        <h1>Owner Login Required</h1>

        <p>
          Please login as a mess owner to add
          a new listing.
        </p>

        <Link to="/owner/login">
          Owner Login
        </Link>
      </div>
    );
  }

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

    setError("");
  };

  const handleRoomChange = (
    roomId,
    event
  ) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setRooms((previous) =>
      previous.map((room) =>
        room.id === roomId
          ? {
              ...room,

              [name]:
                type === "checkbox"
                  ? checked
                  : value
            }
          : room
      )
    );
  };

  const addRoom = () => {
    setRooms((previous) => [
      ...previous,
      createRoom()
    ]);
  };

  const removeRoom = (roomId) => {
    if (rooms.length === 1) {
      return;
    }

    setRooms((previous) =>
      previous.filter(
        (room) => room.id !== roomId
      )
    );
  };

  const getRoomTotals = () => {
    return rooms.reduce(
      (total, room) => {
        total.totalSeats +=
          Number(room.totalSeats || 0);

        total.availableSeats +=
          Number(room.availableSeats || 0);

        return total;
      },
      {
        totalSeats: 0,
        availableSeats: 0
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.area.trim() ||
      !formData.distance ||
      !formData.gender
    ) {
      setError(
        "Please complete all required basic information."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      return;
    }

    const invalidRoom =
      rooms.some(
        (room) =>
          !room.roomNumber ||
          !room.type ||
          !room.totalSeats ||
          room.availableSeats === "" ||
          !room.rentPerSeat
      );

    if (invalidRoom) {
      setError(
        "Please complete the required information for every room."
      );

      return;
    }

    const invalidAvailability =
      rooms.some(
        (room) =>
          Number(room.availableSeats) >
          Number(room.totalSeats)
      );

    if (invalidAvailability) {
      setError(
        "Available seats cannot be greater than total seats."
      );

      return;
    }

    let savedMesses = [];

    try {
      savedMesses =
        JSON.parse(
          localStorage.getItem(
            "messFinderOwnerMesses"
          )
        ) || [];
    } catch {
      savedMesses = [];
    }

    const totals = getRoomTotals();

    const rents = rooms
      .map((room) =>
        Number(room.rentPerSeat || 0)
      )
      .filter((rent) => rent > 0);

    const minimumRent =
      rents.length > 0
        ? Math.min(...rents)
        : 0;

    const normalizedRooms =
      rooms.map((room) => ({
        ...room,

        totalSeats:
          Number(room.totalSeats),

        availableSeats:
          Number(room.availableSeats),

        rentPerSeat:
          Number(room.rentPerSeat),

        photos: []
      }));

    const newMess = {
      id: Date.now(),

      ownerId: owner.id,

      ownerEmail:
        owner.email || "",

      name:
        formData.name.trim(),

      area:
        formData.area.trim(),

      address:
        formData.address.trim() ||
        `${formData.area.trim()}, Tangail`,

      university:
        "Mawlana Bhashani Science and Technology University",

      distance:
        Number(formData.distance),

      gender:
        formData.gender,

      description:
        formData.description.trim() ||
        "No description provided.",

      totalRooms:
        normalizedRooms.length,

      totalSeats:
        totals.totalSeats,

      availableSeats:
        totals.availableSeats,

      seats:
        totals.availableSeats,

      rent:
        minimumRent,

      rooms:
        normalizedRooms,

      wifi:
        formData.wifi,

      meal:
        formData.meal,

      gas:
        formData.gas,

      singleRoom:
        normalizedRooms.some(
          (room) =>
            room.type === "Single"
        ),

      rating: 0,
      reviewCount: 0,

      verified: false,

      verificationStatus:
        "Pending Verification",

      image: "",

      costs: {
        electricity:
          Number(
            formData.electricityCost || 0
          ),

        gas:
          Number(
            formData.gasCost || 0
          ),

        wifi:
          Number(
            formData.wifiCost || 0
          ),

        water:
          Number(
            formData.waterCost || 0
          ),

        meal:
          Number(
            formData.mealCost ||
            formData.mealMonthlyCost ||
            0
          ),

        serviceCharge:
          Number(
            formData.serviceCharge || 0
          ),

        securityDeposit:
          Number(
            formData.securityDeposit || 0
          ),

        other:
          Number(
            formData.otherCost || 0
          )
      },

      facilities: {
        wifi:
          formData.wifi,

        gas:
          formData.gas,

        water:
          formData.water,

        electricity:
          formData.electricity,

        studyTable:
          formData.studyTable,

        balcony:
          formData.balcony,

        cctv:
          formData.cctv,

        securityGuard:
          formData.securityGuard,

        generator:
          formData.generator,

        ips:
          formData.ips,

        parking:
          formData.parking,

        kitchen:
          formData.kitchen,

        dining:
          formData.dining,

        commonRoom:
          formData.commonRoom,

        laundry:
          formData.laundry,

        hotWater:
          formData.hotWater
      },

      washroom: {
        total:
          Number(
            formData.totalWashrooms || 0
          ),

        attached:
          Number(
            formData.attachedWashrooms || 0
          ),

        common:
          Number(
            formData.commonWashrooms || 0
          ),

        studentsPerWashroom:
          Number(
            formData.studentsPerWashroom ||
            0
          ),

        shower:
          formData.shower,

        hotWater:
          formData.washroomHotWater,

        cleaningFrequency:
          formData.cleaningFrequency ||
          "Not specified",

        condition:
          formData.washroomCondition ||
          "Not specified",

        photos: []
      },

      mealInfo: {
        available:
          formData.meal,

        system:
          formData.meal
            ? formData.mealSystem ||
              "Monthly"
            : "Not Available",

        mealsPerDay:
          formData.meal
            ? Number(
                formData.mealsPerDay ||
                0
              )
            : 0,

        monthlyCost:
          formData.meal
            ? Number(
                formData.mealMonthlyCost ||
                formData.mealCost ||
                0
              )
            : 0,

        perMealCost:
          formData.meal
            ? Number(
                formData.perMealCost ||
                0
              )
            : 0,

        cook: {
          name:
            formData.meal
              ? formData.cookName.trim()
              : "",

          phone:
            formData.meal
              ? formData.cookPhone.trim()
              : "",

          experience:
            formData.meal
              ? formData.cookExperience ||
                "Not specified"
              : ""
        },

        menu: {
          breakfast:
            formData.meal
              ? formData.breakfast
              : "",

          lunch:
            formData.meal
              ? formData.lunch
              : "",

          dinner:
            formData.meal
              ? formData.dinner
              : ""
        },

        foodRating: 0,

        kitchenCleanliness:
          formData.meal
            ? formData.kitchenCleanliness ||
              "Not specified"
            : "Not applicable"
      },

      rules: {
        gateClosingTime:
          formData.gateClosingTime ||
          "Not specified",

        guestPolicy:
          formData.guestPolicy ||
          "Not specified",

        smokingAllowed:
          formData.smokingAllowed,

        petsAllowed:
          formData.petsAllowed,

        cookingAllowed:
          formData.cookingAllowed,

        studentOnly:
          formData.studentOnly,

        advanceNotice:
          formData.advanceNotice ||
          "Not specified",

        additionalRules: []
      },

      environment: {
        noiseLevel:
          formData.noiseLevel ||
          "Unknown",

        politicalActivity:
          formData.politicalActivity ||
          "Unknown",

        raggingConcern:
          formData.raggingConcern ||
          "No verified information",

        securityLevel:
          formData.securityLevel ||
          "Unknown",

        studyEnvironment:
          formData.studyEnvironment ||
          "Unknown",

        studentFriendly:
          formData.studentFriendly
      },

      problems: {
        water:
          formData.waterProblem,

        electricity:
          formData.electricityProblem,

        internet:
          formData.internetProblem,

        cleanliness:
          formData.cleanlinessProblem,

        security:
          formData.securityProblem,

        noise:
          formData.noiseProblem,

        overcrowding:
          formData.overcrowdingProblem,

        description:
          formData.problemDescription.trim() ||
          "No verified problem information."
      },

      contact: {
        ownerName:
          formData.ownerName.trim() ||
          owner.name ||
          "Mess Owner",

        phone:
          formData.phone.trim(),

        whatsapp:
          formData.whatsapp.trim(),

        alternatePhone:
          formData.alternatePhone.trim(),

        preferredContact:
          "Phone"
      },

      photos: {
        exterior: [],
        rooms: [],
        washroom: [],
        kitchen: [],
        dining: [],
        balcony: [],
        commonArea: [],
        surroundings: []
      },

      ratingBreakdown: {
        food: 0,
        cleanliness: 0,
        safety: 0,
        internet: 0,
        washroom: 0,
        ownerBehaviour: 0,
        environment: 0,
        valueForMoney: 0
      },

      reviews: [],
      contributions: [],

      welfare: {
        openReports: 0,
        resolvedReports: 0,
        reports: [],
        visitHistory: []
      },

      createdBy: "owner",

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()
    };

    localStorage.setItem(
      "messFinderOwnerMesses",
      JSON.stringify([
        ...savedMesses,
        newMess
      ])
    );

    navigate("/owner/manage-mess");
  };

  return (
    <div className="add-mess-page">

      <div className="add-mess-container">

        <div className="add-mess-heading">

          <div>
            <p>OWNER PANEL</p>

            <h1>Add New Mess</h1>

            <span>
              Create a complete student-friendly
              mess listing.
            </span>
          </div>

          <Link to="/owner/dashboard">
            ← Dashboard
          </Link>

        </div>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form
          className="add-mess-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="form-section">

            <h2>
              🏠 Basic Information
            </h2>

            <p className="form-section-description">
              Main information students will see
              when searching for a mess.
            </p>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>Mess Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Green View Student Mess"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>Area *</label>

                <input
                  type="text"
                  name="area"
                  placeholder="Santosh"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Full Address
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Santosh, Tangail"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Distance from MBSTU (meters) *
                </label>

                <input
                  type="number"
                  min="0"
                  name="distance"
                  placeholder="300"
                  value={formData.distance}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Mess Type *
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Type
                  </option>

                  <option value="Male">
                    Male Mess
                  </option>

                  <option value="Female">
                    Female Mess
                  </option>

                  <option value="Both">
                    Both
                  </option>
                </select>
              </div>

            </div>

            <div className="owner-form-field">
              <label>Description</label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe the mess, location, environment and important information..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </section>

          {/* ROOMS */}

          <section className="form-section">

            <div className="dynamic-section-heading">

              <div>
                <h2>
                  🛏 Rooms & Seats
                </h2>

                <p className="form-section-description">
                  Add every room separately so
                  students can see real seat
                  availability.
                </p>
              </div>

              <button
                type="button"
                className="add-room-btn"
                onClick={addRoom}
              >
                + Add Room
              </button>

            </div>

            <div className="room-form-list">

              {rooms.map(
                (room, index) => (

                  <div
                    className="room-form-card"
                    key={room.id}
                  >

                    <div className="room-form-heading">

                      <h3>
                        Room {index + 1}
                      </h3>

                      {rooms.length > 1 && (
                        <button
                          type="button"
                          className="remove-room-btn"
                          onClick={() =>
                            removeRoom(
                              room.id
                            )
                          }
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="owner-form-grid">

                      <div className="owner-form-field">
                        <label>
                          Room Number *
                        </label>

                        <input
                          type="text"
                          name="roomNumber"
                          placeholder="101"
                          value={
                            room.roomNumber
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />
                      </div>

                      <div className="owner-form-field">
                        <label>
                          Room Type *
                        </label>

                        <select
                          name="type"
                          value={room.type}
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        >
                          <option value="">
                            Select
                          </option>

                          <option value="Single">
                            Single
                          </option>

                          <option value="2 Seater">
                            2 Seater
                          </option>

                          <option value="3 Seater">
                            3 Seater
                          </option>

                          <option value="4 Seater">
                            4 Seater
                          </option>

                          <option value="Shared">
                            Shared
                          </option>
                        </select>
                      </div>

                      <div className="owner-form-field">
                        <label>
                          Total Seats *
                        </label>

                        <input
                          type="number"
                          min="1"
                          name="totalSeats"
                          value={
                            room.totalSeats
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />
                      </div>

                      <div className="owner-form-field">
                        <label>
                          Available Seats *
                        </label>

                        <input
                          type="number"
                          min="0"
                          name="availableSeats"
                          value={
                            room.availableSeats
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />
                      </div>

                      <div className="owner-form-field">
                        <label>
                          Rent Per Seat (৳) *
                        </label>

                        <input
                          type="number"
                          min="0"
                          name="rentPerSeat"
                          placeholder="4500"
                          value={
                            room.rentPerSeat
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />
                      </div>

                      <div className="owner-form-field">
                        <label>
                          Available From
                        </label>

                        <input
                          type="text"
                          name="availableFrom"
                          placeholder="Available Now"
                          value={
                            room.availableFrom
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />
                      </div>

                    </div>

                    <div className="owner-checkbox-grid">

                      <label>
                        <input
                          type="checkbox"
                          name="attachedWashroom"
                          checked={
                            room.attachedWashroom
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />

                        <span>
                          🚿 Attached Washroom
                        </span>
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="balcony"
                          checked={
                            room.balcony
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />

                        <span>
                          🪟 Balcony
                        </span>
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="furnished"
                          checked={
                            room.furnished
                          }
                          onChange={(event) =>
                            handleRoomChange(
                              room.id,
                              event
                            )
                          }
                        />

                        <span>
                          🪑 Furnished
                        </span>
                      </label>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>

          {/* FACILITIES */}

          <section className="form-section">

            <h2>✨ Facilities</h2>

            <div className="owner-checkbox-grid">

              {[
                ["wifi", "📶 WiFi"],
                ["meal", "🍚 Meal System"],
                ["gas", "🔥 Gas"],
                ["water", "💧 Water"],
                ["electricity", "⚡ Electricity"],
                ["studyTable", "📚 Study Table"],
                ["balcony", "🪟 Balcony"],
                ["cctv", "📹 CCTV"],
                ["securityGuard", "🛡️ Security Guard"],
                ["generator", "⚙️ Generator"],
                ["ips", "🔋 IPS"],
                ["parking", "🏍️ Parking"],
                ["kitchen", "🍳 Kitchen"],
                ["dining", "🍽️ Dining"],
                ["commonRoom", "🛋️ Common Room"],
                ["laundry", "👕 Laundry"],
                ["hotWater", "♨️ Hot Water"]
              ].map(([name, label]) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    name={name}
                    checked={
                      formData[name]
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>{label}</span>
                </label>
              ))}

            </div>

          </section>

          {/* MONTHLY COST */}

          <section className="form-section">

            <h2>
              💰 Additional Monthly Costs
            </h2>

            <div className="owner-form-grid">

              {[
                ["electricityCost", "Electricity"],
                ["gasCost", "Gas"],
                ["wifiCost", "WiFi"],
                ["waterCost", "Water"],
                ["mealCost", "Meal"],
                ["serviceCharge", "Service Charge"],
                ["securityDeposit", "Security Deposit"],
                ["otherCost", "Other Cost"]
              ].map(([name, label]) => (
                <div
                  className="owner-form-field"
                  key={name}
                >
                  <label>
                    {label} (৳)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name={name}
                    placeholder="0"
                    value={
                      formData[name]
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>
              ))}

            </div>

          </section>

          {/* WASHROOM */}

          <section className="form-section">

            <h2>
              🚿 Washroom Information
            </h2>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>
                  Total Washrooms
                </label>

                <input
                  type="number"
                  min="0"
                  name="totalWashrooms"
                  value={
                    formData.totalWashrooms
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Attached Washrooms
                </label>

                <input
                  type="number"
                  min="0"
                  name="attachedWashrooms"
                  value={
                    formData.attachedWashrooms
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Common Washrooms
                </label>

                <input
                  type="number"
                  min="0"
                  name="commonWashrooms"
                  value={
                    formData.commonWashrooms
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Students Per Washroom
                </label>

                <input
                  type="number"
                  min="0"
                  name="studentsPerWashroom"
                  value={
                    formData.studentsPerWashroom
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Cleaning Frequency
                </label>

                <select
                  name="cleaningFrequency"
                  value={
                    formData.cleaningFrequency
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Daily">
                    Daily
                  </option>

                  <option value="Every 2 Days">
                    Every 2 Days
                  </option>

                  <option value="Weekly">
                    Weekly
                  </option>

                  <option value="Self Managed">
                    Self Managed
                  </option>
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Washroom Condition
                </label>

                <select
                  name="washroomCondition"
                  value={
                    formData.washroomCondition
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>

                  <option value="Very Good">
                    Very Good
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Average">
                    Average
                  </option>

                  <option value="Poor">
                    Poor
                  </option>
                </select>
              </div>

            </div>

          </section>

          {/* MEAL */}

          {formData.meal && (
            <section className="form-section">

              <h2>
                🍛 Meal & Cook Information
              </h2>

              <div className="owner-form-grid">

                <div className="owner-form-field">
                  <label>
                    Meal System
                  </label>

                  <select
                    name="mealSystem"
                    value={
                      formData.mealSystem
                    }
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Monthly">
                      Monthly
                    </option>

                    <option value="Per Meal">
                      Per Meal
                    </option>

                    <option value="Meal Rate">
                      Meal Rate
                    </option>
                  </select>
                </div>

                <div className="owner-form-field">
                  <label>
                    Meals Per Day
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="4"
                    name="mealsPerDay"
                    value={
                      formData.mealsPerDay
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>
                    Monthly Meal Cost
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="mealMonthlyCost"
                    value={
                      formData.mealMonthlyCost
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>
                    Per Meal Cost
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="perMealCost"
                    value={
                      formData.perMealCost
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>
                    Cook / Khala Name
                  </label>

                  <input
                    type="text"
                    name="cookName"
                    placeholder="Name"
                    value={
                      formData.cookName
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>
                    Cook / Khala Contact
                  </label>

                  <input
                    type="tel"
                    name="cookPhone"
                    placeholder="01XXXXXXXXX"
                    value={
                      formData.cookPhone
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>
                    Cook Experience
                  </label>

                  <input
                    type="text"
                    name="cookExperience"
                    placeholder="Example: 5 years"
                    value={
                      formData.cookExperience
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>
                    Kitchen Cleanliness
                  </label>

                  <select
                    name="kitchenCleanliness"
                    value={
                      formData.kitchenCleanliness
                    }
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Excellent">
                      Excellent
                    </option>

                    <option value="Very Good">
                      Very Good
                    </option>

                    <option value="Good">
                      Good
                    </option>

                    <option value="Average">
                      Average
                    </option>

                    <option value="Poor">
                      Poor
                    </option>
                  </select>
                </div>

              </div>

              <div className="owner-form-grid">

                <div className="owner-form-field">
                  <label>Breakfast</label>

                  <textarea
                    name="breakfast"
                    rows="3"
                    value={
                      formData.breakfast
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>Lunch</label>

                  <textarea
                    name="lunch"
                    rows="3"
                    value={
                      formData.lunch
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="owner-form-field">
                  <label>Dinner</label>

                  <textarea
                    name="dinner"
                    rows="3"
                    value={
                      formData.dinner
                    }
                    onChange={handleChange}
                  />
                </div>

              </div>

            </section>
          )}

          {/* RULES */}

          <section className="form-section">

            <h2>
              📋 Rules & Policies
            </h2>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>
                  Gate Closing Time
                </label>

                <input
                  type="time"
                  name="gateClosingTime"
                  value={
                    formData.gateClosingTime
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Guest Policy
                </label>

                <input
                  type="text"
                  name="guestPolicy"
                  placeholder="Guests allowed with permission"
                  value={
                    formData.guestPolicy
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Advance Notice
                </label>

                <input
                  type="text"
                  name="advanceNotice"
                  placeholder="Example: 1 month"
                  value={
                    formData.advanceNotice
                  }
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="owner-checkbox-grid">

              <label>
                <input
                  type="checkbox"
                  name="smokingAllowed"
                  checked={
                    formData.smokingAllowed
                  }
                  onChange={handleChange}
                />
                <span>🚬 Smoking Allowed</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="petsAllowed"
                  checked={
                    formData.petsAllowed
                  }
                  onChange={handleChange}
                />
                <span>🐾 Pets Allowed</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="cookingAllowed"
                  checked={
                    formData.cookingAllowed
                  }
                  onChange={handleChange}
                />
                <span>🍳 Cooking Allowed</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="studentOnly"
                  checked={
                    formData.studentOnly
                  }
                  onChange={handleChange}
                />
                <span>🎓 Students Only</span>
              </label>

            </div>

          </section>

          {/* ENVIRONMENT */}

          <section className="form-section">

            <h2>
              🛡️ Environment & Student Safety
            </h2>

            <p className="form-section-description">
              Provide accurate information.
              Student reports and university
              welfare review may update verified
              safety information later.
            </p>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>Noise Level</label>

                <select
                  name="noiseLevel"
                  value={
                    formData.noiseLevel
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>
                  <option value="Low">
                    Low
                  </option>
                  <option value="Moderate">
                    Moderate
                  </option>
                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Political Activity
                </label>

                <select
                  name="politicalActivity"
                  value={
                    formData.politicalActivity
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Unknown
                  </option>

                  <option value="None reported">
                    None Reported
                  </option>

                  <option value="Low">
                    Low
                  </option>

                  <option value="Moderate">
                    Moderate
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Ragging Concern
                </label>

                <select
                  name="raggingConcern"
                  value={
                    formData.raggingConcern
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    No verified information
                  </option>

                  <option value="None reported">
                    None Reported
                  </option>

                  <option value="Reported">
                    Reported
                  </option>
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Security Level
                </label>

                <select
                  name="securityLevel"
                  value={
                    formData.securityLevel
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Average">
                    Average
                  </option>

                  <option value="Poor">
                    Poor
                  </option>
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Study Environment
                </label>

                <select
                  name="studyEnvironment"
                  value={
                    formData.studyEnvironment
                  }
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Excellent">
                    Excellent
                  </option>

                  <option value="Very Good">
                    Very Good
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Average">
                    Average
                  </option>

                  <option value="Poor">
                    Poor
                  </option>
                </select>
              </div>

            </div>

          </section>

          {/* PROBLEMS */}

          <section className="form-section">

            <h2>
              ⚠️ Known Problems
            </h2>

            <div className="owner-checkbox-grid">

              {[
                ["waterProblem", "💧 Water Problem"],
                ["electricityProblem", "⚡ Electricity Problem"],
                ["internetProblem", "📶 Internet Problem"],
                ["cleanlinessProblem", "🧹 Cleanliness Problem"],
                ["securityProblem", "🔐 Security Problem"],
                ["noiseProblem", "🔊 Noise Problem"],
                ["overcrowdingProblem", "👥 Overcrowding"]
              ].map(([name, label]) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    name={name}
                    checked={
                      formData[name]
                    }
                    onChange={
                      handleChange
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}

            </div>

            <div className="owner-form-field">
              <label>
                Problem Description
              </label>

              <textarea
                name="problemDescription"
                rows="4"
                placeholder="Describe any known issue honestly..."
                value={
                  formData.problemDescription
                }
                onChange={handleChange}
              />
            </div>

          </section>

          {/* CONTACT */}

          <section className="form-section">

            <h2>
              📞 Owner Contact
            </h2>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>Owner Name</label>

                <input
                  type="text"
                  name="ownerName"
                  value={
                    formData.ownerName
                  }
                  onChange={handleChange}
                  placeholder={
                    owner.name ||
                    "Owner name"
                  }
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  value={
                    formData.phone
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  WhatsApp Number
                </label>

                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="01XXXXXXXXX"
                  value={
                    formData.whatsapp
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Alternate Number
                </label>

                <input
                  type="tel"
                  name="alternatePhone"
                  value={
                    formData.alternatePhone
                  }
                  onChange={handleChange}
                />
              </div>

            </div>

          </section>

          {/* PHOTOS */}

          <section className="form-section">

            <h2>
              📷 Mess Photos
            </h2>

            <div className="owner-photo-placeholder">

              <span>📷</span>

              <h3>
                Categorized Photo Gallery
              </h3>

              <p>
                Building exterior, rooms,
                washroom, kitchen, dining,
                balcony and surrounding photos
                will be added here.
              </p>

              <small>
                Photo upload remains disabled
                during this development phase.
              </small>

            </div>

          </section>

          <button
            type="submit"
            className="save-mess-btn"
          >
            ✓ Save Complete Mess Listing
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddMess;
