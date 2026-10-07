
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import getAllMesses from "../../utils/getAllMesses";

const REPORT_CATEGORIES = [
  "Ragging",
  "Harassment",
  "Bullying",
  "Political Pressure",
  "Safety / Security",
  "Owner Behaviour",
  "Rent Dispute",
  "Water Problem",
  "Electricity Problem",
  "Internet Problem",
  "Washroom Problem",
  "Food / Meal Problem",
  "Cleanliness",
  "Overcrowding",
  "Noise",
  "Other",
];

const PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

function StudentSupport() {
  const { user } = useAuth();

  const messes = useMemo(() => {
    try {
      return getAllMesses();
    } catch {
      return [];
    }
  }, []);

  const [formData, setFormData] = useState({
    messId: "",
    category: "",
    priority: "Medium",
    description: "",
    confidential: true,
    anonymous: false,
  });

  const [successReport, setSuccessReport] =
    useState(null);

  const [error, setError] = useState("");

  /*
    Only logged-in students can submit reports.
  */

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="auth-logo">
            🎓
          </div>

          <h1>Student Login Required</h1>

          <p className="auth-subtitle">
            Please sign in as a student before
            submitting a welfare or safety report.
          </p>

          <Link
            to="/login"
            className="auth-submit-btn"
            style={{
              display: "block",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Login as Student
          </Link>

          <p className="auth-bottom-text">
            New student?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    );
  }

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

    setError("");
  };

  const createCaseId = () => {
    const randomPart = Math.floor(
      1000 + Math.random() * 9000
    );

    return `MBSTU-${Date.now()
      .toString()
      .slice(-6)}-${randomPart}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.messId) {
      setError(
        "Please select the mess related to this report."
      );
      return;
    }

    if (!formData.category) {
      setError(
        "Please select a report category."
      );
      return;
    }

    if (
      formData.description.trim().length < 20
    ) {
      setError(
        "Please describe the concern in at least 20 characters."
      );
      return;
    }

    const selectedMess =
      messes.find(
        (mess) =>
          String(mess.id) ===
          String(formData.messId)
      );

    if (!selectedMess) {
      setError(
        "The selected mess could not be found."
      );
      return;
    }

    let existingReports = [];

    try {
      existingReports =
        JSON.parse(
          localStorage.getItem(
            "messFinderWelfareReports"
          )
        ) || [];

      if (!Array.isArray(existingReports)) {
        existingReports = [];
      }
    } catch {
      existingReports = [];
    }

    const caseId = createCaseId();

    const newReport = {
      id: caseId,
      caseId,

      messId: selectedMess.id,
      messName: selectedMess.name,
      messArea: selectedMess.area || "",

      category: formData.category,
      priority: formData.priority,

      description:
        formData.description.trim(),

      confidential:
        formData.confidential,

      anonymous:
        formData.anonymous,

      /*
        Identity remains in the internal record
        for the demo workflow.

        Public/owner interfaces must never
        display this confidential information.
      */

      studentId:
        user.id ||
        user.email ||
        `student-${Date.now()}`,

      studentName:
        formData.anonymous
          ? "Anonymous Student"
          : user.name || "Student",

      studentEmail:
        formData.anonymous
          ? ""
          : user.email || "",

      status: "Pending",

      proctorNotes: "",

      resolution: "",

      visitRequired: false,

      visits: [],

      history: [
        {
          action: "Report Submitted",
          status: "Pending",
          date: new Date().toISOString(),
        },
      ],

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    const updatedReports = [
      ...existingReports,
      newReport,
    ];

    localStorage.setItem(
      "messFinderWelfareReports",
      JSON.stringify(updatedReports)
    );

    setSuccessReport(newReport);

    setFormData({
      messId: "",
      category: "",
      priority: "Medium",
      description: "",
      confidential: true,
      anonymous: false,
    });

    setError("");
  };

  /*
    SUCCESS SCREEN
  */

  if (successReport) {
    return (
      <div className="support-page">

        <div className="support-container">

          <div className="report-success-card">

            <div className="report-success-icon">
              ✓
            </div>

            <p className="support-eyebrow">
              REPORT SUBMITTED
            </p>

            <h1>
              Your report has been submitted
            </h1>

            <p>
              The report is now available to
              the University Proctor workflow
              for review.
            </p>

            <div className="case-id-box">

              <span>
                Case ID
              </span>

              <strong>
                {successReport.caseId}
              </strong>

            </div>

            <div className="report-success-details">

              <div>
                <span>Mess</span>
                <strong>
                  {successReport.messName}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {successReport.category}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>
                  {successReport.priority}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  Pending
                </strong>
              </div>

            </div>

            <div className="support-notice">
              🔒 Confidential reports must not
              be displayed on public or owner
              pages.
            </div>

            <button
              type="button"
              className="support-primary-btn"
              onClick={() =>
                setSuccessReport(null)
              }
            >
              Submit Another Report
            </button>

            <Link
              to="/"
              className="support-secondary-link"
            >
              Return Home
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="support-page">

      <div className="support-container">

        <div className="support-heading">

          <span className="support-badge">
            🛡️ STUDENT WELFARE
          </span>

          <h1>
            Report a Mess Concern
          </h1>

          <p>
            Report accommodation, safety,
            ragging, harassment or other
            mess-related concerns for review
            through the proctor workflow.
          </p>

        </div>


        <div className="support-layout">

          {/* FORM */}

          <section className="support-form-card">

            <div className="support-section-heading">

              <h2>
                Submit a Report
              </h2>

              <p>
                Please provide accurate
                information so the concern can
                be reviewed properly.
              </p>

            </div>

            {error && (
              <div className="auth-error">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="support-field">

                <label htmlFor="messId">
                  Related Mess *
                </label>

                <select
                  id="messId"
                  name="messId"
                  value={formData.messId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a mess
                  </option>

                  {messes.map((mess) => (
                    <option
                      key={mess.id}
                      value={mess.id}
                    >
                      {mess.name}
                      {mess.area
                        ? ` — ${mess.area}`
                        : ""}
                    </option>
                  ))}

                </select>

              </div>


              <div className="support-field">

                <label htmlFor="category">
                  Concern Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {REPORT_CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="support-field">

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >

                  {PRIORITIES.map(
                    (priority) => (
                      <option
                        key={priority}
                        value={priority}
                      >
                        {priority}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="support-field">

                <label htmlFor="description">
                  Describe the Concern *
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="7"
                  placeholder="Explain what happened, when it happened and any information that may help the proctor review the concern..."
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  required
                />

                <small>
                  Minimum 20 characters.
                  Please avoid intentionally
                  false or misleading reports.
                </small>

              </div>


              <div className="support-options">

                <label className="support-check">

                  <input
                    type="checkbox"
                    name="confidential"
                    checked={
                      formData.confidential
                    }
                    onChange={handleChange}
                  />

                  <span>
                    <strong>
                      Keep this report confidential
                    </strong>

                    <small>
                      The concern should not be
                      shown on public or owner
                      pages.
                    </small>
                  </span>

                </label>


                <label className="support-check">

                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={
                      formData.anonymous
                    }
                    onChange={handleChange}
                  />

                  <span>
                    <strong>
                      Submit anonymously
                    </strong>

                    <small>
                      Your name and email will not
                      be displayed in the report
                      interface.
                    </small>
                  </span>

                </label>

              </div>


              <div className="support-warning">

                <strong>
                  Important
                </strong>

                <p>
                  If there is an immediate threat
                  to someone's physical safety,
                  contact the appropriate
                  university authority or
                  emergency service directly
                  rather than relying only on
                  this demo reporting system.
                </p>

              </div>


              <button
                type="submit"
                className="support-primary-btn"
              >
                🛡️ Submit Report
              </button>

            </form>

          </section>


          {/* INFORMATION */}

          <aside className="support-info-card">

            <div className="support-info-icon">
              🔒
            </div>

            <h2>
              Student Welfare & Safety
            </h2>

            <p>
              This feature is designed to help
              students document mess-related
              welfare concerns and send them
              into a structured review workflow.
            </p>

            <div className="support-info-item">

              <span>1</span>

              <div>
                <strong>
                  Submit
                </strong>

                <p>
                  Describe the concern and
                  select the related mess.
                </p>
              </div>

            </div>


            <div className="support-info-item">

              <span>2</span>

              <div>
                <strong>
                  Proctor Review
                </strong>

                <p>
                  The report enters the proctor
                  review queue.
                </p>
              </div>

            </div>


            <div className="support-info-item">

              <span>3</span>

              <div>
                <strong>
                  Investigation
                </strong>

                <p>
                  A concern can be investigated
                  and a mess visit recorded.
                </p>
              </div>

            </div>


            <div className="support-info-item">

              <span>4</span>

              <div>
                <strong>
                  Resolution
                </strong>

                <p>
                  The case can later be marked
                  resolved with review notes.
                </p>
              </div>

            </div>


            <div className="support-demo-note">

              <strong>
                Academic Demo Notice
              </strong>

              <p>
                This version stores information
                in the browser using
                localStorage. It demonstrates
                the workflow but is not a
                production confidential
                reporting backend.
              </p>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default StudentSupport;
