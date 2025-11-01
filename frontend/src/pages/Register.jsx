import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  // write to global auth so Navbar/guards see it
  const { setToken, setUser } = useAuth();

  // local form + UI state
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // NOTE: if you don't have a Vite proxy, prepend your API base URL here
      const res = await axios.post("/api/users/register", formData);

      // persist token for refresh
      localStorage.setItem("token", res.data.token);

      // hydrate global auth context
      setToken(res.data.token);
      setUser({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        fullName: res.data.fullName, // include if backend returns it
        role: res.data.role,         // optional
      });

      // go to patient home
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">Username</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400"
              type="text"              // was "username" (invalid)
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="off"
              required
            />
          </div>

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

          <button
            disabled={submitting}
            className={`w-full text-white p-3 rounded-md font-medium ${submitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
