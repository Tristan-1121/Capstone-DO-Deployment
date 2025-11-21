// frontend/src/pages/practitioner/Dashboard.jsx

import { useEffect, useState } from "react";
import { getPractitionerAppointments } from "../../api/appointments";
import { getMyCallbacks } from "../../api/callbacks";
import api from "../../api/http";

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
        // 1) Load appointments
        const appts = await getPractitionerAppointments();

        const upcoming = appts.length;

        // Unique patient count
        const patientIds = [...new Set(appts.map((a) => String(a.patientId)))];
        const totalPatients = patientIds.length;

        // 2) Load callbacks (pending only)
        const callbacks = await getMyCallbacks("pending");
        const callbackCount = callbacks?.length || 0;

        // 3) Active prescriptions (placeholder until feature is added)
        const activePrescriptions = 0;

        setStats([
          {
            label: "Total Patients",
            value: totalPatients,
            caption: "Active in your panel",
          },
          {
            label: "Callback Needed",
            value: callbackCount,
            caption: "Awaiting follow-up",
          },
          {
            label: "Upcoming Appointments",
            value: upcoming,
            caption: "Next 7 days",
          },
          {
            label: "Active Prescriptions",
            value: activePrescriptions,
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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Practitioner Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your patients and appointments.
        </p>
      </header>

      {/* KPI tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#003E7E]">
                {stat.value}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-400">{stat.caption}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Patient Management
        </h2>
        <p className="text-sm text-gray-600">
          Patient list, callbacks, and visit history will be added here in a
          future card.
        </p>
      </section>
    </div>
  );
}

