import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function MessVisits() {
  const [filter, setFilter] = useState("All");

  const reports = useMemo(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("messFinderWelfareReports")
      );

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }, []);

  const allVisits = useMemo(() => {
    const visits = [];

    reports.forEach((report) => {
      const reportVisits = Array.isArray(report.visits)
        ? report.visits
        : [];

      reportVisits.forEach((visit) => {
        visits.push({
          ...visit,

          caseId:
            report.caseId ||
            report.id,

          messId:
            report.messId,

          messName:
            report.messName ||
            "Unknown Mess",

          messArea:
            report.messArea ||
            "",

          category:
            report.category ||
            "Other",

          priority:
            report.priority ||
            "Medium",

          caseStatus:
            report.status ||
            "Pending",
        });
      });
    });

    return visits.sort((a, b) => {
      const first = new Date(
        `${a.date || "1970-01-01"}T${a.time || "00:00"}`
      );

      const second = new Date(
        `${b.date || "1970-01-01"}T${b.time || "00:00"}`
      );

      return first - second;
    });
  }, [reports]);

  const filteredVisits = useMemo(() => {
    if (filter === "All") {
      return allVisits;
    }

    return allVisits.filter(
      (visit) =>
        (visit.status || "Scheduled") === filter
    );
  }, [allVisits, filter]);

  const scheduledCount = allVisits.filter(
    (visit) =>
      (visit.status || "Scheduled") === "Scheduled"
  ).length;

  const completedCount = allVisits.filter(
    (visit) =>
      visit.status === "Completed"
  ).length;

  const cancelledCount = allVisits.filter(
    (visit) =>
      visit.status === "Cancelled"
  ).length;

  const formatVisitDate = (date, time) => {
    if (!date) {
      return "Date not available";
    }

    const value = time
      ? `${date}T${time}`
      : `${date}T00:00`;

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return `${date} ${time || ""}`;
    }

    return parsed.toLocaleString();
  };

  return (
    <div className="mess-visits-page">
      <div className="mess-visits-container">

        <div className="mess-visits-header">

          <div>
            <span className="support-badge">
              📍 PROCTOR MONITORING
            </span>

            <h1>Mess Visits</h1>

            <p>
              Review scheduled inspections and
              follow-up visits related to student
              welfare cases.
            </p>
          </div>

          <Link
            to="/proctor"
            className="proctor-back-btn"
          >
            ← Dashboard
          </Link>

        </div>


        <div className="visit-stats-grid">

          <div className="visit-stat-card">
            <span>📍</span>

            <div>
              <strong>
                {allVisits.length}
              </strong>

              <p>Total Visits</p>
            </div>
          </div>


          <div className="visit-stat-card">
            <span>🗓️</span>

            <div>
              <strong>
                {scheduledCount}
              </strong>

              <p>Scheduled</p>
            </div>
          </div>


          <div className="visit-stat-card">
            <span>✅</span>

            <div>
              <strong>
                {completedCount}
              </strong>

              <p>Completed</p>
            </div>
          </div>


          <div className="visit-stat-card">
            <span>✕</span>

            <div>
              <strong>
                {cancelledCount}
              </strong>

              <p>Cancelled</p>
            </div>
          </div>

        </div>


        <section className="visit-filter-card">

          <div>
            <h2>Visit Schedule</h2>

            <p>
              {filteredVisits.length} visit
              {filteredVisits.length === 1
                ? ""
                : "s"}{" "}
              shown
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
            aria-label="Filter mess visits"
          >
            <option value="All">
              All Visits
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </section>


        <section className="visit-list">

          {filteredVisits.length === 0 ? (
            <div className="visit-empty">

              <div>📍</div>

              <h2>
                No Mess Visits Yet
              </h2>

              <p>
                Visits scheduled from welfare
                cases will appear here.
              </p>

              <Link
                to="/proctor/reports"
                className="review-case-btn"
              >
                Review Welfare Reports
              </Link>

            </div>
          ) : (
            filteredVisits.map(
              (visit, index) => (
                <article
                  className="visit-card"
                  key={
                    visit.id ||
                    `${visit.caseId}-${index}`
                  }
                >

                  <div className="visit-date-box">

                    <span>VISIT</span>

                    <strong>
                      {visit.date ||
                        "No date"}
                    </strong>

                    <small>
                      {visit.time ||
                        "No time"}
                    </small>

                  </div>


                  <div className="visit-main-info">

                    <div className="visit-title-row">

                      <div>
                        <span className="report-case-id">
                          {visit.caseId}
                        </span>

                        <h2>
                          {visit.messName}
                        </h2>

                        <p>
                          {visit.messArea ||
                            "Area not specified"}
                        </p>
                      </div>

                      <span
                        className={`visit-status ${
                          (
                            visit.status ||
                            "Scheduled"
                          )
                            .toLowerCase()
                        }`}
                      >
                        {visit.status ||
                          "Scheduled"}
                      </span>

                    </div>


                    <div className="visit-meta-grid">

                      <div>
                        <span>
                          Visit Date & Time
                        </span>

                        <strong>
                          {formatVisitDate(
                            visit.date,
                            visit.time
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Report Category
                        </span>

                        <strong>
                          {visit.category}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Case Priority
                        </span>

                        <strong>
                          {visit.priority}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Case Status
                        </span>

                        <strong>
                          {visit.caseStatus}
                        </strong>
                      </div>

                    </div>


                    {visit.notes && (
                      <div className="visit-notes">

                        <span>
                          Visit Purpose / Notes
                        </span>

                        <p>
                          {visit.notes}
                        </p>

                      </div>
                    )}


                    <div className="visit-card-footer">

                      <Link
                        to={`/proctor/reports/${visit.caseId}`}
                        className="review-case-btn"
                      >
                        Open Related Case →
                      </Link>

                    </div>

                  </div>

                </article>
              )
            )
          )}

        </section>

      </div>
    </div>
  );
}

export default MessVisits;
