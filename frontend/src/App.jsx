import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/layout/Layout";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Profile from "./pages/Profile.jsx";
import Appointments from "./pages/Appointments.jsx";
import Visits from "./pages/Visits.jsx";
import Medication from "./pages/Medication.jsx";
import About from "./pages/About.jsx";
import NotFound from "./components/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected shell */}
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/profile" replace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/visits" element={<Visits />} />
              <Route path="/medication" element={<Medication />} />
              <Route path="/about" element={<About />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
