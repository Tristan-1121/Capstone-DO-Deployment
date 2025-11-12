import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protects routes and can optionally restrict by role
export default function RequireAuth({ allow }) {
  const { user, ready } = useAuth();

  // Wait until auth initialization is done
  if (!ready) return null;

  // No logged in user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allow is provided, check that the user role is allowed
  if (allow && Array.isArray(allow) && allow.length > 0) {
    const role = user.role;
    const isAllowed = allow.includes(role);

    if (!isAllowed) {
      // For now send them back to login
      // Later we will send each role to its own dashboard
      return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and allowed
  return <Outlet />;
}
