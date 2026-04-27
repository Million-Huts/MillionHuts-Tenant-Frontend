import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import ProtectedLayout from "@/components/ProtectedLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";

// App Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/TenantProfile";
import PGPage from "./pages/PGPage";
import QRScanner from "./pages/QRScanner";
import Complaints from "./pages/Complaints/Complaints";
import ComplaintDetailsPage from "./pages/Complaints/ComplaintDetails";
import TenantNotificationsPage from "./pages/NotificationsPage";
import MyPG from "./pages/MyPG";

function App() {
  const { loading, isAuthenticated } = useAuth();

  // =============================
  // HANDLE INITIAL LOAD
  // =============================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* =============================
                    PUBLIC ROUTES
                ============================= */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
        </Route>

        {/* =============================
                    PROTECTED ROUTES
                ============================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scan" element={<QRScanner />} />

            {/* PG */}
            <Route path="/pg/:pgCode" element={<PGPage />} />

            <Route path="/my-pg" element={<MyPG />} />

            {/* Complaints */}
            <Route path="/complaints" element={<Complaints />} />
            <Route
              path="/complaints/:complaintId"
              element={<ComplaintDetailsPage />}
            />

            {/* Notifications */}
            <Route
              path="/notifications"
              element={<TenantNotificationsPage />}
            />
          </Route>
        </Route>

        {/* =============================
                    ROOT REDIRECT
                ============================= */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* =============================
                    FALLBACK
                ============================= */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>

      <Toaster position="top-center" />
    </>
  );
}

export default App;