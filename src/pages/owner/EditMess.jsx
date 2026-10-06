import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

function EditMess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const owner = JSON.parse(
    localStorage.getItem(
      "messFinderCurrentOwner"
    )
  );

  const savedMesses =
    JSON.parse(
      localStorage.getItem(
        "messFinderOwnerMesses"
      )
    ) || [];

  const originalMess =
    savedMesses.find(
      (mess) =>
        mess.id === Number(id) &&
        mess.ownerId === owner?.id
    );

  const [formData, setFormData] =
    useState(
      originalMess || {
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
      }
    );

  if (!owner) {
    return (
      <div className="owner-login-required">
        <span>🔐</span>

        <h1>
          Owner Login Required
        </h1>

        <Link to="/owner/login">
          Login
        </Link>
      </div>
    );
  }

  if (!originalMess) {
    return (
      <div className="owner-login-required">
        <span>🏠</span>

        <h1>
          Mess Not Found
        </h1>

        <Link to="/owner/manage-mess">
          Back to Manage Messes
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedMesses =
      savedMesses.map((mess) => {
        if (
          mess.id === Number(id) &&
          mess.ownerId === owner.id
        ) {
          return {
            ...mess,

            ...formData,

            rent:
              Number(formData.rent),

            distance:
              Number(
                formData.distance
              ),

            seats:
              Number(formData.seats)
          };
        }

        return mess;
      });

    localStorage.setItem(
      "messFinderOwnerMesses",
      JSON.stringify(
        updatedMesses
      )
    );

    navigate(
      "/owner/manage-mess"
    );
  };

  return (
    <div className="add-mess-page">

      <div className="add-mess-container">

        <div className="add-mess-heading">

          <div>
            <p>OWNER PANEL</p>
            <h1>Edit Mess</h1>
            <span>
              Update your mess
              information.
            </span>
          </div>

          <Link
            to="/owner/manage-mess"
          >
            ← Manage Messes
          </Link>

        </div>

        <form
          className="add-mess-form"
          onSubmit={handleSubmit}
        >

          <section className="form-section">

            <h2>
              Basic Information
            </h2>

            <div className="owner-form-grid">

              <div className="owner-form-field">
                <label>
                  Mess Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="owner-form-field">
                <label>Area</label>

                <input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Monthly Rent
                </label>

                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Distance (meters)
                </label>

                <input
                  type="number"
                  name="distance"
                  value={
                    formData.distance
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="owner-form-field">
                <label>
                  Mess Type
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              <div className="owner-form-field">
                <label>
                  Available Seats
                </label>

                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

            </div>

          </section>

          <section className="form-section">

            <h2>Facilities</h2>

            <div className="owner-checkbox-grid">

              {[
                ["wifi", "📶 WiFi"],
                [
                  "meal",
                  "🍚 Meal System"
                ],
                ["gas", "🔥 Gas"],
                [
                  "singleRoom",
                  "🚪 Single Room"
                ]
              ].map(
                ([name, label]) => (

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

                    <span>
                      {label}
                    </span>

                  </label>

                )
              )}

            </div>

          </section>

          <section className="form-section">

            <h2>Description</h2>

            <div className="owner-form-field">

              <textarea
                name="description"
                rows="6"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </section>

          <section className="form-section">

            <h2>Mess Photos</h2>

            <div className="owner-photo-placeholder">

              <span>📷</span>

              <h3>
                Photo Section
              </h3>

              <p>
                Photos will be added
                later.
              </p>

            </div>

          </section>

          <button
            className="save-mess-btn"
            type="submit"
          >
            ✓ Save Changes
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditMess;
