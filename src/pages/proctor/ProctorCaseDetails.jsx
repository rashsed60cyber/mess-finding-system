import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

const STATUS_OPTIONS = [
  "Pending",
  "Investigating",
  "Visit Scheduled",
  "Resolved",
  "Closed",
];

function ProctorCaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] =
    useState(null);

  const [notFound, setNotFound] =
    useState(false);

  const [formData, setFormData] =
    useState({
      status: "Pending",
      proctorNotes: "",
      resolution: "",
      visitRequired: false,
      visitDate: "",
      visitTime: "",
      visitNotes: "",
    });

  const [message, setMessage] =
    useState("");

  const loadReport = () => {
    let reports = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem(
          "messFinderWelfareReports"
        )
      );

      reports = Array.isArray(stored)
        ? stored
        : [];
    } catch {
      reports = [];
    }

    const found = reports.find(
      (item) =>
        String(item.caseId || item.id) ===
        String(caseId)
    );

    if (!found) {
      setNotFound(true);
      return;
    }

    setReport(found);

    setFormData({
      status:
        found.status || "Pending",

      proctorNotes:
        found.proctorNotes || "",

      resolution:
        found.resolution || "",

      visitRequired:
        Boolean(found.visitRequired),

      visitDate: "",
      visitTime: "",
      visitNotes: "",
    });
  };

  useEffect(() => {
    loadReport();
  }, [caseId]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setMessage("");
  };

  const getAllReports = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(
          "messFinderWelfareReports"
        )
      );

      return Array.isArray(stored)
        ? stored
        : [];
    } catch {
      return [];
    }
  };

  const updateReport = (
    changes,
    historyAction
  ) => {
    const reports = getAllReports();

    const now =
      new Date().toISOString();

    let updatedReport = null;

    const updatedReports =
      reports.map((item) => {
        if (
          String(item.caseId || item.id) !==
          String(caseId)
        ) {
          return item;
        }

        const history =
          Array.isArray(item.history)
            ? item.history
            : [];

        updatedReport = {
          ...item,
          ...changes,

          updatedAt: now,

          history: [
            ...history,
            {
              action: historyAction,
              status:
                changes.status ||
                item.status ||
                "Pending",
              date: now,
            },
          ],
        };

        return updatedReport;
      });

    localStorage.setItem(
      "messFinderWelfareReports",
      JSON.stringify(updatedReports)
    );

    if (updatedReport) {
      setReport(updatedReport);

      setFormData((previous) => ({
        ...previous,

        status:
          updatedReport.status ||
          previous.status,

        proctorNotes:
          updatedReport.proctorNotes ||
          "",

        resolution:
          updatedReport.resolution ||
          "",

        visitRequired:
          Boolean(
            updatedReport.visitRequired
          ),
      }));
    }

    return updatedReport;
  };

  const handleSaveReview = () => {
    const previousStatus =
      report.status || "Pending";

    const nextStatus =
      formData.status;

    if (
      nextStatus === "Resolved" &&
      formData.resolution
        .trim()
        .length < 10
    ) {
      setMessage(
        "Please write a resolution note before marking this case as resolved."
      );

      return;
    }

    const action =
      previousStatus === nextStatus
        ? "Proctor Notes Updated"
        : `Status Changed: ${previousStatus} → ${nextStatus}`;

    updateReport(
      {
        status: nextStatus,

        proctorNotes:
          formData.proctorNotes.trim(),

        resolution:
          formData.resolution.trim(),

        visitRequired:
          formData.visitRequired,
      },
      action
    );

    setMessage(
      "Case review updated successfully."
    );
  };

  const startInvestigation = () => {
    updateReport(
      {
        status: "Investigating",
      },
      "Investigation Started"
    );

    setFormData((previous) => ({
      ...previous,
      status: "Investigating",
    }));

    setMessage(
      "Investigation started."
    );
  };

  const scheduleVisit = () => {
    if (!formData.visitDate) {
      setMessage(
        "Please select a visit date."
      );

      return;
    }

    if (!formData.visitTime) {
      setMessage(
        "Please select a visit time."
      );

      return;
    }

    const existingVisits =
      Array.isArray(report.visits)
        ? report.visits
        : [];

    const visit = {
      id: `VISIT-${Date.now()}`,

      date: formData.visitDate,

      time: formData.visitTime,

      notes:
        formData.visitNotes.trim(),

      status: "Scheduled",

      createdAt:
        new Date().toISOString(),
    };

    const updatedVisits = [
      ...existingVisits,
      visit,
    ];

    updateReport(
      {
        status: "Visit Scheduled",

        visitRequired: true,

        visits: updatedVisits,
      },
      `Mess Visit Scheduled for ${formData.visitDate}`
    );

    setFormData((previous) => ({
      ...previous,

      status: "Visit Scheduled",

      visitRequired: true,

      visitDate: "",

      visitTime: "",

      visitNotes: "",
    }));

    setMessage(
      "Mess visit scheduled successfully."
    );
  };

  const markResolved = () => {
    if (
      formData.resolution
        .trim()
        .length < 10
    ) {
      setMessage(
        "Please write a resolution note of at least 10 characters first."
      );

      return;
    }

    updateReport(
      {
        status: "Resolved",

        proctorNotes:
          formData.proctorNotes.trim(),

        resolution:
          formData.resolution.trim(),
      },
      "Case Resolved"
    );

    setFormData((previous) => ({
      ...previous,
      status: "Resolved",
    }));

    setMessage(
      "Case marked as resolved."
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleString();
  };

  const formatVisitDate = (
    date,
    time
  ) => {
    if (!date) {
      return "Date not available";
    }

    try {
      const dateTime =
        time
          ? `${date}T${time}`
          : date;

      return new Date(
        dateTime
      ).toLocaleString();
    } catch {
      return `${date} ${time || ""}`;
    }
  };

  if (notFound) {
    return (
      <div className="proctor-case-page">

        <div className="proctor-case-container">

          <div className="proctor-report-empty">

            <div>🔎</div>

            <h1>
              Case Not Found
            </h1>

            <p>
              The requested welfare case
              could not be found.
            </p>

            <Link
              to="/proctor/reports"
              className="review-case-btn"
            >
              Back to Reports
            </Link>

          </div>

        </div>

      </div>
    );
  }

  if (!report) {
    return (
      <div className="proctor-case-page">

        <div className="proctor-case-container">

          <div className="proctor-report-empty">

            <p>
              Loading case...
            </p>

          </div>

        </div>

      </div>
    );
  }

  const visits =
    Array.isArray(report.visits)
      ? report.visits
      : [];

  const history =
    Array.isArray(report.history)
      ? report.history
      : [];

  return (
    <div className="proctor-case-page">

      <div className="proctor-case-container">

        {/* HEADER */}

        <div className="proctor-case-header">

          <div>

            <span className="support-badge">
              🛡️ WELFARE CASE
            </span>

            <h1>
              Case Review
            </h1>

            <p>
              {report.caseId ||
                report.id}
            </p>

          </div>

          <div className="case-header-actions">

            <Link
              to="/proctor/reports"
              className="proctor-back-btn"
            >
              ← All Reports
            </Link>

            <button
              type="button"
              className="case-secondary-btn"
              onClick={() =>
                navigate("/proctor")
              }
            >
              Dashboard
            </button>

          </div>

        </div>


        {message && (
          <div className="case-message">
            {message}
          </div>
        )}


        <div className="proctor-case-layout">

          {/* LEFT */}

          <div className="case-main-column">

            {/* CASE OVERVIEW */}

            <section className="case-section-card">

              <div className="case-section-title">

                <div>
                  <span>📋</span>

                  <div>
                    <h2>
                      Report Details
                    </h2>

                    <p>
                      Student-submitted
                      welfare concern
                    </p>
                  </div>
                </div>

                <div className="case-badges">

                  <span
                    className={`report-priority ${
                      String(
                        report.priority ||
                          "Medium"
                      ).toLowerCase()
                    }`}
                  >
                    {report.priority ||
                      "Medium"}
                  </span>

                  <span
                    className={`report-status ${
                      report.status ===
                      "Visit Scheduled"
                        ? "scheduled"
                        : String(
                            report.status ||
                              "Pending"
                          ).toLowerCase()
                    }`}
                  >
                    {report.status ||
                      "Pending"}
                  </span>

                </div>

              </div>


              <div className="case-details-grid">

                <div>
                  <span>
                    Mess
                  </span>

                  <strong>
                    {report.messName ||
                      "Unknown Mess"}
                  </strong>
                </div>

                <div>
                  <span>
                    Area
                  </span>

                  <strong>
                    {report.messArea ||
                      "Not specified"}
                  </strong>
                </div>

                <div>
                  <span>
                    Category
                  </span>

                  <strong>
                    {report.category ||
                      "Other"}
                  </strong>
                </div>

                <div>
                  <span>
                    Submitted
                  </span>

                  <strong>
                    {formatDate(
                      report.createdAt
                    )}
                  </strong>
                </div>

              </div>


              <div className="case-description">

                <span>
                  Student's Report
                </span>

                <p>
                  {report.description ||
                    "No description provided."}
                </p>

              </div>

            </section>


            {/* CONFIDENTIALITY */}

            <section className="case-section-card">

              <div className="case-section-title">

                <div>
                  <span>🔒</span>

                  <div>
                    <h2>
                      Reporter Privacy
                    </h2>

                    <p>
                      Confidentiality
                      information
                    </p>
                  </div>
                </div>

              </div>


              <div className="case-privacy-grid">

                <div>
                  <span>
                    Confidential
                  </span>

                  <strong>
                    {report.confidential
                      ? "Yes"
                      : "No"}
                  </strong>
                </div>

                <div>
                  <span>
                    Anonymous
                  </span>

                  <strong>
                    {report.anonymous
                      ? "Yes"
                      : "No"}
                  </strong>
                </div>

                <div>
                  <span>
                    Reporter
                  </span>

                  <strong>
                    {report.anonymous
                      ? "Anonymous Student"
                      : report.studentName ||
                        "Student"}
                  </strong>
                </div>

                <div>
                  <span>
                    Contact
                  </span>

                  <strong>
                    {report.anonymous
                      ? "Hidden"
                      : report.studentEmail ||
                        "Not provided"}
                  </strong>
                </div>

              </div>


              {report.confidential && (
                <div className="case-confidential-warning">
                  🔒 This information is
                  confidential and must not
                  be displayed on public or
                  mess-owner pages.
                </div>
              )}

            </section>


            {/* PROCTOR REVIEW */}

            <section className="case-section-card">

              <div className="case-section-title">

                <div>
                  <span>🔎</span>

                  <div>
                    <h2>
                      Proctor Review
                    </h2>

                    <p>
                      Update investigation
                      progress
                    </p>
                  </div>
                </div>

              </div>


              <div className="case-form-field">

                <label htmlFor="status">
                  Case Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="case-form-field">

                <label htmlFor="proctorNotes">
                  Proctor Notes
                </label>

                <textarea
                  id="proctorNotes"
                  name="proctorNotes"
                  rows="5"
                  placeholder="Add investigation notes, observations or follow-up information..."
                  value={
                    formData.proctorNotes
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <label className="support-check">

                <input
                  type="checkbox"
                  name="visitRequired"
                  checked={
                    formData.visitRequired
                  }
                  onChange={
                    handleChange
                  }
                />

                <span>

                  <strong>
                    Mess visit required
                  </strong>

                  <small>
                    Mark this if an
                    on-site inspection or
                    follow-up visit is
                    necessary.
                  </small>

                </span>

              </label>


              <div className="case-action-row">

                {report.status ===
                  "Pending" && (
                  <button
                    type="button"
                    className="case-investigate-btn"
                    onClick={
                      startInvestigation
                    }
                  >
                    🔎 Start Investigation
                  </button>
                )}

                <button
                  type="button"
                  className="case-primary-btn"
                  onClick={
                    handleSaveReview
                  }
                >
                  Save Review
                </button>

              </div>

            </section>


            {/* VISIT */}

            <section className="case-section-card">

              <div className="case-section-title">

                <div>
                  <span>📍</span>

                  <div>
                    <h2>
                      Schedule Mess Visit
                    </h2>

                    <p>
                      Plan an on-site
                      follow-up
                    </p>
                  </div>
                </div>

              </div>


              <div className="case-visit-grid">

                <div className="case-form-field">

                  <label htmlFor="visitDate">
                    Visit Date
                  </label>

                  <input
                    id="visitDate"
                    type="date"
                    name="visitDate"
                    value={
                      formData.visitDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="case-form-field">

                  <label htmlFor="visitTime">
                    Visit Time
                  </label>

                  <input
                    id="visitTime"
                    type="time"
                    name="visitTime"
                    value={
                      formData.visitTime
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>


              <div className="case-form-field">

                <label htmlFor="visitNotes">
                  Visit Purpose / Notes
                </label>

                <textarea
                  id="visitNotes"
                  name="visitNotes"
                  rows="3"
                  placeholder="Example: Meet residents and review the reported concern."
                  value={
                    formData.visitNotes
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <button
                type="button"
                className="case-visit-btn"
                onClick={
                  scheduleVisit
                }
              >
                📍 Schedule Visit
              </button>


              {visits.length > 0 && (
                <div className="case-existing-visits">

                  <h3>
                    Scheduled / Previous Visits
                  </h3>

                  {visits
                    .slice()
                    .reverse()
                    .map((visit) => (
                      <div
                        key={visit.id}
                        className="case-visit-item"
                      >

                        <div>
                          <strong>
                            {formatVisitDate(
                              visit.date,
                              visit.time
                            )}
                          </strong>

                          <p>
                            {visit.notes ||
                              "No visit notes."}
                          </p>
                        </div>

                        <span>
                          {visit.status ||
                            "Scheduled"}
                        </span>

                      </div>
                    ))}

                </div>
              )}

            </section>


            {/* RESOLUTION */}

            <section className="case-section-card">

              <div className="case-section-title">

                <div>
                  <span>✅</span>

                  <div>
                    <h2>
                      Case Resolution
                    </h2>

                    <p>
                      Record the final
                      outcome
                    </p>
                  </div>
                </div>

              </div>


              <div className="case-form-field">

                <label htmlFor="resolution">
                  Resolution Notes
                </label>

                <textarea
                  id="resolution"
                  name="resolution"
                  rows="5"
                  placeholder="Describe the action taken and the final outcome of the case..."
                  value={
                    formData.resolution
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <button
                type="button"
                className="case-resolve-btn"
                onClick={
                  markResolved
                }
                disabled={
                  report.status ===
                  "Resolved"
                }
              >
                {report.status ===
                "Resolved"
                  ? "✓ Case Resolved"
                  : "✓ Mark as Resolved"}
              </button>

            </section>

          </div>


          {/* RIGHT SIDEBAR */}

          <aside className="case-side-column">

            <section className="case-side-card">

              <h3>
                Case Summary
              </h3>

              <div className="case-side-row">
                <span>
                  Case ID
                </span>

                <strong>
                  {report.caseId ||
                    report.id}
                </strong>
              </div>

              <div className="case-side-row">
                <span>
                  Priority
                </span>

                <strong>
                  {report.priority ||
                    "Medium"}
                </strong>
              </div>

              <div className="case-side-row">
                <span>
                  Status
                </span>

                <strong>
                  {report.status ||
                    "Pending"}
                </strong>
              </div>

              <div className="case-side-row">
                <span>
                  Visits
                </span>

                <strong>
                  {visits.length}
                </strong>
              </div>

            </section>


            <section className="case-side-card">

              <h3>
                Case History
              </h3>

              {history.length === 0 ? (
                <p className="case-no-history">
                  No history available.
                </p>
              ) : (
                <div className="case-timeline">

                  {history
                    .slice()
                    .reverse()
                    .map(
                      (
                        historyItem,
                        index
                      ) => (
                        <div
                          className="case-timeline-item"
                          key={`${historyItem.date}-${index}`}
                        >

                          <span className="case-timeline-dot" />

                          <div>

                            <strong>
                              {historyItem.action ||
                                "Case Updated"}
                            </strong>

                            <p>
                              {formatDate(
                                historyItem.date
                              )}
                            </p>

                            {historyItem.status && (
                              <small>
                                Status:{" "}
                                {
                                  historyItem.status
                                }
                              </small>
                            )}

                          </div>

                        </div>
                      )
                    )}

                </div>
              )}

            </section>


            <section className="case-side-card case-safety-card">

              <h3>
                🔒 Privacy Reminder
              </h3>

              <p>
                Confidential report
                information should only be
                used for the welfare review
                process and must not be
                exposed to public users or
                mess owners.
              </p>

            </section>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default ProctorCaseDetails;
