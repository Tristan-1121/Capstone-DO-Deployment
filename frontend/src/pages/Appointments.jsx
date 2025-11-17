// frontend/src/pages/Appointments.jsx

import React, { useEffect, useState } from "react";
import {
  getMyAppointments,
  deleteAppointment,
  createAppointment,
} from "../api/appointments";
import AppointmentList from "../components/appointments/AppointmentList";
import AppointmentForm from "../components/appointments/AppointmentForm";

export default function Appointments() {
  const [range, setRange] = useState("upcoming"); // "upcoming" | "past"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadData = async (currentRange) => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyAppointments(currentRange);
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

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      setItems((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to delete appointment";
      alert(msg);
    }
  };

  const handleCreated = (appt) => {
    if (range === "upcoming") {
      setItems((prev) => [...prev, appt]);
    } else {
      loadData(range);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header + create button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Appointments</h1>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 text-sm"
        >
          Schedule Appointment
        </button>
      </div>

      {/* Upcoming / Past toggle */}
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

      {/* Errors + loading */}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && (
        <div className="text-gray-500 text-sm">Loading appointments…</div>
      )}

      {/* Empty state */}
      {!loading && !items.length && !error && (
        <div className="text-gray-500 text-sm">
          {range === "upcoming"
            ? "You have no upcoming appointments."
            : "You have no past appointments."}
        </div>
      )}

      {/* List */}
      {!loading && items.length > 0 && (
        <AppointmentList items={items} onDelete={handleDelete} />
      )}

      {/* Create Appointment modal */}
      <AppointmentForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
