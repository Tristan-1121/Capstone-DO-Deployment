// Updated: removed alert() and added a toast-based notification system

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNote, saveNote } from "../../api/notes";
import { useAuth } from "../../context/AuthContext";

// Toast component to display success or error messages
// Provides a cleaner UX compared to alert()
function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded shadow text-white ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">
          ×
        </button>
      </div>
    </div>
  );
}

export default function NotesPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();

  // Toast for showing notifications
  const [toast, setToast] = useState(null);

  // Basic state for loading, saving, and capturing errors
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Note structure: SOAP format + optional callback info
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

  // Load note when component mounts
  useEffect(() => {
    const loadNote = async () => {
      try {
        const data = await getNote(appointmentId);

        // Populate form with existing data if found
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
      } catch {
        setError("Failed to load note.");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [appointmentId]);

  // Save updated note back to backend
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        appointmentId,
        practitionerId: user.id,
        ...note,
      };

      await saveNote(payload);

      // Show toast instead of using alert()
      setToast({ message: "Notes saved.", type: "success" });
    } catch {
      setError("Failed to save notes.");

      // Show failure toast
      setToast({ message: "Save failed.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Update simple fields
  const updateField = (field, value) => {
    setNote((prev) => ({ ...prev, [field]: value }));
  };

  // Update callback nested fields
  const updateCallback = (field, value) => {
    setNote((prev) => ({
      ...prev,
      callback: { ...prev.callback, [field]: value },
    }));
  };

  if (loading) return <p className="text-gray-600">Loading note…</p>;

  return (
    <div className="space-y-6">

      {/* Toast message rendering */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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

      {/* Save button */}
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
