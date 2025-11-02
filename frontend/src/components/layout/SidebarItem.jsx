// SidebarItem.jsx
export default function SidebarItem({ icon, label, collapsed, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${
        active ? "bg-gray-100 font-medium" : ""
      }`}
    >
      <span aria-hidden="true">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </div>
  );
}
