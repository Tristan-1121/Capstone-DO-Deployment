// src/components/layout/Layout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setCollapsed((c) => !c)} />

      <div className="flex">
        <Sidebar collapsed={collapsed} />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full
                         bg-gray-50 dark:bg-gray-900
                         transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
