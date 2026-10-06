
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">
            🎓 Made for Students
          </span>

          <h1>
            Find Your Perfect
            <span> Mess Near Campus</span>
          </h1>

          <p>
            Search and compare student messes based on rent,
            location, distance, facilities and available seats.
          </p>

          <div className="hero-buttons">
            <Link to="/find-mess" className="primary-btn">
              🔍 Find a Mess
            </Link>

            <Link to="/best-match" className="secondary-btn">
              ✨ Find Best Match
            </Link>
          </div>

        </div>
      </section>

      <section className="features-section">

        <div className="section-heading">
          <p>SMART MESS FINDING</p>
          <h2>Everything You Need in One Place</h2>
          <span>
            Finding student accommodation should be simple.
          </span>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>
              Search messes according to your preferred area,
              rent and facilities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Advanced Filters</h3>
            <p>
              Filter by budget, distance, WiFi, meal,
              available seats and more.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Best Match</h3>
            <p>
              Get recommendations based on your individual
              requirements.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Compare Messes</h3>
            <p>
              Compare different messes side by side before
              making your decision.
            </p>
          </div>

        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Find Your Next Mess?</h2>

        <p>
          Start searching and discover accommodation that
          matches your requirements.
        </p>

        <Link to="/find-mess" className="cta-btn">
          Explore Messes →
        </Link>
      </section>

    </div>
  );
}

export default Home;
