// Sidebar.jsx
import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";

const items = [
  { to: "/profile", label: "Profile", icon: "👤" },
  { to: "/appointments", label: "Appointments", icon: "🗓️" },
  { to: "/visits", label: "Visits", icon: "📝" },
  { to: "/medication", label: "Medication", icon: "💊" },
  { to: "/about", label: "About", icon: "ℹ️" },
  { to: "/patient-info", label: "Update Info", icon: "🩺" },
];

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`${collapsed ? "w-16" : "w-64"} bg-white border-r h-[calc(100vh-56px)] transition-all`}>
      <nav className="mt-2">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} className="block">
            {({ isActive }) => (
              <SidebarItem icon={it.icon} label={it.label} collapsed={collapsed} active={isActive} />
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
