import React from "react";

export default function PrescriptionsForm({ value = [], onChange }) {
  // Always ensure `value` is an array
  const prescriptions = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    const newPrescriptions = [
      ...prescriptions,
      { medicationName: "", dosage: "", frequency: "" },
    ];
    onChange(newPrescriptions);
  };

  const handleChange = (index, field, newValue) => {
    const updated = prescriptions.map((p, i) =>
      i === index ? { ...p, [field]: newValue } : p
    );
    onChange(updated);
  };

  const handleRemove = (index) => {
    const updated = prescriptions.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <section>
      <h2 className="font-semibold text-lg mb-2">Prescriptions</h2>

      {prescriptions.length === 0 && (
        <p className="text-sm text-gray-500 mb-2">
          No prescriptions listed. Add one below.
        </p>
      )}

      {prescriptions.map((p, index) => (
        <div
          key={index}
          className="border p-3 mb-3 rounded grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          <input
            className="border rounded p-2"
            placeholder="Medication Name"
            value={p.medicationName || ""}
            onChange={(e) =>
              handleChange(index, "medicationName", e.target.value)
            }
          />
          <input
            className="border rounded p-2"
            placeholder="Dosage"
            value={p.dosage || ""}
            onChange={(e) => handleChange(index, "dosage", e.target.value)}
          />
          <input
            className="border rounded p-2"
            placeholder="Frequency"
            value={p.frequency || ""}
            onChange={(e) => handleChange(index, "frequency", e.target.value)}
          />

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
        + Add Prescription
      </button>
    </section>
  );
}

