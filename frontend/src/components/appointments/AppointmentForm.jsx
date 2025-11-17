import React, { useState, useEffect, useRef } from "react";
import { createAppointment } from "../../api/appointments";
import { getPractitioners } from "../../api/practitioners"; // NEW

// Convert "HH:mm" to readable time like "10:30 AM"
function humanTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function AppointmentForm({ open, onClose, onCreated }) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [practitioners, setPractitioners] = useState([]);      // NEW
  const [practitionerId, setPractitionerId] = useState("");    // NEW

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Load practitioners when the modal opens
  useEffect(() => {
    if (!open) return;

    setError("");
    setPractitionerId("");

    (async () => {
      try {
        const list = await getPractitioners();
        setPractitioners(list || []);
      } catch (err) {
        console.error("Failed to load practitioners", err);
        setError("Unable to load practitioners. Please try again.");
      }
    })();
  }, [open]);

  // Close on clicking outside
  const overlayRef = useRef(null);
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const slots = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "13:00","13:30","14:00","14:30","15:00","15:30",
  ];

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!practitionerId) {
      setError("Please select a practitioner.");
      return;
    }

    setSubmitting(true);
    try {
      const [hh, mm] = time.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hh, mm, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const pad = (n) => String(n).padStart(2, "0");

      const payload = {
        date,
        timeStart: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        timeEnd: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
        type,
        reason,
        practitionerId, // NEW
      };

      const created = await createAppointment(payload);
      onCreated?.(created);
      onClose?.();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to create appointment";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl font-semibold">Schedule New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Select Date *</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Appointment Type *</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
                <option value="Annual Physical">Annual Physical</option>
                <option value="Lab Work">Lab Work</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Time Slot *</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                {slots.map((t) => (
                  <option key={t} value={t}>{humanTime(t)}</option>
                ))}
              </select>
            </div>

            {/* NEW: Practitioner select */}
            <div>
              <label className="block text-sm mb-1">Practitioner *</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={practitionerId}
                onChange={(e) => setPractitionerId(e.target.value)}
                required
              >
                <option value="">Select practitioner</option>
                {practitioners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName || `${p.firstName} ${p.lastName}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Reason *</label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[90px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief reason..."
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
            >
              {submitting ? "Saving…" : "Confirm Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
