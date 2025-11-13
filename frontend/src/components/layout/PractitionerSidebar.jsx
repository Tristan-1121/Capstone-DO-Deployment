import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const link = "flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm";
const active = "bg-gray-100 font-medium";

export default function PractitionerSidebar({ collapsed = false }) {
  const { logout } = useAuth();

  return (
    <aside
      id="practitioner-sidebar"
      className={`bg-white border-r shrink-0 overflow-hidden transition-all duration-200 ${
        collapsed ? "w-14" : "w-64"
      }`}
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="h-full flex flex-col">
        <nav className="p-2">
          <NavLink
            to="/practitioner/dashboard"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            <span aria-hidden="true">📊</span>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/practitioner/appointments"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            <span aria-hidden="true">📅</span>
            {!collapsed && <span>Appointments</span>}
          </NavLink>

          <NavLink
            to="/practitioner/callbacks"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            <span aria-hidden="true">📋</span>
            {!collapsed && <span>Callback List</span>}
          </NavLink>

          <NavLink
            to="/practitioner/patients"
            className={({ isActive }) => `${link} ${isActive ? active : ""}`}
          >
            <span aria-hidden="true">👥</span>
            {!collapsed && <span>All Patients</span>}
          </NavLink>
        </nav>

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
