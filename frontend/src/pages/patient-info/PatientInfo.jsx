import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MedicalHistoryForm from "./MedicalHistoryForm";
import AllergiesForm from "./AllergiesForm";
import PrescriptionsForm from "./PrescriptionsForm";

export default function PatientInfo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    MedHist: [{ conditions: [], surgeries: [], familyHistory: "", notes: "" }],
    Allergies: [],
    Prescriptions: [],
  });

  const [loading, setLoading] = useState(true);

  // Load existing patient data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchPatient = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/patients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch patient info");
        const data = await res.json();

        setForm({
          fullName: data.fullName || "",
          age: data.age || "",
          weight: data.weight || "",
          height: data.height || "",
          sex: data.sex || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip: data.zip || "",
          MedHist: data.MedHist?.length
            ? data.MedHist
            : [{ conditions: [], surgeries: [], familyHistory: "", notes: "" }],
          Allergies: data.Allergies || [],
          Prescriptions: data.Prescriptions || [],
        });
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/patients/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update patient info");

      alert("✅ Patient info saved successfully!");

      // redirect to Profile and refresh
      navigate("/profile", { replace: true });
      window.location.reload();

    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Update Patient Info</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white border rounded p-4 space-y-3">
          <h2 className="font-semibold text-lg mb-2">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="border rounded p-2"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="border rounded p-2"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <input
              className="border rounded p-2"
              type="number"
              placeholder="Weight (lb)"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
            <input
              className="border rounded p-2"
              type="number"
              placeholder="Height (in)"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Sex"
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="ZIP"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
            />
          </div>
        </section>

        {/* Medical Sections */}
        <MedicalHistoryForm
          value={form.MedHist}
          onChange={(val) => setForm({ ...form, MedHist: val })}
        />

        <AllergiesForm
          value={form.Allergies}
          onChange={(val) => setForm({ ...form, Allergies: val })}
        />

        <PrescriptionsForm
          value={form.Prescriptions}
          onChange={(val) => setForm({ ...form, Prescriptions: val })}
        />

        <div className="flex justify-end">
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
