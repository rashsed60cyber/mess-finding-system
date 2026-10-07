
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  let admin = null;

  try {
    admin = JSON.parse(
      localStorage.getItem(
        "messFinderCurrentAdmin"
      )
    );
  } catch {
    admin = null;
  }

  if (!admin || admin.role !== "admin") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedAdminRoute;
