// frontend/src/pages/practitioner/Appointments.jsx
import React, { useEffect, useState } from "react";
import { getMyAppointmentsAsPractitioner } from "../../api/practitioners";

function formatDateTime(dateStr, timeStart, timeEnd) {
  if (!dateStr || !timeStart || !timeEnd) return "";

  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h1, m1] = timeStart.split(":").map(Number);
  const [h2, m2] = timeEnd.split(":").map(Number);

  const start = new Date(y, mo - 1, d, h1, m1);
  const end = new Date(y, mo - 1, d, h2, m2);

  const datePart = start.toLocaleDateString();
  const startPart = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const endPart = end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return `${datePart} • ${startPart} – ${endPart}`;
}

export default function PractitionerAppointmentsPage() {
  const [range, setRange] = useState("upcoming"); // "upcoming" | "past"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async (currentRange) => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyAppointmentsAsPractitioner(currentRange);
      setItems(data || []);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to load appointments";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(range);
  }, [range]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <div className="inline-flex rounded-md border overflow-hidden">
          <button
            type="button"
            onClick={() => setRange("upcoming")}
            className={`px-3 py-1 text-sm ${
              range === "upcoming" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setRange("past")}
            className={`px-3 py-1 text-sm border-l ${
              range === "past" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-gray-500 text-sm">Loading appointments…</div>}

      {!loading && !items.length && !error && (
        <div className="text-gray-500 text-sm">
          {range === "upcoming" ? "No upcoming appointments." : "No past appointments."}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="overflow-x-auto border rounded-md bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Date / Time</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Patient</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Reason</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((appt) => {
                const patient = appt.patientId || {};
                const patientName =
                  patient.fullName ||
                  (patient.firstName || patient.lastName
                    ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                    : patient.email || "Unknown patient");

                return (
                  <tr key={appt._id} className="border-t">
                    <td className="px-3 py-2 align-top">
                      {formatDateTime(appt.date, appt.timeStart, appt.timeEnd)}
                    </td>
                    <td className="px-3 py-2 align-top">{patientName}</td>
                    <td className="px-3 py-2 align-top">{appt.type}</td>
                    <td className="px-3 py-2 align-top max-w-xs">
                      <div className="line-clamp-2">{appt.reason}</div>
                    </td>
                    <td className="px-3 py-2 align-top capitalize">
                      {appt.status || "scheduled"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
