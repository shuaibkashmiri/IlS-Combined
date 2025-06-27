"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../../redux/features/userSlice";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.user);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await dispatch(loginUser(form)).unwrap();
      // Check sessionStorage for user and role
      const userStr = sessionStorage.getItem("user");
      let user = null;
      try {
        user = userStr ? JSON.parse(userStr) : null;
      } catch (err) {
        user = null;
      }
      if (user && user.role === "admin") {
        toast.success("Admin login successful!");
        setTimeout(() => {
          router.push("/inhouse/admin");
        }, 800);
      } else {
        setError("You are not authorized as admin.");
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e6f9f2]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#164758] mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-[#00965f] text-white rounded-lg font-semibold hover:bg-[#007f4f] transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
