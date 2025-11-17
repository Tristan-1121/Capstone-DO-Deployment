import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/layout/Layout";

// Public pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Patient protected pages
import Profile from "./pages/Profile.jsx";
import Appointments from "./pages/Appointments.jsx";
import Visits from "./pages/Visits.jsx";
import Medication from "./pages/Medication.jsx";
import About from "./pages/About.jsx";

// Patient info context + page
import { PatientProvider } from "./context/PatientContext.jsx";
import PatientInfo from "./pages/patient-info/PatientInfo.jsx";

// Practitioner layout and pages
import PractitionerLayout from "./components/layout/PractitionerLayout.jsx";
import PractitionerDashboard from "./pages/practitioner/Dashboard.jsx";
import PractitionerAppointments from "./pages/practitioner/Appointments.jsx";
import PractitionerCallbacks from "./pages/practitioner/Callbacks.jsx";
import PractitionerPatients from "./pages/practitioner/Patients.jsx";
import NotesPage from "./pages/practitioner/Notes.jsx";

// Fallback
import NotFound from "./components/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient protected shell */}
            <Route element={<RequireAuth allow={["patient"]} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/profile" replace />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/visits" element={<Visits />} />
                <Route path="/medication" element={<Medication />} />
                <Route path="/about" element={<About />} />
                <Route path="/patient-info" element={<PatientInfo />} />
              </Route>
            </Route>

            {/* Practitioner protected shell */}
            <Route element={<RequireAuth allow={["practitioner", "admin"]} />}>
              <Route element={<PractitionerLayout />}>
                <Route
                  path="/practitioner"
                  element={<Navigate to="/practitioner/dashboard" replace />}
                />
                <Route
                  path="/practitioner/dashboard"
                  element={<PractitionerDashboard />}
                />
                <Route
                  path="/practitioner/appointments"
                  element={<PractitionerAppointments />}
                />
                <Route
                  path="/practitioner/callbacks"
                  element={<PractitionerCallbacks />}
                />
                <Route
                  path="/practitioner/patients"
                  element={<PractitionerPatients />}
                />
                <Route
                  path="/practitioner/notes/:appointmentId"
                  element={<NotesPage />}
                  />
                <Route
                  path="/practitioner/callbacks" 
                  element={<PractitionerCallbacks />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </AuthProvider>
  );
}
