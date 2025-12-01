import React, { useEffect, useState } from "react";
import {
  getMyAppointmentsAsPractitioner,
  getMyPastAppointmentsAsPractitioner,
} from "../../api/practitioners";
import {
  deleteAppointment,
  rescheduleAppointment,
} from "../../api/appointments";

function formatDateTime(dateStr, timeStart, timeEnd) {
  if (!dateStr || !timeStart || !timeEnd) return "";

  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h1, m1] = timeStart.split(":").map(Number);
  const [h2, m2] = timeEnd.split(":").map(Number);

  const start = new Date(y, mo - 1, d, h1, m1);
  const end = new Date(y, mo - 1, d, h2, m2);

  return `${start.toLocaleDateString()} • ${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

const SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30",
];

export default function PractitionerAppointments() {
  const [range, setRange] = useState("upcoming");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleSaving, setRescheduleSaving] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelSaving, setCancelSaving] = useState(false);
  const [cancelError, setCancelError] = useState("");

  async function load(currentRange) {
    setLoading(true);
    setError("");
    try {
      const data =
        currentRange === "past"
          ? await getMyPastAppointmentsAsPractitioner()
          : await getMyAppointmentsAsPractitioner();

      setItems(data || []);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to load appointments.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(range);
  }, [range]);

  const openRescheduleModal = (appt) => {
    setRescheduleTarget(appt);
    setRescheduleError("");
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.timeStart);
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleSaving(false);
    setRescheduleError("");
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleTarget) return;

    try {
      setRescheduleSaving(true);

      const [hh, mm] = rescheduleTime.split(":").map(Number);
      const start = new Date(rescheduleDate);
      start.setHours(hh, mm, 0, 0);
      const end = new Date(start.getTime() + 30 * 60000);

      const pad = (n) => String(n).padStart(2, "0");

      const payload = {
        date: rescheduleDate,
        timeStart: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        timeEnd: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
      };

      await rescheduleAppointment(rescheduleTarget._id, payload);
      closeRescheduleModal();
      load(range);
    } catch (err) {
      setRescheduleError("Failed to reschedule appointment.");
      setRescheduleSaving(false);
    }
  };

  const openCancelModal = (appt) => {
    setCancelTarget(appt);
    setCancelError("");
  };

  const closeCancelModal = () => {
    setCancelSaving(false);
    setCancelTarget(null);
    setCancelError("");
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      setCancelSaving(true);
      await deleteAppointment(cancelTarget._id);
      closeCancelModal();
      load(range);
    } catch (err) {
      setCancelError("Failed to cancel appointment.");
      setCancelSaving(false);
    }
  };

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">

      {/* Header + Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Appointments</h1>

        <div className="inline-flex rounded-md border dark:border-gray-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setRange("upcoming")}
            className={`px-3 py-1 text-sm ${
              range === "upcoming"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setRange("past")}
            className={`px-3 py-1 text-sm border-l dark:border-gray-700 ${
              range === "past"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {loading && <p className="text-gray-500 dark:text-gray-400 text-sm">Loading…</p>}

      {!loading && !items.length && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {range === "upcoming"
            ? "No upcoming appointments."
            : "No past appointments."}
        </p>
      )}

      {/* TABLE */}
      {!loading && items.length > 0 && (
        <div className="overflow-x-auto border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {["Date / Time", "Patient", "Type", "Reason", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((appt) => {
                const patient = appt.patientId || {};
                const patientName =
                  patient.fullName ||
                  `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
                  patient.email ||
                  "Unknown patient";

                return (
                  <tr key={appt._id} className="border-t dark:border-gray-700">
                    <td className="px-3 py-2">
                      {formatDateTime(appt.date, appt.timeStart, appt.timeEnd)}
                    </td>

                    <td className="px-3 py-2">{patientName}</td>
                    <td className="px-3 py-2">{appt.type}</td>

                    <td className="px-3 py-2 max-w-xs">
                      <div className="line-clamp-2 text-gray-700 dark:text-gray-300">
                        {appt.reason}
                      </div>
                    </td>

                    <td className="px-3 py-2 capitalize">
                      {appt.status || "scheduled"}
                    </td>

                    <td className="px-3 py-2 space-x-2 whitespace-nowrap">

                      {/* Start Appointment */}
                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = `/practitioner/notes/${appt._id}`)
                        }
                        className="px-2 py-1 text-xs rounded border border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        Start
                      </button>

                      {/* Reschedule */}
                      <button
                        type="button"
                        onClick={() => openRescheduleModal(appt)}
                        className="px-2 py-1 text-xs rounded border border-gray-400 text-gray-700 dark:text-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Reschedule
                      </button>

                      {/* Cancel */}
                      <button
                        type="button"
                        onClick={() => openCancelModal(appt)}
                        className="px-2 py-1 text-xs rounded border border-red-500 text-red-600 dark:text-red-400 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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

      {/* RESCHEDULE MODAL */}
      {rescheduleTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl overflow-hidden border dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleRescheduleSubmit}
              className="px-4 py-4 space-y-4 text-gray-900 dark:text-gray-100"
            >
              {rescheduleError && (
                <p className="text-red-600 text-sm">{rescheduleError}</p>
              )}

              <div>
                <label className="block text-sm mb-1">Date *</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Time Slot *</label>
                <select
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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

              <div className="pt-2 flex justify-end gap-3 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className="px-4 py-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={rescheduleSaving}
                  className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                >
                  {rescheduleSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl overflow-hidden border dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Cancel Appointment</h2>
              <button
                onClick={closeCancelModal}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="px-4 py-4 space-y-4 text-gray-900 dark:text-gray-100">
              {cancelError && (
                <p className="text-red-600 text-sm">{cancelError}</p>
              )}

              <p>Are you sure? This action cannot be undone.</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">When:</span>{" "}
                {formatDateTime(
                  cancelTarget.date,
                  cancelTarget.timeStart,
                  cancelTarget.timeEnd
                )}
              </p>

              <div className="pt-2 flex justify-end gap-3 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="px-4 py-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Keep
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={cancelSaving}
                  className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
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
