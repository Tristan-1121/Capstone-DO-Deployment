import React from "react";

export default function AllergiesForm({ value = [], onChange }) {
  // Always ensure `value` is an array
  const allergies = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    const newAllergies = [
      ...allergies,
      { allergen: "", reaction: "", severity: "Mild" },
    ];
    onChange(newAllergies);
  };

  const handleChange = (index, field, newValue) => {
    const updated = allergies.map((a, i) =>
      i === index ? { ...a, [field]: newValue } : a
    );
    onChange(updated);
  };

  const handleRemove = (index) => {
    const updated = allergies.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <section>
      <h2 className="font-semibold text-lg mb-2">Allergies</h2>

      {allergies.length === 0 && (
        <p className="text-sm text-gray-500 mb-2">
          No allergies listed. Add one below.
        </p>
      )}

      {allergies.map((allergy, index) => (
        <div
          key={index}
          className="border p-3 mb-3 rounded grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          <input
            className="border rounded p-2"
            placeholder="Allergen"
            value={allergy.allergen || ""}
            onChange={(e) =>
              handleChange(index, "allergen", e.target.value)
            }
          />
          <input
            className="border rounded p-2"
            placeholder="Reaction"
            value={allergy.reaction || ""}
            onChange={(e) =>
              handleChange(index, "reaction", e.target.value)
            }
          />
          <select
            className="border rounded p-2"
            value={allergy.severity || "Mild"}
            onChange={(e) =>
              handleChange(index, "severity", e.target.value)
            }
          >
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>

          <div className="col-span-full flex justify-end">
            <button
              type="button"
              className="text-red-600 text-sm"
              onClick={() => handleRemove(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        onClick={handleAdd}
      >
        + Add Allergy
      </button>
    </section>
  );
}

