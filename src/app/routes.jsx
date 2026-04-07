import { createBrowserRouter } from 'react-router';

import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import CourseFeedback from './components/CourseFeedback';
import InstructorFeedback from './components/InstructorFeedback';
import ServiceFeedback from './components/ServiceFeedback';
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },

  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },

  {
    path: '/student',
    element: (
      <ProtectedRoute>
        <StudentDashboard />
      </ProtectedRoute>
    )
  },

  {
    path: '/student/feedback/course',
    element: (
      <ProtectedRoute>
        <CourseFeedback />
      </ProtectedRoute>
    )
  },

  {
    path: '/student/feedback/instructor',
    element: (
      <ProtectedRoute>
        <InstructorFeedback />
      </ProtectedRoute>
    )
  },

  {
    path: '/student/feedback/services',
    element: (
      <ProtectedRoute>
        <ServiceFeedback />
      </ProtectedRoute>
    )
  },

  {
    path: '*',
    element: <LoginPage />
  }
]);