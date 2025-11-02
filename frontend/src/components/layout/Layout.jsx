import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  // restore persisted preference
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  // save preference on change
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onToggleSidebar={() => setCollapsed(c => !c)} />
      <div className="flex">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <main className="flex-1 p-6">
          {/* Outlet renders the active child route (Profile, Appointments, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
