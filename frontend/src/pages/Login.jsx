import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // read/write token & user for the whole app

export default function Login() {
  // read global setters from context so Navbar/guards see changes
  const { setToken, setUser } = useAuth();

  // local form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // keep inputs controlled
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // submit to API, persist token, hydrate global auth state, then go to /profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", formData);

      // persist token so refresh keeps you logged in
      localStorage.setItem("token", res.data.token);

      // update global auth for the app shell (Navbar, guards, API helpers)
      setToken(res.data.token);
      setUser({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        // include fullName/role if your backend returns them
        fullName: res.data.fullName,
        role: res.data.role,
      });

      // land on the patient homepage (Profile)
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-medium">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
