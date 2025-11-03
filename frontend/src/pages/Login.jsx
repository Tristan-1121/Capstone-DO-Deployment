import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/profile");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showSidebarToggle={false} />
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-[#003E7E] mb-1">
          Welcome to UWF CareConnect
        </h1>
        <p className="text-gray-500 mb-8">Secure access to your healthcare information</p>

        <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
          <h2 className="text-lg font-medium text-center mb-6">Login</h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Student Email</label>
              <input
                className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#003E7E]"
                type="email"
                placeholder="tc12@students.uwf.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Use your students.uwf.edu email.</p>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#003E7E]"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              className="w-full bg-[#003E7E] text-white py-2 rounded-md hover:bg-[#024a95] transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link className="text-[#003E7E] font-medium" to="/register">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-xs mt-4 text-gray-400">Secure & confidential | University of West Florida</p>
      </div>
    </>
  );
}
