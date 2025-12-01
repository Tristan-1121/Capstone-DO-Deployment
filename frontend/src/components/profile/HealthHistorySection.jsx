import React from "react";

export default function HealthHistorySection({ profile = {} }) {
  const healthHistory = profile.healthHistory || [];

  return (
    <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-3">Health History</h3>

      {Array.isArray(healthHistory) && healthHistory.length ? (
        <div className="flex flex-wrap gap-2">
          {healthHistory.map((item, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-500 dark:text-gray-300">No history on file.</span>
      )}
    </section>
  );
}
