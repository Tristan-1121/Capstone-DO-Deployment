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

  async function load(status) {
    try {
      setLoading(true);
      setError("");
      const data = await getMyCallbacks(status);
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
    load(statusFilter);
  }, [statusFilter]);

  async function handleStatusChange(id, newStatus) {
    try {
      setUpdatingId(id);
      await updateCallbackStatus(id, newStatus);
      await load(statusFilter);
    } catch {
      alert("Failed to update callback status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this callback?")) return;

    try {
      setDeletingId(id);
      await deleteCallback(id);
      setCallbacks((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete callback.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Callback List</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Manage your patient callbacks by status and priority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Status:
          </label>

          <select
            className="border rounded px-2 py-1 text-sm 
                       bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-600 
                       text-gray-800 dark:text-gray-200"
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
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading callbacks…</p>
      ) : callbacks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No callbacks found.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 
                        rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {["Patient", "Reason", "Priority", "Status", "Created", "Actions"].map(
                  (title) => (
                    <th
                      key={title}
                      className="px-4 py-2 text-left font-medium 
                                 text-gray-700 dark:text-gray-200"
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {callbacks.map((cb) => (
                <tr key={cb._id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2">
                    <div className="font-medium">
                      {cb.patient?.fullName ||
                        cb.patient?.Name ||
                        "Unknown patient"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cb.patient?.email}
                    </div>
                  </td>

                  <td className="px-4 py-2 max-w-xs">
                    <div className="line-clamp-2 text-gray-700 dark:text-gray-300">
                      {cb.reason}
                    </div>
                  </td>

                  <td className="px-4 py-2 capitalize">
                    {cb.priority}
                  </td>

                  <td className="px-4 py-2 space-y-1">
                    <span
                      className="inline-flex items-center rounded-full 
                                 bg-gray-100 dark:bg-gray-700
                                 px-2 py-0.5 text-xs font-medium 
                                 text-gray-700 dark:text-gray-300"
                    >
                      {statusLabels[cb.status] || cb.status}
                    </span>

                    <select
                      className="border rounded px-2 py-1 text-xs 
                                 bg-white dark:bg-gray-800 
                                 border-gray-300 dark:border-gray-600
                                 text-gray-700 dark:text-gray-200"
                      disabled={updatingId === cb._id}
                      value={cb.status}
                      onChange={(e) =>
                        handleStatusChange(cb._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>

                  <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    {cb.createdAt
                      ? new Date(cb.createdAt).toLocaleString()
                      : ""}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(cb._id)}
                      disabled={deletingId === cb._id}
                      className="px-3 py-1 text-xs rounded border 
                                 border-red-500 text-red-600 
                                 dark:border-red-400 dark:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-900/20 
                                 disabled:opacity-60"
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
