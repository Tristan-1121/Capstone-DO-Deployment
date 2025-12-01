import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Toast used for success/error notifications */
function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded shadow text-white z-50 ${
        type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">×</button>
      </div>
    </div>
  );
}

export default function PatientInfo() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    Name: "",
    Age: "",
    Weight: "",
    HeightFeet: "",
    HeightInches: "",
    Sex: "",
    Phone: "",
    Address: "",
    City: "",
    State: "",
    Zip: "",
    EmergencyContact: "",
    Allergies: [],
    Prescriptions: [],
  });

  /* Helpers */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayItem = (field, item) =>
    setForm({ ...form, [field]: [...form[field], item] });

  const removeArrayItem = (field, index) =>
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });

  /* Load data */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/patients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();
        const data = await res.json();

        setForm({
          Name: data.Name || "",
          Age: data.Age || "",
          Weight: data.Weight || "",
          HeightFeet: data.HeightFeet || "",
          HeightInches: data.HeightInches || "",
          Sex: data.Sex || "",
          Phone: data.Phone || "",
          Address: data.Address || "",
          City: data.City || "",
          State: data.State || "",
          Zip: data.Zip || "",
          EmergencyContact: data.EmergencyContact || "",
          Allergies: Array.isArray(data.Allergies) ? data.Allergies : [],
          Prescriptions: Array.isArray(data.Prescriptions)
            ? data.Prescriptions
            : [],
        });
      } catch {
        setToast({ message: "Failed to load patient info.", type: "error" });
      }
    };
    load();
  }, []);

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/patients/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      await res.json();

      setToast({ message: "Patient information saved.", type: "success" });
    } catch {
      setToast({ message: "Failed to save information.", type: "error" });
    }
  };

  return (
    <div className="card max-w-4xl mx-auto p-8 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-2xl font-bold">Update Patient Information</h2>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* BASIC INFO */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Full Name</span>
              <input
                value={form.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                className="mt-1 w-full p-2"
                placeholder="Tristan Cameron"
              />
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Age</span>
              <input
                type="number"
                min="0"
                value={form.Age}
                onChange={(e) => handleChange("Age", e.target.value)}
                className="mt-1 w-full p-2"
                placeholder="25"
              />
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Weight (lbs)</span>
              <input
                type="number"
                value={form.Weight}
                onChange={(e) => handleChange("Weight", e.target.value)}
                className="mt-1 w-full p-2"
                placeholder="180"
              />
            </label>

            <div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Height</span>
              <div className="flex gap-2 mt-1">
                <select
                  value={form.HeightFeet}
                  onChange={(e) => handleChange("HeightFeet", e.target.value)}
                  className="p-2 w-1/2"
                >
                  <option value="">Feet</option>
                  {[4, 5, 6, 7].map((ft) => (
                    <option key={ft}>{ft}</option>
                  ))}
                </select>

                <select
                  value={form.HeightInches}
                  onChange={(e) => handleChange("HeightInches", e.target.value)}
                  className="p-2 w-1/2"
                >
                  <option value="">Inches</option>
                  {[...Array(12).keys()].map((inch) => (
                    <option key={inch} value={inch}>
                      {inch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Sex</span>
              <select
                value={form.Sex}
                onChange={(e) => handleChange("Sex", e.target.value)}
                className="mt-1 w-full p-2"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>
        </section>

        {/* CONTACT INFO */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Phone</span>
              <input
                value={form.Phone}
                onChange={(e) => handleChange("Phone", e.target.value)}
                className="mt-1 w-full p-2"
              />
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Address</span>
              <input
                value={form.Address}
                onChange={(e) => handleChange("Address", e.target.value)}
                className="mt-1 w-full p-2"
              />
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">City</span>
              <input
                value={form.City}
                onChange={(e) => handleChange("City", e.target.value)}
                className="mt-1 w-full p-2"
              />
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">State</span>
              <select
                value={form.State}
                onChange={(e) => handleChange("State", e.target.value)}
                className="mt-1 w-full p-2"
              >
                <option value="">Select State</option>
                {/* States list */}
                {[
                  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
                  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
                  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
                ].map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">ZIP</span>
              <input
                value={form.Zip}
                onChange={(e) => handleChange("Zip", e.target.value)}
                className="mt-1 w-full p-2"
                placeholder="32514"
              />
            </label>

            <label>
              <span className="text-sm text-gray-600 dark:text-gray-300">Emergency Contact</span>
              <input
                value={form.EmergencyContact}
                onChange={(e) => handleChange("EmergencyContact", e.target.value)}
                className="mt-1 w-full p-2"
              />
            </label>
          </div>
        </section>

        {/* ALLERGIES */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Allergies</h3>

          {form.Allergies.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No allergies added.</p>
          ) : (
            form.Allergies.map((a, idx) => (
              <div key={idx} className="border dark:border-gray-700 p-4 rounded space-y-2">
                <label>
                  <span className="text-sm">Allergen</span>
                  <input
                    value={a.allergen}
                    onChange={(e) =>
                      handleArrayChange("Allergies", idx, "allergen", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  />
                </label>

                <label>
                  <span className="text-sm">Severity</span>
                  <select
                    value={a.severity}
                    onChange={(e) =>
                      handleArrayChange("Allergies", idx, "severity", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  >
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </label>

                <label>
                  <span className="text-sm">Reaction / Notes</span>
                  <input
                    value={a.reaction}
                    onChange={(e) =>
                      handleArrayChange("Allergies", idx, "reaction", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  />
                </label>

                <button
                  type="button"
                  className="text-red-600 dark:text-red-400 text-sm"
                  onClick={() => removeArrayItem("Allergies", idx)}
                >
                  🗑 Remove
                </button>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() =>
              addArrayItem("Allergies", {
                allergen: "",
                severity: "",
                reaction: "",
              })
            }
            className="text-blue-600 dark:text-blue-400"
          >
            + Add Another Allergy
          </button>
        </section>

        {/* PRESCRIPTIONS */}
        <section>
          <h3 className="text-xl font-semibold mb-3">Prescriptions</h3>

          {form.Prescriptions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No prescriptions added.</p>
          ) : (
            form.Prescriptions.map((p, idx) => (
              <div key={idx} className="border dark:border-gray-700 p-4 rounded space-y-2">

                <label>
                  <span className="text-sm">Medication Name</span>
                  <input
                    value={p.medicationName}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", idx, "medicationName", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  />
                </label>

                <label>
                  <span className="text-sm">Dosage</span>
                  <input
                    value={p.dosage}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", idx, "dosage", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  />
                </label>

                <label>
                  <span className="text-sm">Frequency</span>
                  <input
                    value={p.frequency}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", idx, "frequency", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  />
                </label>

                <label>
                  <span className="text-sm">Notes</span>
                  <input
                    value={p.notes}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", idx, "notes", e.target.value)
                    }
                    className="mt-1 w-full p-2"
                  />
                </label>

                <button
                  type="button"
                  className="text-red-600 dark:text-red-400 text-sm"
                  onClick={() => removeArrayItem("Prescriptions", idx)}
                >
                  🗑 Remove
                </button>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() =>
              addArrayItem("Prescriptions", {
                medicationName: "",
                dosage: "",
                frequency: "",
                notes: "",
              })
            }
            className="text-blue-600 dark:text-blue-400"
          >
            + Add Another Prescription
          </button>
        </section>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Info
          </button>
        </div>
      </form>
    </div>
  );
}
