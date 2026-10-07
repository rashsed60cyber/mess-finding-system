
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function ProctorReports() {
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const reports = useMemo(() => {
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
  }, []);

  const filteredReports = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return reports
      .filter((report) => {
        const matchesStatus =
          statusFilter === "All" ||
          report.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" ||
          report.priority === priorityFilter;

        const searchableText = [
          report.caseId,
          report.id,
          report.messName,
          report.messArea,
          report.category,
          report.status,
          report.priority,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !search ||
          searchableText.includes(search);

        return (
          matchesStatus &&
          matchesPriority &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      });
  }, [
    reports,
    statusFilter,
    priorityFilter,
    searchTerm,
  ]);

  const countByStatus = (status) =>
    reports.filter(
      (report) =>
        report.status === status
    ).length;

  const urgentCount = reports.filter(
    (report) =>
      report.priority === "Urgent" &&
      report.status !== "Resolved"
  ).length;

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Not available";
    }

    return parsed.toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "report-status pending";

      case "Investigating":
        return "report-status investigating";

      case "Visit Scheduled":
        return "report-status scheduled";

      case "Resolved":
        return "report-status resolved";

      case "Closed":
        return "report-status closed";

      default:
        return "report-status";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return "report-priority urgent";

      case "High":
        return "report-priority high";

      case "Medium":
        return "report-priority medium";

      case "Low":
        return "report-priority low";

      default:
        return "report-priority";
    }
  };

  return (
    <div className="proctor-reports-page">
      <div className="proctor-reports-container">

        {/* PAGE HEADER */}

        <div className="proctor-reports-header">

          <div>
            <span className="support-badge">
              🛡️ MBSTU STUDENT WELFARE
            </span>

            <h1>
              Welfare Reports
            </h1>

            <p>
              Review student-submitted
              accommodation, safety and
              welfare concerns.
            </p>
          </div>

          <Link
            to="/proctor"
            className="proctor-back-btn"
          >
            ← Dashboard
          </Link>

        </div>


        {/* SUMMARY */}

        <div className="report-summary-grid">

          <div className="report-summary-card">
            <span>📨</span>

            <div>
              <strong>
                {reports.length}
              </strong>

              <p>
                Total Reports
              </p>
            </div>
          </div>


          <div className="report-summary-card">
            <span>⏳</span>

            <div>
              <strong>
                {countByStatus("Pending")}
              </strong>

              <p>
                Pending
              </p>
            </div>
          </div>


          <div className="report-summary-card">
            <span>🔎</span>

            <div>
              <strong>
                {countByStatus(
                  "Investigating"
                )}
              </strong>

              <p>
                Investigating
              </p>
            </div>
          </div>


          <div className="report-summary-card">
            <span>📍</span>

            <div>
              <strong>
                {countByStatus(
                  "Visit Scheduled"
                )}
              </strong>

              <p>
                Visit Scheduled
              </p>
            </div>
          </div>


          <div className="report-summary-card">
            <span>🚨</span>

            <div>
              <strong>
                {urgentCount}
              </strong>

              <p>
                Urgent
              </p>
            </div>
          </div>


          <div className="report-summary-card">
            <span>✅</span>

            <div>
              <strong>
                {countByStatus(
                  "Resolved"
                )}
              </strong>

              <p>
                Resolved
              </p>
            </div>
          </div>

        </div>


        {/* FILTERS */}

        <section className="report-filter-card">

          <div className="report-filter-heading">

            <div>
              <h2>
                Report Queue
              </h2>

              <p>
                {filteredReports.length} of{" "}
                {reports.length} reports shown
              </p>
            </div>

          </div>


          <div className="report-filter-grid">

            <div className="report-filter-field">

              <label htmlFor="reportSearch">
                Search
              </label>

              <input
                id="reportSearch"
                type="search"
                placeholder="Case ID, mess, category..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>


            <div className="report-filter-field">

              <label htmlFor="statusFilter">
                Status
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Investigating">
                  Investigating
                </option>

                <option value="Visit Scheduled">
                  Visit Scheduled
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>

            </div>


            <div className="report-filter-field">

              <label htmlFor="priorityFilter">
                Priority
              </label>

              <select
                id="priorityFilter"
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Priorities
                </option>

                <option value="Urgent">
                  Urgent
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

            </div>

          </div>

        </section>


        {/* REPORTS */}

        <section className="proctor-report-list">

          {filteredReports.length === 0 ? (
            <div className="proctor-report-empty">

              <div>
                🛡️
              </div>

              <h2>
                No reports found
              </h2>

              <p>
                No welfare reports match the
                selected filters.
              </p>

            </div>
          ) : (
            filteredReports.map(
              (report) => (
                <article
                  key={
                    report.caseId ||
                    report.id
                  }
                  className="proctor-report-card"
                >

                  <div className="report-card-top">

                    <div>

                      <div className="report-case-line">

                        <span className="report-case-id">
                          {report.caseId ||
                            report.id}
                        </span>

                        {report.confidential && (
                          <span className="confidential-badge">
                            🔒 Confidential
                          </span>
                        )}

                        {report.anonymous && (
                          <span className="anonymous-badge">
                            Anonymous
                          </span>
                        )}

                      </div>

                      <h2>
                        {report.messName ||
                          "Unknown Mess"}
                      </h2>

                      <p>
                        {report.messArea ||
                          "Area not specified"}
                      </p>

                    </div>


                    <div className="report-card-badges">

                      <span
                        className={
                          getPriorityClass(
                            report.priority
                          )
                        }
                      >
                        {report.priority ||
                          "Medium"}
                      </span>

                      <span
                        className={
                          getStatusClass(
                            report.status
                          )
                        }
                      >
                        {report.status ||
                          "Pending"}
                      </span>

                    </div>

                  </div>


                  <div className="report-card-info">

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

                  </div>


                  <div className="report-description-preview">

                    <span>
                      Report Summary
                    </span>

                    <p>
                      {report.description ||
                        "No description provided."}
                    </p>

                  </div>


                  <div className="report-card-footer">

                    <p>
                      Last updated:{" "}
                      {formatDate(
                        report.updatedAt ||
                          report.createdAt
                      )}
                    </p>

                    <Link
                      to={`/proctor/reports/${
                        report.caseId ||
                        report.id
                      }`}
                      className="review-case-btn"
                    >
                      Review Case →
                    </Link>

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

export default ProctorReports;
