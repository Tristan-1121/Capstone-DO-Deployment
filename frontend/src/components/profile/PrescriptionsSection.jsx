import React from "react";

export default function PrescriptionsSection({ profile = {} }) {
  const Prescriptions = profile.Prescriptions || [];

  return (
    <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Prescriptions</h3>

      {Array.isArray(Prescriptions) && Prescriptions.length ? (
        <table className="w-full border dark:border-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="border dark:border-gray-700 px-2 py-1 text-left">Medication</th>
              <th className="border dark:border-gray-700 px-2 py-1 text-left">Dosage</th>
              <th className="border dark:border-gray-700 px-2 py-1 text-left">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {Prescriptions.map((p, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                <td className="border dark:border-gray-700 px-2 py-1">{p.medicationName || "-"}</td>
                <td className="border dark:border-gray-700 px-2 py-1">{p.dosage || "-"}</td>
                <td className="border dark:border-gray-700 px-2 py-1">{p.frequency || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span className="text-gray-500 dark:text-gray-300">No prescriptions on file.</span>
      )}
    </section>
  );
}
