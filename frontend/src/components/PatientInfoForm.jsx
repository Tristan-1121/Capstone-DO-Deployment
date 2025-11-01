import { useState } from "react";

export default function PatientInfoForm() {
  const [formData, setFormData] = useState({
    Email: "",
    Name: "",
    Age: "",
    Weight: "",
    Height: "",
    Sex: "",
    // Default embedded arrays
    MedHist: [{ conditions: [], surgeries: [], familyHistory: "", notes: "" }],
    Prescriptions: [],
    Allergies: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ensure arrays exist, not strings
    const cleaned = {
      ...formData,
      Prescriptions: formData.Prescriptions.length ? formData.Prescriptions : [],
      Allergies: formData.Allergies.length ? formData.Allergies : [],
      MedHist: formData.MedHist.length
        ? formData.MedHist
        : [{ conditions: [], surgeries: [], familyHistory: "", notes: "" }],
    };

    try {
      const res = await fetch("http://localhost:5000/api/patient/me/Patient", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleaned),
      });

      if (!res.ok) throw new Error("Failed to update patient info");

      const data = await res.json();
      console.log("✅ Saved patient:", data);
      alert("Patient info saved successfully!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Patient Information</h2>

        <input
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          name="Age"
          type="number"
          value={formData.Age}
          onChange={handleChange}
          placeholder="Age"
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          name="Weight"
          type="number"
          value={formData.Weight}
          onChange={handleChange}
          placeholder="Weight (lbs)"
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          name="Height"
          type="number"
          value={formData.Height}
          onChange={handleChange}
          placeholder="Height (in)"
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <select
          name="Sex"
          value={formData.Sex}
          onChange={handleChange}
          className="border p-2 mb-3 w-full rounded"
          required
        >
          <option value="">Select Sex</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* Simple free-text field for notes */}
        <textarea
          placeholder="Medical Notes (optional)"
          value={formData.MedHist[0].notes}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              MedHist: [
                {
                  ...prev.MedHist[0],
                  notes: e.target.value,
                },
              ],
            }))
          }
          className="border p-2 mb-4 w-full rounded h-24"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Save Info
        </button>
      </form>
    </div>
  );
}




