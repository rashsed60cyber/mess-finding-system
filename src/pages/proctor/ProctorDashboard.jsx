
import { Link } from "react-router-dom";
import getAllMesses from "../../utils/getAllMesses";

function ProctorDashboard() {
  const messes = getAllMesses();

  let reports = [];

  try {
    reports =
      JSON.parse(
        localStorage.getItem(
          "messFinderWelfareReports"
        )
      ) || [];
  } catch {
    reports = [];
  }

  const pendingReports =
    reports.filter(
      (report) =>
        report.status === "Pending"
    );

  const investigatingReports =
    reports.filter(
      (report) =>
        report.status === "Investigating"
    );

  const resolvedReports =
    reports.filter(
      (report) =>
        report.status === "Resolved"
    );

  const urgentReports =
    reports.filter(
      (report) =>
        report.priority === "Urgent" &&
        report.status !== "Resolved"
    );

  return (
    <div className="admin-page">

      <div className="admin-container">

        <div className="admin-heading">

          <p>
            MBSTU STUDENT WELFARE
          </p>

          <h1>
            🛡️ Proctor Dashboard
          </h1>

          <span>
            Student accommodation safety,
            welfare reports and mess monitoring.
          </span>

        </div>

        <div className="admin-stats">

          <div>
            <span>🏠</span>

            <strong>
              {messes.length}
            </strong>

            <p>
              Listed Messes
            </p>
          </div>

          <div>
            <span>📨</span>

            <strong>
              {pendingReports.length}
            </strong>

            <p>
              Pending Reports
            </p>
          </div>

          <div>
            <span>🔎</span>

            <strong>
              {investigatingReports.length}
            </strong>

            <p>
              Investigating
            </p>
          </div>

          <div>
            <span>🚨</span>

            <strong>
              {urgentReports.length}
            </strong>

            <p>
              Urgent Cases
            </p>
          </div>

          <div>
            <span>✅</span>

            <strong>
              {resolvedReports.length}
            </strong>

            <p>
              Resolved
            </p>
          </div>

        </div>

        <section className="admin-section">

          <h2>
            Student Welfare & Safety
          </h2>

          <p>
            Review student-submitted concerns
            related to accommodation, safety,
            harassment, ragging and other
            mess-related problems.
          </p>

          <div
            className="owner-dashboard-actions"
            style={{
              marginTop: "24px"
            }}
          >

            <Link
              to="/proctor/reports"
              className="dashboard-action-card"
            >
              <span>📨</span>

              <div>
                <h3>
                  Welfare Reports
                </h3>

                <p>
                  Review submitted student
                  complaints and concerns.
                </p>
              </div>
            </Link>

            <Link
              to="/proctor/visits"
              className="dashboard-action-card"
            >
              <span>📍</span>

              <div>
                <h3>
                  Mess Visits
                </h3>

                <p>
                  Record inspections and
                  follow-up visits.
                </p>
              </div>
            </Link>

            <Link
              to="/find-mess"
              className="dashboard-action-card"
            >
              <span>🏠</span>

              <div>
                <h3>
                  Mess Directory
                </h3>

                <p>
                  Review currently listed
                  student messes.
                </p>
              </div>
            </Link>

          </div>

        </section>

        <section className="admin-section">

          <h2>
            Recent Reports
          </h2>

          {reports.length === 0 ? (
            <div className="admin-empty">

              <span
                style={{
                  fontSize: "36px"
                }}
              >
                🛡️
              </span>

              <h3>
                No welfare reports yet
              </h3>

              <p>
                Student reports will appear
                here after the reporting
                system is activated.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Mess</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {reports
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((report) => (
                      <tr key={report.id}>

                        <td>
                          #
                          {String(
                            report.id
                          ).slice(-6)}
                        </td>

                        <td>
                          {report.messName}
                        </td>

                        <td>
                          {report.category}
                        </td>

                        <td>
                          {report.priority}
                        </td>

                        <td>
                          {report.status}
                        </td>

                      </tr>
                    ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default ProctorDashboard;
