export default function AppointmentCard({ appt, onDelete }) {
  const [y, mo, d] = appt.date.split("-").map(Number);
  const [h1, m1] = appt.timeStart.split(":").map(Number);
  const [h2, m2] = appt.timeEnd.split(":").map(Number);

  const start = new Date(y, mo - 1, d, h1, m1);
  const end = new Date(y, mo - 1, d, h2, m2);

  return (
    <li className="border rounded p-3 bg-white">
      <div className="font-medium">
        {start.toLocaleDateString()} • {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        {" – "}
        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      {appt.type && <div className="text-sm text-gray-700 mt-1">Type: {appt.type}</div>}
      <div className="text-sm text-gray-600">Reason: {appt.reason}</div>
      <div className="text-sm mt-1">Status: <span className="capitalize">{appt.status || "scheduled"}</span></div>

      {onDelete && (
        <button className="text-sm text-red-600 hover:underline mt-2" onClick={() => onDelete(appt._id)}>
          Delete
        </button>
      )}
    </li>
  );
}
