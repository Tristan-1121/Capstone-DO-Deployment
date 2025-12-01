import React, { useEffect, useState } from "react";

export default function Profile() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchPatient = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch patient profile");
      const data = await res.json();
      setPatient(data);
    } catch (err) {
      console.error("❌ Error fetching patient profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [token]);

  if (loading)
    return <div className="p-6 text-gray-500 dark:text-gray-300">Loading patient info...</div>;

  if (!patient)
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        Could not load patient data.
      </div>
    );

  const formatHeight = (inches) => {
    if (!inches) return "-";
    const feet = Math.floor(inches / 12);
    const remaining = inches % 12;
    return `${feet}'${remaining}"`;
  };

  return (
    <div className="p-6 space-y-6">

      {/* === Patient Summary === */}
      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Patient Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
          <div><strong>Full Name:</strong> {patient.Name || "-"}</div>
          <div><strong>Email:</strong> {patient.Email || "-"}</div>
          <div><strong>Age:</strong> {patient.Age || "-"}</div>
          <div><strong>Weight:</strong> {patient.Weight ? `${patient.Weight} lb` : "-"}</div>
          <div><strong>Height:</strong> {formatHeight(patient.Height)}</div>
          <div><strong>Sex:</strong> {patient.Sex || "-"}</div>
        </div>
      </section>

      {/* === Contact Info === */}
      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
        <div><strong>Phone:</strong> {patient.Phone || "—"}</div>
        <div><strong>Address:</strong> {patient.Address || "—"}</div>
        <div><strong>ZIP Code:</strong> {patient.Zip || "—"}</div>
        <div><strong>Emergency Contact:</strong> {patient.EmergencyContact || "—"}</div>
      </section>

      {/* === Health History === */}
      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Health History</h3>
          {patient.MedHist?.length ? (
            <ul className="list-disc ml-6 space-y-2">
              {patient.MedHist.map((h, i) => (
                <li key={i} className="space-y-1">
                  <div><strong>Conditions:</strong> {h.conditions?.join(", ") || "—"}</div>
                  <div><strong>Surgeries:</strong> {h.surgereries?.join(", ") || "—"}</div>
                  <div><strong>Family History:</strong> {h.familyHistory || "—"}</div>
                  <div><strong>Notes:</strong> {h.notes || "—"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No history on file.</p>
          )}
      </section>

      {/* === Allergies === */}
      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Allergies</h3>
        {patient.Allergies?.length ? (
          <ul className="list-disc ml-6 space-y-2">
            {patient.Allergies.map((a, i) => (
              <li key={i} className="space-y-1">
                <div><strong>Allergen:</strong> {a.allergen || "—"}</div>
                <div><strong>Severity:</strong> {a.severity || "—"}</div>
                <div><strong>Reaction:</strong> {a.reaction || "—"}</div>
                <div><strong>Notes:</strong> {a.notes || "—"}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No allergies on file.</p>
        )}
      </section>

      {/* === Prescriptions === */}
      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Prescriptions</h3>
        {patient.Prescriptions?.length ? (
          <ul className="list-disc ml-6 space-y-2">
            {patient.Prescriptions.map((p, i) => (
              <li key={i} className="space-y-1">
                <div><strong>Medication:</strong> {p.medicationName || "—"}</div>
                <div><strong>Dosage:</strong> {p.dosage || "—"}</div>
                <div><strong>Frequency:</strong> {p.frequency || "—"}</div>
                <div><strong>Notes:</strong> {p.notes || "—"}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No prescriptions on file.</p>
        )}
      </section>

      {/* === Medical Summary === */}
      <section className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded border p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-3">Medical Summary</h3>
        <div><strong>Full Name:</strong> {patient.Name || "-"}</div>
        <div><strong>Height:</strong> {formatHeight(patient.Height)}</div>
        <div><strong>Weight:</strong> {patient.Weight ? `${patient.Weight} lb` : "-"}</div>
        <div><strong>Sex:</strong> {patient.Sex || "-"}</div>
        <div><strong>Age:</strong> {patient.Age || "-"}</div>
        <div>
          <strong>Address:</strong> {patient.Address || "-"}, {patient.City || "-"},{" "}
          {patient.State || "-"} {patient.Zip || "-"}
        </div>
        <div><strong>Phone:</strong> {patient.Phone || "-"}</div>
      </section>
    </div>
  );
}
