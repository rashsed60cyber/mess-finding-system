import { useMemo, useState } from "react";

import getAllMesses from "../utils/getAllMesses";
import MessCard from "../components/mess/MessCard";
import MessFilter from "../components/mess/MessFilter";

const initialFilters = {
  area: "",
  maxRent: "",
  maxDistance: "",
  gender: "",
  wifi: "",
  meal: "",
  gas: "",
  singleRoom: ""
};

function FindMess() {
  const [filters, setFilters] =
    useState(initialFilters);

  const [searchText, setSearchText] =
    useState("");

  const allMesses = getAllMesses();

  const filteredMesses = useMemo(() => {
    return allMesses.filter((mess) => {
      const search =
        searchText.trim().toLowerCase();

      const searchMatch =
        !search ||
        mess.name
          .toLowerCase()
          .includes(search) ||
        mess.area
          .toLowerCase()
          .includes(search);

      const areaMatch =
        !filters.area ||
        mess.area === filters.area;

      const rentMatch =
        !filters.maxRent ||
        Number(mess.rent) <=
          Number(filters.maxRent);

      const distanceMatch =
        !filters.maxDistance ||
        Number(mess.distance) <=
          Number(filters.maxDistance);

      const genderMatch =
        !filters.gender ||
        mess.gender === filters.gender;

      const wifiMatch =
        filters.wifi !== "yes" ||
        mess.wifi;

      const mealMatch =
        filters.meal !== "yes" ||
        mess.meal;

      const gasMatch =
        filters.gas !== "yes" ||
        mess.gas;

      const singleMatch =
        filters.singleRoom !== "yes" ||
        mess.singleRoom;

      return (
        searchMatch &&
        areaMatch &&
        rentMatch &&
        distanceMatch &&
        genderMatch &&
        wifiMatch &&
        mealMatch &&
        gasMatch &&
        singleMatch
      );
    });
  }, [
    allMesses,
    filters,
    searchText
  ]);

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchText("");
  };

  return (
    <div className="find-mess-page">

      <section className="find-header">

        <p className="page-label">
          STUDENT ACCOMMODATION
        </p>

        <h1>
          Find Your Perfect Mess
        </h1>

        <p>
          Search and filter available
          messes according to your
          requirements.
        </p>

        <div className="main-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search by mess name or area..."
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />

        </div>

      </section>

      <section className="mess-search-container">

        <MessFilter
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />

        <div className="results-heading">

          <div>
            <h2>
              Available Messes
            </h2>

            <p>
              {filteredMesses.length}{" "}
              mess
              {filteredMesses.length !== 1
                ? "es"
                : ""}{" "}
              found
            </p>
          </div>

        </div>

        {filteredMesses.length > 0 ? (

          <div className="mess-grid">

            {filteredMesses.map(
              (mess) => (
                <MessCard
                  key={mess.id}
                  mess={mess}
                />
              )
            )}

          </div>

        ) : (

          <div className="no-results">

            <span>🔎</span>

            <h3>
              No Mess Found
            </h3>

            <p>
              Try changing your search
              or filter requirements.
            </p>

            <button
              onClick={resetFilters}
            >
              Reset Filters
            </button>

          </div>

        )}

      </section>

    </div>
  );
}

export default FindMess;
