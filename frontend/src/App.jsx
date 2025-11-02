import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/layout/Layout";

// Public pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Protected pages
import Profile from "./pages/Profile.jsx";
import Appointments from "./pages/Appointments.jsx";
import Visits from "./pages/Visits.jsx";
import Medication from "./pages/Medication.jsx";
import About from "./pages/About.jsx";
import { PatientProvider } from "./context/PatientContext.jsx";

// Patient Info page
import PatientInfo from "./pages/patient-info/PatientInfo.jsx";

// Fallback
import NotFound from "./components/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <BrowserRouter>
          <Routes>
            {/* ===== Public Routes ===== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ===== Protected Routes (require login) ===== */}
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/profile" replace />} />

                {/* Standard routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/visits" element={<Visits />} />
                <Route path="/medication" element={<Medication />} />
                <Route path="/about" element={<About />} />

                {/* 🆕 Patient Info route */}
                <Route path="/patient-info" element={<PatientInfo />} />
              </Route>
            </Route>

            {/* ===== 404 Fallback ===== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </AuthProvider>
  );
}

