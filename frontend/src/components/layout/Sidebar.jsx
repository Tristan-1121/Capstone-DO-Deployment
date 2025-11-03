import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const link = "flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm";
const active = "bg-gray-100 font-medium";

export default function Sidebar({ collapsed = false }) {
  const { logout } = useAuth();

  return (
    <aside
      id="app-sidebar"
      className={`bg-white border-r shrink-0 overflow-hidden transition-all duration-200 ${
        collapsed ? "w-14" : "w-64"
      }`}
      style={{ minHeight: "calc(100vh - 56px)" }} // 56px = h-14 navbar
      aria-hidden={false}
    >
      <div className="h-full flex flex-col">
        <nav className="p-2">
          <NavLink to="/profile" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">👤</span>{!collapsed && <span>Profile</span>}
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">📅</span>{!collapsed && <span>Appointments</span>}
          </NavLink>
          <NavLink to="/visits" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">🧾</span>{!collapsed && <span>Visits</span>}
          </NavLink>
          <NavLink to="/medication" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">💊</span>{!collapsed && <span>Medication</span>}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">ℹ️</span>{!collapsed && <span>About</span>}
          </NavLink>
          {/* New route from your HEAD branch */}
          <NavLink to="/patient-info" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            <span aria-hidden="true">🩺</span>{!collapsed && <span>Update Info</span>}
          </NavLink>
        </nav>

        {/* Logout pinned to bottom */}
        <div className="mt-auto p-2 border-t">
          <button
            type="button"
            onClick={logout}
            className={`w-full ${link} text-red-600 hover:bg-red-50`}
            title="Logout"
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

