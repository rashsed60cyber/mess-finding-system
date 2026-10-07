import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function MessVisits() {
  const [filter, setFilter] = useState("All");

  const [reports, setReports] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("messFinderWelfareReports")
      );

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [activeVisitId, setActiveVisitId] = useState(null);

  const [visitForm, setVisitForm] = useState({
    findings: "",
    followUpRequired: false,
    followUpNotes: "",
  });

  const [message, setMessage] = useState("");

  const allVisits = useMemo(() => {
    const visits = [];

    reports.forEach((report) => {
      const reportVisits = Array.isArray(report.visits)
        ? report.visits
        : [];

      reportVisits.forEach((visit) => {
        visits.push({
          ...visit,

          caseId: report.caseId || report.id,

          messId: report.messId,

          messName: report.messName || "Unknown Mess",

          messArea: report.messArea || "",

          category: report.category || "Other",

          priority: report.priority || "Medium",

          caseStatus: report.status || "Pending",
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
    (visit) => visit.status === "Completed"
  ).length;

  const cancelledCount = allVisits.filter(
    (visit) => visit.status === "Cancelled"
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

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString();
  };

  const openVisitResult = (visit) => {
    setActiveVisitId(visit.id);

    setVisitForm({
      findings: visit.findings || "",
      followUpRequired: Boolean(visit.followUpRequired),
      followUpNotes: visit.followUpNotes || "",
    });

    setMessage("");
  };

  const closeVisitResult = () => {
    setActiveVisitId(null);

    setVisitForm({
      findings: "",
      followUpRequired: false,
      followUpNotes: "",
    });

    setMessage("");
  };

  const handleVisitFormChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setVisitForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setMessage("");
  };

  const updateVisit = ({
    caseId,
    visitId,
    visitStatus,
    historyAction,
  }) => {
    const now = new Date().toISOString();

    const updatedReports = reports.map((report) => {
      const reportCaseId =
        report.caseId || report.id;

      if (
        String(reportCaseId) !==
        String(caseId)
      ) {
        return report;
      }

      const currentVisits = Array.isArray(report.visits)
        ? report.visits
        : [];

      const updatedVisits = currentVisits.map((visit) => {
        if (String(visit.id) !== String(visitId)) {
          return visit;
        }

        return {
          ...visit,

          status: visitStatus,

          findings: visitForm.findings.trim(),

          followUpRequired:
            visitForm.followUpRequired,

          followUpNotes:
            visitForm.followUpNotes.trim(),

          completedAt:
            visitStatus === "Completed"
              ? now
              : visit.completedAt || null,

          cancelledAt:
            visitStatus === "Cancelled"
              ? now
              : visit.cancelledAt || null,

          updatedAt: now,
        };
      });

      const history = Array.isArray(report.history)
        ? report.history
        : [];

      return {
        ...report,

        visits: updatedVisits,

        updatedAt: now,

        history: [
          ...history,
          {
            action: historyAction,
            status: report.status || "Visit Scheduled",
            date: now,
          },
        ],
      };
    });

    localStorage.setItem(
      "messFinderWelfareReports",
      JSON.stringify(updatedReports)
    );

    setReports(updatedReports);

    setActiveVisitId(null);

    setVisitForm({
      findings: "",
      followUpRequired: false,
      followUpNotes: "",
    });
  };

  const completeVisit = (visit) => {
    if (visitForm.findings.trim().length < 10) {
      setMessage(
        "Please write visit findings of at least 10 characters."
      );

      return;
    }

    updateVisit({
      caseId: visit.caseId,
      visitId: visit.id,
      visitStatus: "Completed",
      historyAction: "Mess Visit Completed",
    });
  };

  const cancelVisit = (visit) => {
    const reason = visitForm.findings.trim();

    if (reason.length < 5) {
      setMessage(
        "Please write a short reason before cancelling the visit."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this mess visit?"
    );

    if (!confirmed) {
      return;
    }

    updateVisit({
      caseId: visit.caseId,
      visitId: visit.id,
      visitStatus: "Cancelled",
      historyAction: "Mess Visit Cancelled",
    });
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
              Review scheduled inspections, record visit
              findings and manage follow-up actions related
              to student welfare cases.
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
              <strong>{allVisits.length}</strong>
              <p>Total Visits</p>
            </div>
          </div>

          <div className="visit-stat-card">
            <span>🗓️</span>

            <div>
              <strong>{scheduledCount}</strong>
              <p>Scheduled</p>
            </div>
          </div>

          <div className="visit-stat-card">
            <span>✅</span>

            <div>
              <strong>{completedCount}</strong>
              <p>Completed</p>
            </div>
          </div>

          <div className="visit-stat-card">
            <span>✕</span>

            <div>
              <strong>{cancelledCount}</strong>
              <p>Cancelled</p>
            </div>
          </div>

        </div>


        <section className="visit-filter-card">

          <div>
            <h2>Visit Schedule</h2>

            <p>
              {filteredVisits.length} visit
              {filteredVisits.length === 1 ? "" : "s"} shown
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

              <h2>No Mess Visits Found</h2>

              <p>
                No visits match the selected filter.
              </p>

              <Link
                to="/proctor/reports"
                className="review-case-btn"
              >
                Review Welfare Reports
              </Link>

            </div>
          ) : (
            filteredVisits.map((visit, index) => {
              const visitStatus =
                visit.status || "Scheduled";

              const isEditing =
                activeVisitId === visit.id;

              return (
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
                      {visit.date || "No date"}
                    </strong>

                    <small>
                      {visit.time || "No time"}
                    </small>

                  </div>


                  <div className="visit-main-info">

                    <div className="visit-title-row">

                      <div>
                        <span className="report-case-id">
                          {visit.caseId}
                        </span>

                        <h2>{visit.messName}</h2>

                        <p>
                          {visit.messArea ||
                            "Area not specified"}
                        </p>
                      </div>

                      <span
                        className={`visit-status ${visitStatus.toLowerCase()}`}
                      >
                        {visitStatus}
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

                        <p>{visit.notes}</p>

                      </div>
                    )}


                    {visitStatus === "Completed" &&
                      visit.findings && (
                        <div className="visit-findings-display">

                          <span>
                            ✅ Visit Findings
                          </span>

                          <p>
                            {visit.findings}
                          </p>

                          {visit.followUpRequired && (
                            <div className="visit-followup-display">
                              <strong>
                                Follow-up Required
                              </strong>

                              <p>
                                {visit.followUpNotes ||
                                  "Additional follow-up is required."}
                              </p>
                            </div>
                          )}

                          {visit.completedAt && (
                            <small>
                              Completed:{" "}
                              {formatDate(
                                visit.completedAt
                              )}
                            </small>
                          )}

                        </div>
                      )}


                    {visitStatus === "Cancelled" &&
                      visit.findings && (
                        <div className="visit-cancel-display">

                          <span>
                            Visit Cancellation Note
                          </span>

                          <p>
                            {visit.findings}
                          </p>

                          {visit.cancelledAt && (
                            <small>
                              Cancelled:{" "}
                              {formatDate(
                                visit.cancelledAt
                              )}
                            </small>
                          )}

                        </div>
                      )}


                    {visitStatus === "Scheduled" &&
                      !isEditing && (
                        <div className="visit-card-footer">

                          <button
                            type="button"
                            className="visit-record-btn"
                            onClick={() =>
                              openVisitResult(visit)
                            }
                          >
                            📝 Record Visit Result
                          </button>

                          <Link
                            to={`/proctor/reports/${visit.caseId}`}
                            className="review-case-btn"
                          >
                            Open Related Case →
                          </Link>

                        </div>
                      )}


                    {visitStatus !== "Scheduled" && (
                      <div className="visit-card-footer">

                        <Link
                          to={`/proctor/reports/${visit.caseId}`}
                          className="review-case-btn"
                        >
                          Open Related Case →
                        </Link>

                      </div>
                    )}


                    {visitStatus === "Scheduled" &&
                      isEditing && (
                        <div className="visit-result-panel">

                          <div className="visit-result-heading">

                            <div>
                              <h3>
                                Record Visit Result
                              </h3>

                              <p>
                                Record only verified observations
                                from the visit.
                              </p>
                            </div>

                            <button
                              type="button"
                              className="visit-close-btn"
                              onClick={closeVisitResult}
                              aria-label="Close visit result form"
                            >
                              ✕
                            </button>

                          </div>


                          {message && (
                            <div className="visit-result-message">
                              {message}
                            </div>
                          )}


                          <div className="visit-result-field">

                            <label htmlFor={`findings-${visit.id}`}>
                              Visit Findings
                            </label>

                            <textarea
                              id={`findings-${visit.id}`}
                              name="findings"
                              rows="5"
                              placeholder="Record observations made during the visit..."
                              value={visitForm.findings}
                              onChange={handleVisitFormChange}
                            />

                          </div>


                          <label className="visit-followup-check">

                            <input
                              type="checkbox"
                              name="followUpRequired"
                              checked={
                                visitForm.followUpRequired
                              }
                              onChange={
                                handleVisitFormChange
                              }
                            />

                            <span>
                              <strong>
                                Further follow-up required
                              </strong>

                              <small>
                                Select this if the matter requires
                                another review, meeting or visit.
                              </small>
                            </span>

                          </label>


                          {visitForm.followUpRequired && (
                            <div className="visit-result-field">

                              <label
                                htmlFor={`followup-${visit.id}`}
                              >
                                Follow-up Notes
                              </label>

                              <textarea
                                id={`followup-${visit.id}`}
                                name="followUpNotes"
                                rows="3"
                                placeholder="Describe the recommended follow-up action..."
                                value={
                                  visitForm.followUpNotes
                                }
                                onChange={
                                  handleVisitFormChange
                                }
                              />

                            </div>
                          )}


                          <div className="visit-result-actions">

                            <button
                              type="button"
                              className="visit-complete-btn"
                              onClick={() =>
                                completeVisit(visit)
                              }
                            >
                              ✓ Complete Visit
                            </button>

                            <button
                              type="button"
                              className="visit-cancel-btn"
                              onClick={() =>
                                cancelVisit(visit)
                              }
                            >
                              Cancel Visit
                            </button>

                          </div>

                        </div>
                      )}

                  </div>

                </article>
              );
            })
          )}

        </section>

      </div>
    </div>
  );
}

export default MessVisits;
