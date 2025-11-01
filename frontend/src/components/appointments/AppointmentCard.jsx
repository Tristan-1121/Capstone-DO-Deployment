import React from "react";

// Compact, reusable card for a single appointment item
export default function AppointmentCard({ appt, onDelete }) {
  const start = new Date(appt.start);
  const end = new Date(appt.end);

  // small status pill
  const Status = () => (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-full ${
        appt.status === "completed"
          ? "bg-emerald-100 text-emerald-700"
          : appt.status === "canceled"
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {appt.status || "scheduled"}
    </span>
  );

  return (
    <li className="border rounded p-3 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium">
            {start.toLocaleString()} &rarr; {end.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Reason: {appt.reason}
          </div>
          {appt.practitionerName && (
            <div className="text-sm text-gray-600">
              Practitioner: {appt.practitionerName}
            </div>
          )}
        </div>
        <Status />
      </div>

      <div className="mt-3 flex gap-3">
        <button
          className="text-sm text-red-600 hover:underline"
          onClick={() => onDelete?.(appt._id)}
        >
          Delete
        </button>
        {/* Add “Reschedule” or “View details” later if needed */}
      </div>
    </li>
  );
}
