import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Login component to handle user login
const Login = ({ setUser }) => {
    
  // Set initial state for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // To handle any error messages
  const [error, setError] = useState("");

  // For page navigation after successful login
  const navigate = useNavigate();

  // This function updates form fields as the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This function handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh
    try {
      // Send login request to backend API
      const res = await axios.post("/api/users/login", formData);

      // Save the token to local storage for authentication
      localStorage.setItem("token", res.data.token);

      // Log the response and update user state
      console.log(res.data);
      setUser(res.data);

      // Redirect to homepage after login
      navigate("/");
    } catch (err) {
      // Show error message if login fails
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    // Main container with centered form
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Display error message if login fails */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
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
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
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

          {/* Submit button */}
          <button className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-medium cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
