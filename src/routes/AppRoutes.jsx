import { Routes, Route } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProtectedAdminRoute from "../components/common/ProtectedAdminRoute";

import Home from "../pages/Home";
import FindMess from "../pages/FindMess";
import MessDetails from "../pages/MessDetails";
import BestMatch from "../pages/BestMatch";
import Compare from "../pages/Compare";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import OwnerLogin from "../pages/owner/OwnerLogin";
import OwnerRegister from "../pages/owner/OwnerRegister";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import AddMess from "../pages/owner/AddMess";
import ManageMess from "../pages/owner/ManageMess";
import EditMess from "../pages/owner/EditMess";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* Public Pages */}

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

          {/* Student Authentication */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Owner Authentication */}

          <Route
            path="/owner/login"
            element={<OwnerLogin />}
          />

          <Route
            path="/owner/register"
            element={<OwnerRegister />}
          />

          {/* Owner Dashboard */}

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

          {/* Admin Login */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Protected Admin Dashboard */}

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* 404 */}

          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404</h1>
                <h2>Page Not Found</h2>

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
