import React, { useEffect, useState } from "react";

// Controlled edit form for profile; emits {fullName, age, weight, healthHistory}
export default function ProfileForm({ initial, onCancel, onSave }) {
  const [values, setValues] = useState({
    fullName: "",
    age: "",
    weight: "",
    healthHistory: "",
  });

  // Prefill with current profile; join array history into comma-separated string for quick editing
  useEffect(() => {
    setValues({
      fullName: initial?.fullName || "",
      age: initial?.age ?? "",
      weight: initial?.weight ?? "",
      healthHistory: (initial?.healthHistory || []).join(", "),
    });
  }, [initial]);

  const change = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      fullName: values.fullName.trim(),
      age: values.age === "" ? undefined : Number(values.age),
      weight: values.weight === "" ? undefined : Number(values.weight),
      // split on commas into trimmed tags; drop empties
      healthHistory: values.healthHistory
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSave?.(payload);
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded w-[95%] max-w-lg space-y-3">
      <h3 className="font-medium text-lg">Edit Profile</h3>

      <label className="block">
        <span className="text-sm text-gray-600">Full Name</span>
        <input
          className="mt-1 w-full border rounded p-2"
          value={values.fullName}
          onChange={change("fullName")}
          placeholder="Jane Doe"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-gray-600">Age</span>
          <input
            type="number"
            min="0"
            className="mt-1 w-full border rounded p-2"
            value={values.age}
            onChange={change("age")}
            placeholder="22"
          />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Weight (lb)</span>
          <input
            type="number"
            min="0"
            className="mt-1 w-full border rounded p-2"
            value={values.weight}
            onChange={change("weight")}
            placeholder="145"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-gray-600">Health History (comma-separated)</span>
        <input
          className="mt-1 w-full border rounded p-2"
          value={values.healthHistory}
          onChange={change("healthHistory")}
          placeholder="Seasonal allergies, Athletic clearance"
        />
      </label>

      <div className="flex gap-2 justify-end">
        <button type="button" className="px-3 py-1 rounded border" onClick={onCancel}>
          Cancel
        </button>
        <button className="px-3 py-1 rounded bg-emerald-600 text-white">Save Changes</button>
      </div>
    </form>
  );
}
