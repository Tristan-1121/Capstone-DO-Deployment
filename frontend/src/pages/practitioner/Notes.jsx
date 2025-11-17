// frontend/src/pages/practitioner/Notes.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNote, saveNote } from "../../api/notes";
import { useAuth } from "../../context/AuthContext";

export default function NotesPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [note, setNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    callback: {
      reason: "",
      dueDate: "",
      priority: "medium",
    },
  });

  // Load the note when page opens
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getNote(appointmentId);

        if (data) {
          setNote({
            subjective: data.subjective || "",
            objective: data.objective || "",
            assessment: data.assessment || "",
            plan: data.plan || "",
            callback: {
              reason: data.callback?.reason || "",
              dueDate: data.callback?.dueDate || "",
              priority: data.callback?.priority || "medium",
            },
          });
        }
      } catch (err) {
        console.error("Error loading note:", err);
        setError("Failed to load note.");
      } finally {
        setLoading(false);
      }
    })();
  }, [appointmentId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        appointmentId,
        practitionerId: user.id,
        patientId: note.patientId || undefined, // backend ignores if not used
        ...note,
      };

      await saveNote(payload);
      alert("Notes saved!");
    } catch (err) {
      console.error(err);
      setError("Failed to save notes.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setNote((prev) => ({ ...prev, [field]: value }));
  };

  const updateCallback = (field, value) => {
    setNote((prev) => ({
      ...prev,
      callback: { ...prev.callback, [field]: value },
    }));
  };

  if (loading) return <p className="text-gray-600">Loading note…</p>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Appointment Notes
        </h1>
        <p className="text-gray-600 text-sm">
          Document your appointment using a SOAP-style format.
        </p>
      </header>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* SOAP Fields */}
      <div className="space-y-4 bg-white p-5 rounded-lg border shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Subjective</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]"
            value={note.subjective}
            onChange={(e) => updateField("subjective", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Objective</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]"
            value={note.objective}
            onChange={(e) => updateField("objective", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assessment</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]"
            value={note.assessment}
            onChange={(e) => updateField("assessment", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]"
            value={note.plan}
            onChange={(e) => updateField("plan", e.target.value)}
          />
        </div>
      </div>

      {/* Callback Section */}
      <div className="space-y-4 bg-white p-5 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold">Callback Request (Optional)</h2>

        <div>
          <label className="block text-sm mb-1">Reason</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={note.callback.reason}
            onChange={(e) => updateCallback("reason", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={note.callback.dueDate}
            onChange={(e) => updateCallback("dueDate", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={note.callback.priority}
            onChange={(e) => updateCallback("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
        >
          {saving ? "Saving…" : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

