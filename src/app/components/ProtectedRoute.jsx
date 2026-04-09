import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function ProtectedRoute({ children, role }) {

  const token = authService.getToken();

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  const user = authService.getCurrentUser();

  // 🔒 Check token expiry
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) {
      authService.logout();
      return <Navigate to="/login" />;
    }
  } catch (err) {
    authService.logout();
    return <Navigate to="/login" />;
  }

  // 👑 Role check (FIXED)
  if (role && user?.role !== `ROLE_${role}`) {
    return <Navigate to="/login" />;
  }

  return children;
}