// frontend/src/pages/practitioner/Callbacks.jsx
import { useEffect, useState } from "react";
import { getCallbacks, updateCallback } from "../../api/callbacks";

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export default function PractitionerCallbacks() {
  const [callbacks, setCallbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCallbacks(selectedStatus) {
    try {
      setLoading(true);
      setError("");
      const data = await getCallbacks(selectedStatus === "all" ? undefined : selectedStatus);
      setCallbacks(data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Error loading callbacks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCallbacks(statusFilter);
  }, [statusFilter]);

  async function handleStatusChange(id, newStatus) {
    try {
      await updateCallback(id, { status: newStatus });
      await loadCallbacks(statusFilter);
    } catch (err) {
      console.error("Error updating callback:", err);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Callback List</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage patient callbacks by priority and status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Status:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="all">All</option>
          </select>
        </div>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-500">Loading callbacks…</p>
      ) : callbacks.length === 0 ? (
        <p className="text-sm text-gray-500">No callbacks found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Patient</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Reason</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Priority</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Created</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {callbacks.map((cb) => (
                <tr key={cb._id} className="border-t border-gray-100">
                  <td className="px-4 py-2">
                    <div className="font-medium">
                      {cb.patient?.fullName || "Unknown patient"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cb.patient?.email || ""}
                    </div>
                  </td>
                  <td className="px-4 py-2">{cb.reason}</td>
                  <td className="px-4 py-2 capitalize">{cb.priority}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {statusLabels[cb.status] || cb.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {cb.createdAt ? new Date(cb.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={cb.status}
                      onChange={(e) => handleStatusChange(cb._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
