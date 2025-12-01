import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  showSidebarToggle = true,
  onToggleSidebar = () => {},
  sidebarCollapsed = false,
}) {
  const { user } = useAuth();
  const isPublic = !showSidebarToggle;
  const { dark, setDark } = useTheme();

  const initials =
    user?.fullName?.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase() ||
    user?.username?.slice(0, 2)?.toUpperCase();

  return (
    <header className="z-20 h-14 bg-[#003E7E] text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {isPublic ? (
          <span className="w-6 inline-block" aria-hidden="true" />
        ) : (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded px-2 py-1 hover:bg-white/10 transition"
            aria-label="Toggle sidebar"
          >
            <span
              className={`inline-block transition-transform duration-200 ${
                sidebarCollapsed ? "rotate-90" : "rotate-0"
              }`}
            >
              ☰
            </span>
          </button>
        )}

        <div className="flex items-center gap-2 font-semibold">
          <span>UWF CareConnect</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isPublic && (
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            {dark ? (
              <SunIcon className="h-6 w-6 text-yellow-300" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        )}

        {isPublic ? (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm px-3 py-1 rounded border border-white/30 hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-3 py-1 rounded bg-white text-[#003E7E] hover:bg-white/90"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/15 grid place-items-center text-sm font-medium ring-2 ring-white/20">
                {initials || "👤"}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
