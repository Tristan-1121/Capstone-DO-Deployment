import { useEffect, useState } from "react";
import { getMyPatients } from "../../api/practitioners";

export default function PractitionerPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyPatients();
        setPatients(data || []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err.message ||
          "Failed to load patients.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <p className="text-gray-600 dark:text-gray-300">Loading patients...</p>;

  if (error)
    return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-semibold">All Patients</h1>

      {!patients.length && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          You have no patients assigned yet.
        </p>
      )}

      {patients.length > 0 && (
        <div className="bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700 
                        rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/40">
              <tr>
                <th className="px-4 py-2 text-left font-medium 
                               text-gray-700 dark:text-gray-200">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium 
                               text-gray-700 dark:text-gray-200">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => {
                const name =
                  p.fullName ||
                  (p.firstName || p.lastName
                    ? `${p.firstName || ""} ${p.lastName || ""}`.trim()
                    : "Unknown");

                return (
                  <tr
                    key={p._id}
                    className="border-t border-gray-200 dark:border-gray-700 
                               hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="px-4 py-2">{name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {p.email}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
