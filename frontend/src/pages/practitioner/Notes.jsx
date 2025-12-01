import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNote, saveNote } from "../../api/notes";
import { useAuth } from "../../context/AuthContext";

// --- Toast component ---
function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded shadow 
        text-white z-50
        ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
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

  const [toast, setToast] = useState(null);
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

  // Load existing note (if any)
  useEffect(() => {
    const load = async () => {
      try {
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
      } catch {
        setError("Failed to load note.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appointmentId]);

  // Save handler
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

      setToast({ message: "Notes saved.", type: "success" });
    } catch {
      setToast({ message: "Save failed.", type: "error" });
      setError("Failed to save notes.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) =>
    setNote((prev) => ({ ...prev, [field]: value }));

  const updateCallback = (field, value) =>
    setNote((prev) => ({
      ...prev,
      callback: { ...prev.callback, [field]: value },
    }));

  if (loading)
    return <p className="text-gray-600 dark:text-gray-300">Loading note…</p>;

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header>
        <h1 className="text-2xl font-semibold">Appointment Notes</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          SOAP-style documentation + optional callback request.
        </p>
      </header>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {/* SOAP SECTION */}
      <div
        className="space-y-4 p-5 rounded-lg shadow-sm border 
                   bg-white dark:bg-gray-800 
                   border-gray-200 dark:border-gray-700"
      >
        {/* Subjective */}
        <div>
          <label className="block text-sm font-medium mb-1">Subjective</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.subjective}
            onChange={(e) => updateField("subjective", e.target.value)}
          />
        </div>

        {/* Objective */}
        <div>
          <label className="block text-sm font-medium mb-1">Objective</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.objective}
            onChange={(e) => updateField("objective", e.target.value)}
          />
        </div>

        {/* Assessment */}
        <div>
          <label className="block text-sm font-medium mb-1">Assessment</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.assessment}
            onChange={(e) => updateField("assessment", e.target.value)}
          />
        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[90px]
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.plan}
            onChange={(e) => updateField("plan", e.target.value)}
          />
        </div>
      </div>

      {/* CALLBACK SECTION */}
      <div
        className="space-y-4 p-5 rounded-lg shadow-sm border
                   bg-white dark:bg-gray-800
                   border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold">Callback Request (Optional)</h2>

        {/* Callback Reason */}
        <div>
          <label className="block text-sm mb-1">Reason</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.callback.reason}
            onChange={(e) => updateCallback("reason", e.target.value)}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.callback.dueDate}
            onChange={(e) => updateCallback("dueDate", e.target.value)}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select
            className="w-full border rounded px-3 py-2
                       bg-white dark:bg-gray-900
                       border-gray-300 dark:border-gray-700
                       text-gray-900 dark:text-gray-100"
            value={note.callback.priority}
            onChange={(e) => updateCallback("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded text-white
                     bg-emerald-600 hover:bg-emerald-700
                     disabled:bg-emerald-300"
        >
          {saving ? "Saving…" : "Save Notes"}
        </button>
      </div>
    </div>
  );
}
