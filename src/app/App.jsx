import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPassword from "./components/ForgotPassword";   // ✅ NEW
import ResetPassword from "./components/ResetPassword";     // ✅ NEW

import StudentDashboard from "./components/StudentDashboard";
import CourseFeedback from "./components/CourseFeedback";
import InstructorFeedback from "./components/InstructorFeedback";
import ServiceFeedback from "./components/ServiceFeedback";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 AUTH ROUTES */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ FORGOT PASSWORD */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🎓 STUDENT DASHBOARD */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📚 COURSE FEEDBACK */}
        <Route
          path="/student/feedback/course"
          element={
            <ProtectedRoute role="STUDENT">
              <CourseFeedback />
            </ProtectedRoute>
          }
        />

        {/* 👨‍🏫 INSTRUCTOR FEEDBACK */}
        <Route
          path="/student/feedback/instructor"
          element={
            <ProtectedRoute role="STUDENT">
              <InstructorFeedback />
            </ProtectedRoute>
          }
        />

        {/* 🏢 SERVICE FEEDBACK */}
        <Route
          path="/student/feedback/services"
          element={
            <ProtectedRoute role="STUDENT">
              <ServiceFeedback />
            </ProtectedRoute>
          }
        />

        {/* 👑 ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ❌ FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
