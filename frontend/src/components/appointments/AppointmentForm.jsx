import { useState } from "react";

// Controlled form for scheduling; emits payload to parent via onSubmit
export default function AppointmentForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    practitionerId: "",
    start: "",
    end: "",
    reason: "",
  });

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="bg-white p-4 rounded w-[95%] max-w-lg space-y-3" onSubmit={submit}>
      <h2 className="font-medium text-lg">New Appointment</h2>

      <input
        className="w-full border rounded p-2"
        placeholder="Practitioner ID"
        value={form.practitionerId}
        onChange={change("practitionerId")}
        required
      />
      <input
        type="datetime-local"
        className="w-full border rounded p-2"
        value={form.start}
        onChange={change("start")}
        required
      />
      <input
        type="datetime-local"
        className="w-full border rounded p-2"
        value={form.end}
        onChange={change("end")}
        required
      />
      <textarea
        className="w-full border rounded p-2"
        placeholder="Reason for visit"
        value={form.reason}
        onChange={change("reason")}
        required
      />

      <div className="flex gap-2 justify-end">
        <button type="button" className="px-3 py-1 rounded border" onClick={onCancel}>
          Cancel
        </button>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white">Confirm Appointment</button>
      </div>
    </form>
  );
}
