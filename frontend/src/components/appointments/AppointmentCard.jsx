export default function AppointmentCard({ appt, onDelete }) {
  //
  // Format times
  //
  const [y, mo, d] = appt.date.split("-").map(Number);
  const [h1, m1] = appt.timeStart.split(":").map(Number);
  const [h2, m2] = appt.timeEnd.split(":").map(Number);

  const start = new Date(y, mo - 1, d, h1, m1);
  const end = new Date(y, mo - 1, d, h2, m2);

  //
  // Extract practitioner name
  // (Backend should populate practitionerId via .populate(), but we fall back safely)
  //
  let practitionerName = "Unknown Practitioner";

  if (appt.practitionerId) {
    const p = appt.practitionerId;

    if (p.firstName || p.lastName) {
      practitionerName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    } else if (p.fullName) {
      practitionerName = p.fullName;
    } else if (p.email) {
      practitionerName = p.email;
    }
  }

  return (
    <li className="border rounded p-3 bg-white space-y-1">
      {/* Date / Time */}
      <div className="font-medium">
        {start.toLocaleDateString()} •{" "}
        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        {" – "}
        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>

      {/* Appointment Type */}
      {appt.type && (
        <div className="text-sm text-gray-700">Type: {appt.type}</div>
      )}

      {/* Practitioner Name */}
      <div className="text-sm text-gray-700">
        Practitioner: <span className="font-medium">{practitionerName}</span>
      </div>

      {/* Reason */}
      <div className="text-sm text-gray-600">Reason: {appt.reason}</div>

      {/* Status */}
      <div className="text-sm">
        Status:{" "}
        <span className="capitalize">{appt.status || "scheduled"}</span>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          className="text-sm text-red-600 hover:underline mt-2"
          onClick={() => onDelete(appt._id)}
        >
          Delete
        </button>
      )}
    </li>
  );
}

