import React, { createContext, useContext, useState, useEffect } from "react";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/patients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("❌ Error loading patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, []);

  return (
    <PatientContext.Provider value={{ patient, setPatient, loading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
