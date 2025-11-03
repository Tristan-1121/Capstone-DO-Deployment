import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth() {
  const { user, ready } = useAuth();
  if (!ready) return null; // or a loader
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
