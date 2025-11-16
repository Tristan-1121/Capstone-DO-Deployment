import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import PractitionerSidebar from "./PractitionerSidebar";

// Layout shell for practitioner routes
export default function PractitionerLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // Restore sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("practitioner-sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("practitioner-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar onToggleSidebar={() => setCollapsed((c) => !c)} />

      <div className="flex">
        <PractitionerSidebar collapsed={collapsed} />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
