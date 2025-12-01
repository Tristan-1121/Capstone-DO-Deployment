import React from "react";

export default function SummarySection({ profile = {}, onEdit }) {
  const {
    Name, name, fullName,
    Email, email,
    Age, age,
    Weight, weight,
    Height, height,
    Sex, sex,
  } = profile || {};

  const display = {
    fullName: Name || fullName || name || "-",
    email: Email || email || "-",
    age: Age ?? age ?? "-",
    weight: Weight ?? weight ?? "-",
    height: Height ?? height ?? "-",
    sex: Sex || sex || "-",
  };

  return (
    <section className="bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rounded border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium text-lg">Patient Summary</h2>

        {onEdit && (
          <button
            onClick={onEdit}
            className="px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 text-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
        {Object.entries(display).map(([label, value]) => (
          <div key={label}>
            <div className="text-gray-500 dark:text-gray-300 text-sm capitalize">
              {label}
            </div>
            <div>{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
