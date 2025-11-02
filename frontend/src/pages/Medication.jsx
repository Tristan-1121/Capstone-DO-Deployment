import { useEffect, useState } from "react";

export default function Medication() {
  // placeholder data; replace with API later
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    setMeds([
      { id: "m1", name: "Lisinopril", dose: "10 mg", schedule: "Once daily", prescribedBy: "Dr. Emily Carter", active: true },
      { id: "m2", name: "Cetirizine", dose: "10 mg", schedule: "PRN", prescribedBy: "Dr. Nguyen", active: false },
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Medication</h1>

      <div className="bg-white border rounded p-4">
        {!meds.length ? (
          <div className="text-gray-500">No medications on file.</div>
        ) : (
          <ul className="space-y-2">
            {meds.map((m) => (
              <li key={m.id} className="border rounded p-3">
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-600">{m.dose} — {m.schedule}</div>
                <div className="text-sm text-gray-600">Prescribed by {m.prescribedBy}</div>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${m.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                  {m.active ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
