import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-[#003E7E] text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded px-2 py-1 hover:bg-white/10"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <div className="font-semibold">UWF CareConnect</div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm opacity-90">
          {user?.fullName || user?.username || "Patient"}
        </span>
        <button
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
