
import { useState } from "react";

function AdminDashboard() {
  const [ownerMesses, setOwnerMesses] =
    useState(() => {
      return (
        JSON.parse(
          localStorage.getItem(
            "messFinderOwnerMesses"
          )
        ) || []
      );
    });

  const students =
    JSON.parse(
      localStorage.getItem(
        "messFinderUsers"
      )
    ) || [];

  const owners =
    JSON.parse(
      localStorage.getItem(
        "messFinderOwners"
      )
    ) || [];

  const deleteListing = (id) => {
    const confirmed =
      window.confirm(
        "Delete this mess listing?"
      );

    if (!confirmed) {
      return;
    }

    const updated =
      ownerMesses.filter(
        (mess) => mess.id !== id
      );

    localStorage.setItem(
      "messFinderOwnerMesses",
      JSON.stringify(updated)
    );

    setOwnerMesses(updated);
  };

  return (
    <div className="admin-page">

      <div className="admin-container">

        <div className="admin-heading">

          <p>ADMINISTRATION</p>

          <h1>
            Admin Dashboard
          </h1>

          <span>
            MessFinder system overview
          </span>

        </div>

        <div className="admin-stats">

          <div>
            <span>🎓</span>
            <strong>
              {students.length}
            </strong>
            <p>
              Registered Students
            </p>
          </div>

          <div>
            <span>👨‍💼</span>
            <strong>
              {owners.length}
            </strong>
            <p>
              Mess Owners
            </p>
          </div>

          <div>
            <span>🏠</span>
            <strong>
              {ownerMesses.length}
            </strong>
            <p>
              Owner Listings
            </p>
          </div>

        </div>

        <section className="admin-section">

          <h2>
            Owner Mess Listings
          </h2>

          {ownerMesses.length === 0 ? (

            <div className="admin-empty">
              No owner listings yet.
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Mess</th>
                    <th>Area</th>
                    <th>Rent</th>
                    <th>Seats</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {ownerMesses.map(
                    (mess) => (

                      <tr key={mess.id}>

                        <td>
                          {mess.name}
                        </td>

                        <td>
                          {mess.area}
                        </td>

                        <td>
                          ৳{mess.rent}
                        </td>

                        <td>
                          {mess.seats}
                        </td>

                        <td>
                          {mess.gender}
                        </td>

                        <td>

                          <button
                            type="button"
                            onClick={() =>
                              deleteListing(
                                mess.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default AdminDashboard;
