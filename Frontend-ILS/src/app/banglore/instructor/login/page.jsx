"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { instructorLogin } from "../../../../redux/features/userSlice";
import { toast } from "sonner";
import Image from "next/image";

const InstructorLoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Access general user state for login
  const userState = useSelector((state) => state.user) || {
    loading: false,
    error: null,
    message: null,
  };
  const {
    loading: loginLoading,
    error: loginError,
    message: loginMessage,
  } = userState;

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [showToast, setShowToast] = useState(false);

  // Redirect to instructor page on successful login
  useEffect(() => {
    if (loginMessage === "Login successful") {
      toast.success("Logged in successfully!");
      setTimeout(() => {
        router.push("/banglore/instructor");
      }, 3000);
    }
  }, [loginMessage, router]);

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstructorLogin = async () => {
    await dispatch(
      instructorLogin({
        email: loginFormData.email,
        password: loginFormData.password,
      })
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
          <p className="text-lg mb-8 text-green-100">
            Access your instructor dashboard to manage courses, track student
            progress, and create engaging learning experiences.
          </p>
          <div className="relative w-full h-64">
            <Image
              src="/Instructor.png"
              alt="Instructor Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Login
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to your ILS Instructor Account
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginFormData.email}
                  onChange={handleLoginInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleLoginInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              onClick={handleInstructorLogin}
              disabled={loginLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loginLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Not registered?{" "}
                <Link
                  href="/banglore/instructor/register"
                  className="font-medium text-green-600 hover:text-green-500 transition duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLoginPage;
