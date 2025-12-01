// frontend/src/pages/practitioner/Dashboard.jsx

import { useEffect, useState } from "react";
import api from "../../api/http";
import { getMyCallbacks } from "../../api/callbacks";

export default function PractitionerDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Patients", value: 0, caption: "Active in your panel" },
    { label: "Callback Needed", value: 0, caption: "Awaiting follow-up" },
    { label: "Upcoming Appointments", value: 0, caption: "Next 7 days" },
    { label: "Active Prescriptions", value: 0, caption: "Currently prescribed" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: summary } = await api.get(
          "/api/practitioners/me/summary"
        );

        const callbacks = await getMyCallbacks("pending");
        const callbackCount = callbacks?.length || 0;

        setStats([
          {
            label: "Total Patients",
            value: summary.totalPatients,
            caption: "Active in your panel",
          },
          {
            label: "Callback Needed",
            value: callbackCount,
            caption: "Awaiting follow-up",
          },
          {
            label: "Upcoming Appointments",
            value: summary.upcomingAppointments,
            caption: "Next 7 days",
          },
          {
            label: "Active Prescriptions",
            value: 0,
            caption: "Currently prescribed",
          },
        ]);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <header>
        <h1 className="text-2xl font-semibold">Practitioner Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage your patients and appointments.
        </p>
      </header>

      {/* KPI tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700
                       rounded-lg shadow-sm p-4 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#003E7E] dark:text-emerald-300">
                {stat.value}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-400">
              {stat.caption}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
