import { useEffect, useState } from "react";

export default function Visits() {
  // placeholder, swap to API later (e.g., http('/api/visits'))
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    // simple mock so UI renders
    setVisits([
      { id: "v2", date: "2025-10-18T09:30:00Z", practitioner: "Dr. Patel", notes: "Resolved sinus infection." },
      { id: "v1", date: "2025-05-03T14:00:00Z", practitioner: "NP Walker", notes: "Routine wellness check." },
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Visits</h1>

      <div className="bg-white border rounded p-4">
        {!visits.length ? (
          <div className="text-gray-500">No past visits.</div>
        ) : (
          <ul className="space-y-2">
            {visits.map((v) => (
              <li key={v.id} className="border rounded p-3">
                <div className="font-medium">{new Date(v.date).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Practitioner: {v.practitioner}</div>
                <div className="text-sm text-gray-600">Summary: {v.notes}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
