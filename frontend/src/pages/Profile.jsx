import React from "react";
import { usePatient } from "../context/PatientContext";
import ProfileCard from "../components/profile/ProfileCard";

export default function Profile() {
  const { patient, loading } = usePatient();

  if (loading)
    return (
      <div className="p-6 text-gray-500">Loading patient info...</div>
    );

  if (!patient)
    return (
      <div className="p-6 text-red-500">
        Could not load patient data.
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <ProfileCard profile={patient} />

      <section className="bg-white rounded border p-4">
        <h3 className="font-semibold text-lg mb-3">Medical Summary</h3>
        <div>
          <strong>Height:</strong> {patient.height || "-"} in
        </div>
        <div>
          <strong>Sex:</strong> {patient.sex || "-"}
        </div>
        <div>
          <strong>Phone:</strong> {patient.phone || "-"}
        </div>
        <div>
          <strong>Address:</strong>{" "}
          {patient.address
            ? `${patient.address}, ${patient.city || ""}, ${patient.state || ""} ${patient.zip || ""}`
            : "-"}
        </div>
      </section>
    </div>
  );
}

