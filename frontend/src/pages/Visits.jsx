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

  if (loading) return <p>Loading visits...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your Visits</h1>

      {notes.length === 0 ? (
        <p>No visit notes yet.</p>
      ) : (
        notes.map((n) => (
          <div
            key={n._id}
            className="border bg-white rounded-lg p-4 shadow-sm"
          >
            <h2 className="font-medium text-lg">
              Visit on {new Date(n.createdAt).toLocaleDateString()}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
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
              <div className="mt-3 p-2 border rounded bg-yellow-50">
                <p className="font-medium">Callback Requested</p>
                <p>Reason: {n.callback.reason}</p>
                <p>Priority: {n.callback.priority}</p>
                <p>Due: {n.callback.dueDate}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
