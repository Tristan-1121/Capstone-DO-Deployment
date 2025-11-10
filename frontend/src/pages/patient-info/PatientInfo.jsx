// src/pages/patient-info/PatientInfo.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientInfo() {
  const navigate = useNavigate();
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

  // Utility to handle simple field updates
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Utility for arrays (Allergies, Prescriptions)
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };

  const addArrayItem = (field, newItem) => {
    setForm({ ...form, [field]: [...form[field], newItem] });
  };

  const removeArrayItem = (field, index) => {
    setForm({
      ...form,
      [field]: form[field].filter((_, i) => i !== index),
    });
  };

  // Load existing patient data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/patients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch patient data");
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
      } catch (err) {
        console.error("❌ Error fetching patient data:", err);
      }
    };
    fetchData();
  }, []);

  // Save form to backend
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

      if (!res.ok) throw new Error("Failed to update patient info");

      await res.json();
      alert("✅ Patient info saved!");
      window.location.reload(); // auto refresh
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("❌ Failed to save info. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update Patient Information</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC INFO */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-600">Full Name</span>
              <input
                type="text"
                value={form.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="Tristan Cameron"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Age</span>
              <input
                type="number"
                min="0"
                value={form.Age}
                onChange={(e) => handleChange("Age", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="25"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Weight (lbs)</span>
              <input
                type="number"
                min="0"
                max="999"
                value={form.Weight}
                onChange={(e) => handleChange("Weight", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="180"
              />
            </label>

            <div>
              <span className="text-sm text-gray-600">Height</span>
              <div className="flex gap-2 mt-1">
                <select
                  value={form.HeightFeet || ""}
                  onChange={(e) => handleChange("HeightFeet", e.target.value)}
                  className="border rounded p-2 w-1/2"
                >
                  <option value="">Feet</option>
                  {[4, 5, 6, 7].map((ft) => (
                    <option key={ft} value={ft}>
                      {ft}
                    </option>
                  ))}
                </select>
                <select
                  value={form.HeightInches || ""}
                  onChange={(e) => handleChange("HeightInches", e.target.value)}
                  className="border rounded p-2 w-1/2"
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

            <label className="block">
              <span className="text-sm text-gray-600">Sex</span>
              <select
                value={form.Sex}
                onChange={(e) => handleChange("Sex", e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
        </section>

        {/* CONTACT INFO */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-600">Phone</span>
              <input
                type="tel"
                value={form.Phone}
                onChange={(e) => handleChange("Phone", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="8509999999"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Address</span>
              <input
                type="text"
                value={form.Address}
                onChange={(e) => handleChange("Address", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="123 Main St"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">City</span>
              <input
                type="text"
                value={form.City}
                onChange={(e) => handleChange("City", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="Pensacola"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">State</span>
              <select
                value={form.State}
                onChange={(e) => handleChange("State", e.target.value)}
                className="mt-1 w-full border rounded p-2"
              >
                <option value="">Select State</option>
                {[
                  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
                  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
                  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">ZIP Code</span>
              <input
                type="text"
                value={form.Zip}
                onChange={(e) => handleChange("Zip", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="32514"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Emergency Contact</span>
              <input
                type="text"
                value={form.EmergencyContact}
                onChange={(e) => handleChange("EmergencyContact", e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="John Doe"
              />
            </label>
          </div>
        </section>

        {/* ALLERGIES */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Allergies</h3>
          {form.Allergies.length === 0 ? (
            <p className="text-gray-500 mb-2">No allergies added.</p>
          ) : (
            form.Allergies.map((a, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <label className="block">
                  <span className="text-sm text-gray-600">Allergen</span>
                  <input
                    value={a.allergen}
                    onChange={(e) =>
                      handleArrayChange("Allergies", i, "allergen", e.target.value)
                    }
                    placeholder="Peanuts"
                    className="mt-1 w-full border rounded p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Severity</span>
                  <select
                    value={a.severity}
                    onChange={(e) =>
                      handleArrayChange("Allergies", i, "severity", e.target.value)
                    }
                    className="mt-1 w-full border rounded p-2"
                  >
                    <option value="">Select Severity</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm text-gray-600">Reaction / Notes</span>
                  <input
                    value={a.reaction || ""}
                    onChange={(e) =>
                      handleArrayChange("Allergies", i, "reaction", e.target.value)
                    }
                    placeholder="Sneezing, itching..."
                    className="mt-1 w-full border rounded p-2"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeArrayItem("Allergies", i)}
                  className="text-red-600 text-sm hover:underline"
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
            className="text-blue-600 hover:underline"
          >
            + Add Another Allergy
          </button>
        </section>

        {/* PRESCRIPTIONS */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
          {form.Prescriptions.length === 0 ? (
            <p className="text-gray-500 mb-2">No prescriptions added.</p>
          ) : (
            form.Prescriptions.map((p, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <label className="block">
                  <span className="text-sm text-gray-600">Medication Name</span>
                  <input
                    value={p.medicationName}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", i, "medicationName", e.target.value)
                    }
                    placeholder="Ibuprofen"
                    className="mt-1 w-full border rounded p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Dosage</span>
                  <input
                    value={p.dosage}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", i, "dosage", e.target.value)
                    }
                    placeholder="200mg"
                    className="mt-1 w-full border rounded p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Frequency</span>
                  <input
                    value={p.frequency}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", i, "frequency", e.target.value)
                    }
                    placeholder="Twice daily"
                    className="mt-1 w-full border rounded p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Notes</span>
                  <input
                    value={p.notes}
                    onChange={(e) =>
                      handleArrayChange("Prescriptions", i, "notes", e.target.value)
                    }
                    placeholder="After meals"
                    className="mt-1 w-full border rounded p-2"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeArrayItem("Prescriptions", i)}
                  className="text-red-600 text-sm hover:underline"
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
            className="text-blue-600 hover:underline"
          >
            + Add Another Prescription
          </button>
        </section>

        <div className="pt-4">
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





