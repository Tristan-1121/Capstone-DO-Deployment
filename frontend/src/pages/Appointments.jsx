import { useEffect, useState } from "react";
import {
  getPractitionerAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../api/appointments";
import formatDateTime from "../../utils/formatDateTime";

export default function PractitionerAppointments() {
  const [range, setRange] = useState("upcoming");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // RESCHEDULE MODAL STATE
  // -------------------------
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTimeStart, setNewTimeStart] = useState("");
  const [newTimeEnd, setNewTimeEnd] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // -------------------------
  // CANCEL MODAL STATE (NEW)
  // -------------------------
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // ------------------------------------------------------------------
  // Load appointments (Upcoming / Past)
  // ------------------------------------------------------------------
  const loadData = async (type) => {
    setLoading(true);
    setError("");
    try {
      const data = await getPractitionerAppointments(type);
      setItems(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to load appointments";
      setError(msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(range);
  }, [range]);

  // ------------------------------------------------------------------
  // OPEN / CLOSE RESCHEDULE MODAL
  // ------------------------------------------------------------------
  const openRescheduleModal = (appt) => {
    setRescheduleTarget(appt);
    setNewDate(appt.date || "");
    setNewTimeStart(appt.timeStart || "");
    setNewTimeEnd(appt.timeEnd || "");
    setRescheduleError("");
    setRescheduleLoading(false);
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
    setNewDate("");
    setNewTimeStart("");
    setNewTimeEnd("");
    setRescheduleError("");
    setRescheduleLoading(false);
  };

  // ------------------------------------------------------------------
  // SUBMIT RESCHEDULE
  // ------------------------------------------------------------------
  const submitReschedule = async () => {
    if (!rescheduleTarget) return;

    setRescheduleLoading(true);
    setRescheduleError("");

    try {
      await updateAppointment(rescheduleTarget._id, {
        date: newDate,
        timeStart: newTimeStart,
        timeEnd: newTimeEnd,
      });
      closeRescheduleModal();
      loadData(range);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to update appointment";
      setRescheduleError(msg);
    }

    setRescheduleLoading(false);
  };

  // ------------------------------------------------------------------
  // OPEN / CLOSE CANCEL MODAL (NEW)
  // ------------------------------------------------------------------
  const openCancelModal = (appt) => {
    setCancelTarget(appt);
    setCancelError("");
    setCancelLoading(false);
  };

  const closeCancelModal = () => {
    setCancelTarget(null);
    setCancelError("");
    setCancelLoading(false);
  };

  // ------------------------------------------------------------------
  // SUBMIT CANCEL APPOINTMENT
  // ------------------------------------------------------------------
  const confirmCancel = async () => {
    if (!cancelTarget) return;

    setCancelLoading(true);
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
      setCancelLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Appointments</h1>

      {/* Toggle upcoming/past */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={() => setRange("upcoming")}
          className={`px-4 py-2 rounded ${
            range === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setRange("past")}
          className={`px-4 py-2 rounded ${
            range === "past"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Past
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* -------------------------------------------- */}
      {/*  APPOINTMENTS TABLE */}
      {/* -------------------------------------------- */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-2 text-left">Date / Time</th>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Reason</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((appt) => (
              <tr key={appt._id} className="border-b">
                <td className="px-3 py-2">
                  {formatDateTime(appt.date, appt.timeStart, appt.timeEnd)}
                </td>

                <td className="px-3 py-2">
                  {(() => {
                    const p = appt.patientId || {};
                    return (
                      p.fullName ||
                      (p.firstName || p.lastName
                        ? `${p.firstName || ""} ${p.lastName || ""}`.trim()
                        : p.email || "Unknown patient")
                    );
                  })()}
                </td>

                <td className="px-3 py-2">{appt.type}</td>
                <td className="px-3 py-2">{appt.reason}</td>
                <td className="px-3 py-2">{appt.status}</td>

                <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openRescheduleModal(appt)}
                    className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => openCancelModal(appt)}
                    className="px-2 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="6" className="px-3 py-4 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------- */}
      {/* RESCHEDULE MODAL */}
      {/* ------------------------------------------------- */}
      {rescheduleTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Reschedule Appointment</h2>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              {rescheduleError && (
                <div className="text-sm text-red-600">{rescheduleError}</div>
              )}

              <div className="space-y-1">
                <label className="text-sm">New Date</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm">New Start Time</label>
                <input
                  type="time"
                  className="w-full border px-3 py-2 rounded"
                  value={newTimeStart}
                  onChange={(e) => setNewTimeStart(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm">New End Time</label>
                <input
                  type="time"
                  className="w-full border px-3 py-2 rounded"
                  value={newTimeEnd}
                  onChange={(e) => setNewTimeEnd(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  onClick={closeRescheduleModal}
                  className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={submitReschedule}
                  disabled={rescheduleLoading}
                  className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:bg-blue-300 hover:bg-blue-700"
                >
                  {rescheduleLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------- */}
      {/* CANCEL MODAL (NEW + CLEAN) */}
      {/* ------------------------------------------------- */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Cancel Appointment</h2>
              <button
                onClick={closeCancelModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
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
                <br />This action cannot be undone.
              </p>

              <p className="text-sm text-gray-500">
                <span className="font-medium">Patient:</span>{" "}
                {(() => {
                  const p = cancelTarget.patientId || {};
                  return (
                    p.fullName ||
                    (p.firstName || p.lastName
                      ? `${p.firstName || ""} ${p.lastName || ""}`.trim()
                      : p.email || "Unknown patient")
                  );
                })()}
                <br />
                <span className="font-medium">When:</span>{" "}
                {formatDateTime(
                  cancelTarget.date,
                  cancelTarget.timeStart,
                  cancelTarget.timeEnd
                )}
              </p>

              <div className="flex justify-end space-x-3 pt-2 border-t">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                >
                  Keep Appointment
                </button>

                <button
                  onClick={confirmCancel}
                  disabled={cancelLoading}
                  className="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:bg-red-300"
                >
                  {cancelLoading ? "Canceling…" : "Cancel Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
