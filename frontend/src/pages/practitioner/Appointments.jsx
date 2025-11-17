import React, { useEffect, useState } from "react";
import { getMyAppointmentsAsPractitioner } from "../../api/practitioners";
import {
  deleteAppointment,
  rescheduleAppointment,
} from "../../api/appointments";

// Local helper to format date/time
function formatDateTime(dateStr, timeStart, timeEnd) {
  if (!dateStr || !timeStart || !timeEnd) return "";

  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h1, m1] = timeStart.split(":").map(Number);
  const [h2, m2] = timeEnd.split(":").map(Number);

  const start = new Date(y, mo - 1, d, h1, m1);
  const end = new Date(y, mo - 1, d, h2, m2);

  const datePart = start.toLocaleDateString();
  const startPart = start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endPart = end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} • ${startPart} – ${endPart}`;
}

// reuse 30min slots like patient scheduler
const SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

export default function PractitionerAppointments() {
  const [range, setRange] = useState("upcoming"); // "upcoming" | "past"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const [rescheduleSaving, setRescheduleSaving] = useState(false);

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelSaving, setCancelSaving] = useState(false);

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

  // Reschedule handlers
  const openRescheduleModal = (appt) => {
    setRescheduleTarget(appt);
    setRescheduleError("");
    setRescheduleDate(appt.date || "");
    setRescheduleTime(appt.timeStart || "");
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
    setRescheduleError("");
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleSaving(false);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleTarget) return;
    setRescheduleError("");
    setRescheduleSaving(true);

    try {
      if (!rescheduleDate || !rescheduleTime) {
        setRescheduleError("Please select date and time.");
        setRescheduleSaving(false);
        return;
      }

      const [hh, mm] = rescheduleTime.split(":").map(Number);
      const start = new Date(rescheduleDate);
      start.setHours(hh, mm, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const pad = (n) => String(n).padStart(2, "0");

      const payload = {
        date: rescheduleDate,
        timeStart: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        timeEnd: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
      };

      await rescheduleAppointment(rescheduleTarget._id, payload);
      closeRescheduleModal();
      loadData(range);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to reschedule appointment";
      setRescheduleError(msg);
      setRescheduleSaving(false);
    }
  };

  // Cancel handlers (clean modal, no window.confirm)
  const openCancelModal = (appt) => {
    setCancelTarget(appt);
    setCancelError("");
    setCancelSaving(false);
  };

  const closeCancelModal = () => {
    setCancelTarget(null);
    setCancelError("");
    setCancelSaving(false);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelSaving(true);
    setCancelError("");

    try {
      await deleteAppointment(cancelTarget._id);
      closeCancelModal();
      loadData(range);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to cancel appointment";
      setCancelError(msg);
      setCancelSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <div className="inline-flex rounded-md border overflow-hidden">
          <button
            type="button"
            onClick={() => setRange("upcoming")}
            className={`px-3 py-1 text-sm ${
              range === "upcoming"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setRange("past")}
            className={`px-3 py-1 text-sm border-l ${
              range === "past"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && (
        <div className="text-gray-500 text-sm">Loading appointments…</div>
      )}

      {!loading && !items.length && !error && (
        <div className="text-gray-500 text-sm">
          {range === "upcoming"
            ? "No upcoming appointments."
            : "No past appointments."}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="overflow-x-auto border rounded-md bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Date / Time
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Patient
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Type
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Reason
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((appt) => {
                const patient = appt.patientId || {};
                const patientName =
                  patient.fullName ||
                  (patient.firstName || patient.lastName
                    ? `${patient.firstName || ""} ${
                        patient.lastName || ""
                      }`.trim()
                    : patient.email || "Unknown patient");

                return (
                  <tr key={appt._id} className="border-t">
                    <td className="px-3 py-2 align-top">
                      {formatDateTime(
                        appt.date,
                        appt.timeStart,
                        appt.timeEnd
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">{patientName}</td>
                    <td className="px-3 py-2 align-top">{appt.type}</td>
                    <td className="px-3 py-2 align-top max-w-xs">
                      <div className="line-clamp-2">{appt.reason}</div>
                    </td>
                    <td className="px-3 py-2 align-top capitalize">
                      {appt.status || "scheduled"}
                    </td>
                    <td className="px-3 py-2 align-top space-x-2 whitespace-nowrap">
                      {/* Start Appointment button */}
                      <button
                        type="button"
                        onClick={() => window.location.href = `/practitioner/notes/${appt._id}`}
                        className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        Start Appointment
                      </button>

                      <button
                        type="button"
                        className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50"
                        onClick={() => openRescheduleModal(appt)}
                      >
                        Reschedule
                      </button>

                      <button
                        type="button"
                        className="px-2 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => openCancelModal(appt)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Reschedule Appointment
              </h2>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleRescheduleSubmit}
              className="px-4 py-4 space-y-4"
            >
              {rescheduleError && (
                <div className="text-sm text-red-600">
                  {rescheduleError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm mb-1">Date *</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm mb-1">Time Slot *</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  required
                >
                  <option value="">Select time</option>
                  {SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className="px-4 py-2 rounded border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduleSaving}
                  className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                >
                  {rescheduleSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Cancel Appointment</h2>
              <button
                onClick={closeCancelModal}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-4 py-4 space-y-4">
              {cancelError && (
                <div className="text-sm text-red-600">{cancelError}</div>
              )}

              <p className="text-sm text-gray-700">
                Are you sure you want to cancel this appointment?
                This action cannot be undone.
              </p>

              <p className="text-sm text-gray-500">
                <span className="font-medium">When:</span>{" "}
                {formatDateTime(
                  cancelTarget.date,
                  cancelTarget.timeStart,
                  cancelTarget.timeEnd
                )}
              </p>

              <div className="pt-2 flex items-center justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="px-4 py-2 rounded border hover:bg-gray-50 text-sm"
                  disabled={cancelSaving}
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-sm"
                  disabled={cancelSaving}
                >
                  {cancelSaving ? "Canceling…" : "Cancel Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
