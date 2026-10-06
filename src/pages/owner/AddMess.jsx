import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  area: "",
  rent: "",
  distance: "",
  gender: "",
  seats: "",
  description: "",
  wifi: false,
  meal: false,
  gas: false,
  singleRoom: false
};

function AddMess() {
  const navigate = useNavigate();

  const owner = JSON.parse(
    localStorage.getItem("messFinderCurrentOwner")
  );

  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] =
    useState("");

  if (!owner) {
    return (
      <div className="owner-login-required">
        <span>🔐</span>

        <h1>Owner Login Required</h1>

        <Link to="/owner/login">
          Login
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.area ||
      !formData.rent ||
      !formData.distance ||
      !formData.gender ||
      !formData.seats
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    const savedMesses =
      JSON.parse(
        localStorage.getItem(
          "messFinderOwnerMesses"
        )
      ) || [];

    const newMess = {
      id: Date.now(),

      ownerId: owner.id,

      name: formData.name.trim(),
      area: formData.area.trim(),

      rent: Number(formData.rent),
      distance: Number(formData.distance),
      seats: Number(formData.seats),

      gender: formData.gender,

      wifi: formData.wifi,
      meal: formData.meal,
      gas: formData.gas,
      singleRoom: formData.singleRoom,

      rating: 0,

      description:
        formData.description.trim() ||
        "No description provided.",

      /*
       PHOTO WILL BE ADDED LATER

       Example:
       image: "images/mess-7/front.jpg"

       For now keep blank.
      */
      image: "",

      images: []
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
              Enter your mess information below.
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

          <section className="form-section">

            <h2>Basic Information</h2>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>Mess Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Green View Mess"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>Area *</label>

                <input
                  type="text"
                  name="area"
                  placeholder="Example: Santosh"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Monthly Rent (৳) *
                </label>

                <input
                  type="number"
                  name="rent"
                  placeholder="4500"
                  value={formData.rent}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Campus Distance (meters) *
                </label>

                <input
                  type="number"
                  name="distance"
                  placeholder="300"
                  value={formData.distance}
                  onChange={handleChange}
                />
              </div>

              <div className="owner-form-field">
                <label>Mess Type *</label>

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
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Available Seats *
                </label>

                <input
                  type="number"
                  name="seats"
                  min="0"
                  placeholder="3"
                  value={formData.seats}
                  onChange={handleChange}
                />
              </div>

            </div>

          </section>

          <section className="form-section">

            <h2>Facilities</h2>

            <div className="owner-checkbox-grid">

              <label>
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formData.wifi}
                  onChange={handleChange}
                />

                <span>
                  📶 WiFi
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="meal"
                  checked={formData.meal}
                  onChange={handleChange}
                />

                <span>
                  🍚 Meal System
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="gas"
                  checked={formData.gas}
                  onChange={handleChange}
                />

                <span>
                  🔥 Gas
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="singleRoom"
                  checked={formData.singleRoom}
                  onChange={handleChange}
                />

                <span>
                  🚪 Single Room
                </span>
              </label>

            </div>

          </section>

          <section className="form-section">

            <h2>Description</h2>

            <div className="owner-form-field">

              <textarea
                name="description"
                rows="6"
                placeholder="Write something about the mess..."
                value={formData.description}
                onChange={handleChange}
              />

            </div>

          </section>

          <section className="form-section">

            <h2>Mess Photos</h2>

            <div className="owner-photo-placeholder">

              <span>📷</span>

              <h3>Photo Upload</h3>

              <p>
                Mess photos will be added later.
              </p>

              <small>
                Keep this section empty for now.
              </small>

            </div>

          </section>

          <button
            type="submit"
            className="save-mess-btn"
          >
            ✓ Save Mess
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddMess;
