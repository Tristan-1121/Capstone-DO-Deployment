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
        setPatients(data);
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

  if (loading) return <p className="text-gray-500">Loading patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">All Patients</h1>

      {!patients.length && (
        <p className="text-gray-500 text-sm">
          You have no patients assigned yet.
        </p>
      )}

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-4 py-2">
                  {(p.firstName || p.lastName)
                    ? `${p.firstName || ""} ${p.lastName || ""}`.trim()
                    : "Unknown"}
                </td>
                <td className="px-4 py-2">{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

