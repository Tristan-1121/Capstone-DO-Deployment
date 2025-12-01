import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const link =
  "flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800";
const active =
  "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-gray-100";

export default function Sidebar({ collapsed = false }) {
  const { logout } = useAuth();

  return (
    <aside
      id="app-sidebar"
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
      shrink-0 overflow-hidden transition-all duration-200 
      ${collapsed ? "w-14" : "w-64"}`}
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="h-full flex flex-col text-gray-800 dark:text-gray-200">
        <nav className="p-2 space-y-1">
          <NavLink to="/profile" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">👤</span>
            {!collapsed && <span>Profile</span>}
          </NavLink>

          <NavLink to="/appointments" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">📅</span>
            {!collapsed && <span>Appointments</span>}
          </NavLink>

          <NavLink to="/visits" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">🧾</span>
            {!collapsed && <span>Visits</span>}
          </NavLink>

          <NavLink to="/medication" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">💊</span>
            {!collapsed && <span>Medication</span>}
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">ℹ️</span>
            {!collapsed && <span>About</span>}
          </NavLink>

          <NavLink to="/patient-info" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">🩺</span>
            {!collapsed && <span>Update Info</span>}
          </NavLink>
        </nav>

        <div className="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm 
            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20`}
            aria-label="Logout"
          >
            <span aria-hidden="true">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
