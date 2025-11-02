import React from "react";

export default function AllergiesSection({ profile = {} }) {
  const Allergies = profile.Allergies || [];

  return (
    <section className="bg-white rounded border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Allergies</h3>
      {Array.isArray(Allergies) && Allergies.length ? (
        <table className="w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-1 text-left">Allergen</th>
              <th className="border px-2 py-1 text-left">Reaction</th>
              <th className="border px-2 py-1 text-left">Severity</th>
            </tr>
          </thead>
          <tbody>
            {Allergies.map((a, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{a.allergen || "-"}</td>
                <td className="border px-2 py-1">{a.reaction || "-"}</td>
                <td className="border px-2 py-1">{a.severity || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span className="text-gray-500">No allergies on file.</span>
      )}
    </section>
  );
}
