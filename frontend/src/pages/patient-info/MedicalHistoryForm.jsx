import React from "react";

export default function MedicalHistoryForm({ value = [], onChange }) {
  // Always ensure there's at least one medical history entry
  const history = value.length
    ? value[0]
    : { conditions: [], surgeries: [], familyHistory: "", notes: "" };

  const handleChange = (field, val) => {
    const updated = [{ ...history, [field]: val }];
    onChange(updated);
  };

  return (
    <section>
      <h2 className="font-semibold text-lg mb-2">Medical History</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>
          <span className="text-sm text-gray-600">Conditions (comma-separated)</span>
          <input
            className="mt-1 w-full border rounded p-2"
            value={history.conditions?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "conditions",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </label>

        <label>
          <span className="text-sm text-gray-600">Surgeries (comma-separated)</span>
          <input
            className="mt-1 w-full border rounded p-2"
            value={history.surgeries?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "surgeries",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </label>
      </div>

      <label className="block mt-4">
        <span className="text-sm text-gray-600">Family History</span>
        <textarea
          className="mt-1 w-full border rounded p-2"
          value={history.familyHistory || ""}
          onChange={(e) => handleChange("familyHistory", e.target.value)}
        />
      </label>

      <label className="block mt-4">
        <span className="text-sm text-gray-600">Notes</span>
        <textarea
          className="mt-1 w-full border rounded p-2"
          value={history.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </label>
    </section>
  );
}

