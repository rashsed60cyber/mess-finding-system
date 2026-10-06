function MessFilter({ filters, setFilters, onReset }) {

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  return (
    <div className="mess-filter">

      <div className="filter-heading">
        <div>
          <h3>🔍 Filter Messes</h3>
          <p>Choose your requirements</p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="reset-btn"
        >
          Reset
        </button>
      </div>

      <div className="filter-grid">

        <div className="filter-group">
          <label>Area</label>

          <select
            name="area"
            value={filters.area}
            onChange={handleChange}
          >
            <option value="">All Areas</option>
            <option value="Santosh">Santosh</option>
            <option value="Kagmarai">Kagmarai</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Maximum Rent</label>

          <input
            type="number"
            name="maxRent"
            placeholder="e.g. 5000"
            value={filters.maxRent}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label>Maximum Distance</label>

          <select
            name="maxDistance"
            value={filters.maxDistance}
            onChange={handleChange}
          >
            <option value="">Any Distance</option>
            <option value="300">Within 300m</option>
            <option value="500">Within 500m</option>
            <option value="1000">Within 1km</option>
            <option value="2000">Within 2km</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Gender</label>

          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="Male">Male Mess</option>
            <option value="Female">Female Mess</option>
          </select>
        </div>

        <div className="filter-group">
          <label>WiFi</label>

          <select
            name="wifi"
            value={filters.wifi}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="yes">Required</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Meal System</label>

          <select
            name="meal"
            value={filters.meal}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="yes">Required</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Gas</label>

          <select
            name="gas"
            value={filters.gas}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="yes">Required</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Single Room</label>

          <select
            name="singleRoom"
            value={filters.singleRoom}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="yes">Required</option>
          </select>
        </div>

      </div>

    </div>
  );
}

export default MessFilter;
