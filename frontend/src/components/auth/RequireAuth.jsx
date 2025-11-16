import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth({ allow }) {
  const { user, ready } = useAuth();

  // Wait for auth state to finish hydrating
  if (!ready) return null;

  // Not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allow is provided, enforce role-based access
  if (allow && Array.isArray(allow) && allow.length > 0) {
    const role = user.role;
    const isAllowed = allow.includes(role);

    if (!isAllowed) {
      // Send user to their own "home" instead of back to login
      if (role === "practitioner") {
        return <Navigate to="/practitioner/dashboard" replace />;
      }
      // Default: treat as patient
      return <Navigate to="/profile" replace />;
    }
  }

  // Authenticated and allowed
  return <Outlet />;
}
