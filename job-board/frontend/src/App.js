// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import CandidateDashboard from "./pages/CandidateDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

// PROFILE
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import ChangePassword from "./pages/Profile/ChangePassword";
import UploadPicture from "./pages/Profile/UploadPicture";
import UploadResume from "./pages/Profile/UploadResume";
import UploadLogo from "./pages/Profile/UploadLogo";

import { useEffect, useState } from "react";

// ============================
// NEW: PROTECTED ROUTE (LOCALSTORAGE-BASED)
// ============================
const ProtectedRoute = ({ allowedRole, children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole)
    return <Navigate to="/" replace />;

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  // Sync localStorage → App state (mainly for Navbar)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <>
      <Navbar user={user} logout={logout} />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* JOB DETAIL */}
        <Route path="/job/:id" element={<JobDetail />} />

        {/* PROFILE ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/upload-picture"
          element={
            <ProtectedRoute>
              <UploadPicture />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/upload-resume"
          element={
            <ProtectedRoute allowedRole="candidate">
              <UploadResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/upload-logo"
          element={
            <ProtectedRoute allowedRole="employer">
              <UploadLogo />
            </ProtectedRoute>
          }
        />

        {/* CANDIDATE DASHBOARD */}
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYER DASHBOARD */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
