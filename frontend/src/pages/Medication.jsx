import { useEffect, useState } from "react";

export default function Medication() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch("/api/patients/me/prescriptions")
      .then((response) => response.json())
      .then((data) => setMeds(data))
      .catch((error) => console.error("Error fetching prescriptions:", error));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold dark:text-gray-100">Medication</h1>

      <div
        className="
          bg-white border rounded p-4 shadow-sm
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
        "
      >
        {!meds.length ? (
          <div className="text-gray-500 dark:text-gray-300">
            No medications on file.
          </div>
        ) : (
          <ul className="space-y-3">
            {meds.map((m) => (
              <li
                key={m.id || m._id}
                className="
                  border rounded p-3
                  bg-gray-50 dark:bg-gray-800
                  border-gray-200 dark:border-gray-700
                "
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {m.medicationName || m.name}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {(m.dose || m.dosage || "-")} — {(m.schedule || m.frequency || "-")}
                </div>

                {m.prescribedBy && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Prescribed by {m.prescribedBy}
                  </div>
                )}

                {/* Status badge */}
                <span
                  className={`
                    inline-block mt-2 text-xs px-2 py-0.5 rounded-full
                    ${m.active
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}
                  `}
                >
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
