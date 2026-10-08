
import { Link } from "react-router-dom";
import getAllMesses from "../utils/getAllMesses";

function Home() {
  const messes = getAllMesses();

  const isVerified = (mess) =>
    mess.verified === true ||
    mess.verificationStatus === "Verified";

  const getSeats = (mess) =>
    Number(mess.availableSeats ?? mess.seats ?? 0);

  const featuredMesses = [...messes]
    .filter((mess) => getSeats(mess) > 0)
    .sort((a, b) => {
      const verificationDifference =
        Number(isVerified(b)) - Number(isVerified(a));

      if (verificationDifference !== 0) {
        return verificationDifference;
      }

      return Number(b.rating || 0) - Number(a.rating || 0);
    })
    .slice(0, 3);

  const verifiedCount = messes.filter(isVerified).length;

  const availableSeats = messes.reduce(
    (total, mess) => total + getSeats(mess),
    0
  );

  const features = [
    {
      icon: "🔍",
      title: "Smart Mess Search",
      description:
        "Find accommodation by location, monthly rent, distance and available seats.",
      link: "/find-mess"
    },
    {
      icon: "✨",
      title: "Best Match",
      description:
        "Discover recommended messes based on your budget and preferences.",
      link: "/best-match"
    },
    {
      icon: "⚖️",
      title: "Compare Messes",
      description:
        "Compare rent, rooms, facilities, washrooms and student ratings side by side.",
      link: "/compare"
    },
    {
      icon: "🛡️",
      title: "Student Welfare",
      description:
        "Students can confidentially report accommodation-related safety concerns.",
      link: "/student-support"
    }
  ];

  return (
    <main className="home-page">

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            🎓 MBSTU STUDENT ACCOMMODATION PLATFORM
          </span>

          <h1>
            Find Your Ideal
            <span> Mess Near MBSTU</span>
          </h1>

          <p>
            Explore student accommodation near Mawlana
            Bhashani Science and Technology University.
            Compare rent, facilities, room availability
            and student reviews in one place.
          </p>

          <div className="hero-buttons">
            <Link
              to="/find-mess"
              className="primary-btn"
            >
              🔍 Explore Messes
            </Link>

            <Link
              to="/best-match"
              className="secondary-btn"
            >
              ✨ Find My Best Match
            </Link>
          </div>

          <div className="home-hero-highlights">
            <span>✓ Detailed Mess Information</span>
            <span>✓ Student Reviews</span>
            <span>✓ Verification Status</span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-visual-building">
            <span>🏘️</span>
            <strong>Find a Place That Fits</strong>
            <small>
              Your campus accommodation companion
            </small>
          </div>

          <div className="home-floating-tag">
            🛏️ Check Seat Availability
          </div>
        </div>
      </section>

      <section className="home-stats-section">
        <div className="home-stats-grid">
          <div className="home-stat-card">
            <span>🏠</span>
            <strong>{messes.length}</strong>
            <p>Mess Listings</p>
          </div>

          <div className="home-stat-card">
            <span>🛡️</span>
            <strong>{verifiedCount}</strong>
            <p>Verified Listings</p>
          </div>

          <div className="home-stat-card">
            <span>🛏️</span>
            <strong>{availableSeats}</strong>
            <p>Available Seats</p>
          </div>

          <div className="home-stat-card">
            <span>🎓</span>
            <strong>MBSTU</strong>
            <p>Campus Focused</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <p>WHY CHOOSE MESSFINDER?</p>
          <h2>Everything You Need in One Place</h2>
          <span>
            Search smarter, compare confidently and
            explore accommodation details before deciding.
          </span>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <Link
              to={feature.link}
              className="feature-card"
              key={feature.title}
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <strong
                style={{
                  color: "#16a34a",
                  marginTop: "12px",
                  display: "inline-block"
                }}
              >
                Explore →
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-featured-section">
        <div className="section-heading">
          <p>EXPLORE ACCOMMODATION</p>
          <h2>Featured Student Messes</h2>
          <span>
            A selection of available messes near campus.
          </span>
        </div>

        {featuredMesses.length > 0 ? (
          <div className="home-featured-grid">
            {featuredMesses.map((mess) => (
              <article
                className="home-featured-card"
                key={mess.id}
              >
                <div className="home-featured-image">
                  <span>🏠</span>

                  <small>
                    Mess Photo Coming Soon
                  </small>
                </div>

                <div className="home-featured-content">
                  <span
                    className={
                      isVerified(mess)
                        ? "home-verified-label"
                        : "home-pending-label"
                    }
                  >
                    {isVerified(mess)
                      ? "✓ Verified"
                      : "⏳ Verification Pending"}
                  </span>

                  <h3>{mess.name}</h3>

                  <p>📍 {mess.area}</p>

                  <div className="home-featured-info">
                    <span>
                      💰 ৳{Number(mess.rent || 0).toLocaleString("en-BD")}
                    </span>

                    <span>
                      📏 {mess.distance ?? "—"}m
                    </span>

                    <span>
                      🛏️ {getSeats(mess)} seats
                    </span>
                  </div>

                  <Link
                    to={`/mess/${mess.id}`}
                    className="home-featured-btn"
                  >
                    View Details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-featured-empty">
            No available mess listings yet.
          </div>
        )}

        <div className="home-view-all">
          <Link to="/find-mess">
            View All Messes →
          </Link>
        </div>
      </section>

      <section className="home-safety-section">
        <div className="home-safety-content">
          <span>🛡️ STUDENT WELLFARE & SAFETY</span>

          <h2>
            A Better Accommodation Experience
            Starts with Student Safety
          </h2>

          <p>
            Students can submit confidential reports
            about accommodation-related concerns.
            Authorized university proctors can review
            reports and manage follow-up actions.
          </p>

          <Link to="/student-support">
            Student Support →
          </Link>
        </div>

        <div className="home-safety-visual">
          <span>🛡️</span>
          <strong>Student Welfare</strong>
          <p>
            Report • Review • Follow Up
          </p>
        </div>
      </section>

      <section className="home-owner-section">
        <div>
          <span>🏡 FOR MESS OWNERS</span>

          <h2>Have a Mess Near MBSTU?</h2>

          <p>
            Add your accommodation details, manage
            rooms and update seat availability
            through your owner dashboard.
          </p>
        </div>

        <Link to="/owner/register">
          + List Your Mess
        </Link>
      </section>

      <section className="cta-section">
        <h2>Ready to Find Your Next Mess?</h2>

        <p>
          Explore available accommodation and
          choose what suits your student life.
        </p>

        <Link
          to="/find-mess"
          className="cta-btn"
        >
          Start Exploring →
        </Link>
      </section>

    </main>
  );
}

export default Home;

