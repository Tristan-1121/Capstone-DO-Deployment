import { useEffect, useState } from "react";
import { getMyAppointments, createAppointment, deleteAppointment } from "../api/appointments";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentList from "../components/appointments/AppointmentList";

export default function Appointments() {
  const [tab, setTab] = useState("upcoming");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const load = () =>
    getMyAppointments(tab)
      .then(setList)
      .catch(() => setError("Failed to load appointments"));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const create = async (payload) => {
    try {
      await createAppointment(payload);
      setOpen(false);
      load();
    } catch {
      alert("Failed to create appointment");
    }
  };

  const remove = async (id) => {
    try {
      await deleteAppointment(id);
      load();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Appointment Scheduling</h1>

      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded border ${tab === "upcoming" ? "bg-gray-200" : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-3 py-1 rounded border ${tab === "past" ? "bg-gray-200" : ""}`}
          onClick={() => setTab("past")}
        >
          Past
        </button>
        <div className="flex-1" />
        <button className="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => setOpen(true)}>
          Schedule New Appointment
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white border rounded p-4">
        <AppointmentList items={list} onDelete={remove} />
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
          <AppointmentForm onSubmit={create} onCancel={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
