import React from "react";
import AppointmentCard from "./AppointmentCard";

export default function AppointmentList({ items = [], onDelete }) {
  if (!items.length)
    return <div className="text-gray-500 dark:text-gray-300">No appointments.</div>;

  return (
    <ul className="space-y-2">
      {items.map((a) => (
        <AppointmentCard key={a._id} appt={a} onDelete={onDelete} />
      ))}
    </ul>
  );
}
