import React from "react";

export default function PrescriptionsSection({ profile = {} }) {
  const Prescriptions = profile.Prescriptions || [];

  return (
    <section className="bg-white rounded border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Prescriptions</h3>
      {Array.isArray(Prescriptions) && Prescriptions.length ? (
        <table className="w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 text-left">Medication</th>
              <th className="border px-2 py-1 text-left">Dosage</th>
              <th className="border px-2 py-1 text-left">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {Prescriptions.map((p, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{p.medicationName || "-"}</td>
                <td className="border px-2 py-1">{p.dosage || "-"}</td>
                <td className="border px-2 py-1">{p.frequency || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span className="text-gray-500">No prescriptions on file.</span>
      )}
    </section>
  );
}
