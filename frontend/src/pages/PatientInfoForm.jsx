import { useState } from "react";

export default function PatientInfoForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
  });

  const [status, setStatus] = useState({ message: "", success: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "Submitting...", success: null });

    try {
      const response = await fetch("http://localhost:5000/api/patientInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit form.");

      setStatus({ message: "Patient info saved successfully!", success: true });
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        allergies: "",
        medications: "",
        medicalHistory: "",
      });
    } catch (err) {
      setStatus({ message: err.message, success: false });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
          Patient Information Form
        </h2>

        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
            className="border rounded-lg p-2 w-full"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="border rounded-lg p-2 w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Medical info */}
        <textarea
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          placeholder="List any allergies..."
          className="border rounded-lg p-2 w-full mb-4 h-20"
        />

        <textarea
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          placeholder="List current medications..."
          className="border rounded-lg p-2 w-full mb-4 h-20"
        />

        <textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          placeholder="Brief medical history..."
          className="border rounded-lg p-2 w-full mb-6 h-24"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
        >
          Submit
        </button>

        {status.message && (
          <p
            className={`mt-4 text-center ${
              status.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}

