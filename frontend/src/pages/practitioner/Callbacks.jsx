// frontend/src/pages/practitioner/Callbacks.jsx
import { useEffect, useState } from "react";
import {
  getMyCallbacks,
  updateCallbackStatus,
  deleteCallback,
} from "../../api/callbacks";

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
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function loadCallbacks(currentStatus) {
    try {
      setLoading(true);
      setError("");
      const data = await getMyCallbacks(currentStatus);
      setCallbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Error loading callbacks";
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
      setUpdatingId(id);
      await updateCallbackStatus(id, newStatus);
      await loadCallbacks(statusFilter);
    } catch (err) {
      console.error("Error updating callback:", err);
      alert("Failed to update callback status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this callback?")) {
      return;
    }
    try {
      setDeletingId(id);
      await deleteCallback(id);
      setCallbacks((prev) => prev.filter((cb) => cb._id !== id));
    } catch (err) {
      console.error("Error deleting callback:", err);
      alert("Failed to delete callback.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Callback List
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your patient callbacks by status and priority.
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
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Patient
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Reason
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Priority
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Created
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {callbacks.map((cb) => (
                <tr key={cb._id} className="border-t border-gray-100">
                  <td className="px-4 py-2">
                    <div className="font-medium">
                      {cb.patient?.Name ||
                        cb.patient?.fullName ||
                        "Unknown patient"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cb.patient?.Email || cb.patient?.email || ""}
                    </div>
                  </td>
                  <td className="px-4 py-2 max-w-xs">
                    <div className="line-clamp-2">{cb.reason}</div>
                  </td>
                  <td className="px-4 py-2 capitalize">{cb.priority}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 mr-2">
                      {statusLabels[cb.status] || cb.status}
                    </span>
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={cb.status}
                      disabled={updatingId === cb._id}
                      onChange={(e) =>
                        handleStatusChange(cb._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {cb.createdAt
                      ? new Date(cb.createdAt).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(cb._id)}
                      disabled={deletingId === cb._id}
                      className="px-3 py-1 text-xs rounded border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === cb._id ? "Deleting…" : "Delete"}
                    </button>
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


