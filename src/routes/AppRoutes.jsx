import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import Home from "../pages/Home";
import FindMess from "../pages/FindMess";
import MessDetails from "../pages/MessDetails";
import BestMatch from "../pages/BestMatch";
import Compare from "../pages/Compare";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleLogin from "../pages/auth/RoleLogin";

import StudentSupport from "../pages/student/StudentSupport";

import OwnerLogin from "../pages/owner/OwnerLogin";
import OwnerRegister from "../pages/owner/OwnerRegister";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import AddMess from "../pages/owner/AddMess";
import ManageMess from "../pages/owner/ManageMess";
import EditMess from "../pages/owner/EditMess";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";

import ProctorLogin from "../pages/proctor/ProctorLogin";
import ProctorDashboard from "../pages/proctor/ProctorDashboard";


/* ========================================
   STUDENT PROTECTION
======================================== */

function StudentProtectedRoute({ children }) {
  let student = null;

  try {
    student = JSON.parse(
      localStorage.getItem(
        "messFinderCurrentUser"
      )
    );
  } catch {
    student = null;
  }

  if (!student) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


/* ========================================
   ADMIN PROTECTION
======================================== */

function AdminProtectedRoute({ children }) {
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

  if (
    !admin ||
    admin.role !== "admin"
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}


/* ========================================
   PROCTOR PROTECTION
======================================== */

function ProctorProtectedRoute({ children }) {
  let proctor = null;

  try {
    proctor = JSON.parse(
      localStorage.getItem(
        "messFinderCurrentProctor"
      )
    );
  } catch {
    proctor = null;
  }

  if (
    !proctor ||
    proctor.role !== "proctor"
  ) {
    return (
      <Navigate
        to="/proctor/login"
        replace
      />
    );
  }

  return children;
}


function AppRoutes() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* =========================
              PUBLIC
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/find-mess"
            element={<FindMess />}
          />

          <Route
            path="/mess/:id"
            element={<MessDetails />}
          />

          <Route
            path="/best-match"
            element={<BestMatch />}
          />

          <Route
            path="/compare"
            element={<Compare />}
          />


          {/* =========================
              LOGIN SELECTION
          ========================= */}

          <Route
            path="/choose-login"
            element={<RoleLogin />}
          />


          {/* =========================
              STUDENT
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/student-support"
            element={
              <StudentProtectedRoute>
                <StudentSupport />
              </StudentProtectedRoute>
            }
          />


          {/* =========================
              OWNER
          ========================= */}

          <Route
            path="/owner/login"
            element={<OwnerLogin />}
          />

          <Route
            path="/owner/register"
            element={<OwnerRegister />}
          />

          <Route
            path="/owner/dashboard"
            element={<OwnerDashboard />}
          />

          <Route
            path="/owner/add-mess"
            element={<AddMess />}
          />

          <Route
            path="/owner/manage-mess"
            element={<ManageMess />}
          />

          <Route
            path="/owner/edit-mess/:id"
            element={<EditMess />}
          />


          {/* =========================
              PROCTOR
          ========================= */}

          <Route
            path="/proctor/login"
            element={<ProctorLogin />}
          />

          <Route
            path="/proctor"
            element={
              <ProctorProtectedRoute>
                <ProctorDashboard />
              </ProctorProtectedRoute>
            }
          />


          {/* =========================
              ADMIN
          ========================= */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />


          {/* =========================
              404
          ========================= */}

          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>

                <h2>
                  Page Not Found
                </h2>

                <p>
                  The page you are looking for
                  does not exist.
                </p>
              </div>
            }
          />

        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default AppRoutes;
