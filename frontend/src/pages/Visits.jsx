import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotesForPatient } from "../api/notes";

export default function Visits() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotesForPatient(user.id);
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user.id]);

  if (loading)
    return <p className="text-gray-600 dark:text-gray-300">Loading visits...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Your Visits</h1>

      {notes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No visit notes yet.</p>
      ) : (
        notes.map((n) => (
          <div
            key={n._id}
            className="border bg-white dark:bg-gray-800 
                       dark:border-gray-700 dark:text-gray-100
                       rounded-lg p-4 shadow-sm"
          >
            <h2 className="font-medium text-lg">
              Visit on {new Date(n.createdAt).toLocaleDateString()}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Practitioner: {n.practitionerId?.firstName}{" "}
              {n.practitionerId?.lastName}
            </p>

            <div className="mt-2 space-y-1 text-sm">
              <p><strong>Subjective:</strong> {n.subjective}</p>
              <p><strong>Objective:</strong> {n.objective}</p>
              <p><strong>Assessment:</strong> {n.assessment}</p>
              <p><strong>Plan:</strong> {n.plan}</p>
            </div>

            {n.callback?.reason && (
              <div
                className="mt-3 p-3 border rounded 
                           bg-yellow-50 dark:bg-yellow-900/30 
                           dark:border-yellow-800"
              >
                <p className="font-medium dark:text-yellow-300">
                  Callback Requested
                </p>
                <p><strong>Reason:</strong> {n.callback.reason}</p>
                <p><strong>Priority:</strong> {n.callback.priority}</p>
                <p><strong>Due:</strong> {n.callback.dueDate}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
