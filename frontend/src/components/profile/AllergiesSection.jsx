import React from "react";

export default function AllergiesSection({ profile = {} }) {
  const Allergies = profile.Allergies || [];

  return (
    <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Allergies</h3>

      {Array.isArray(Allergies) && Allergies.length ? (
        <table className="w-full border dark:border-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="border dark:border-gray-700 px-2 py-1 text-left">Allergen</th>
              <th className="border dark:border-gray-700 px-2 py-1 text-left">Reaction</th>
              <th className="border dark:border-gray-700 px-2 py-1 text-left">Severity</th>
            </tr>
          </thead>
          <tbody>
            {Allergies.map((a, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                <td className="border dark:border-gray-700 px-2 py-1">{a.allergen || "-"}</td>
                <td className="border dark:border-gray-700 px-2 py-1">{a.reaction || "-"}</td>
                <td className="border dark:border-gray-700 px-2 py-1">{a.severity || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span className="text-gray-500 dark:text-gray-300">No allergies on file.</span>
      )}
    </section>
  );
}
