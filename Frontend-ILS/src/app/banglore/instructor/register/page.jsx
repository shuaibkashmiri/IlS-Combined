"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  initiateTeachingApplication,
  verifyTeachingOTP,
  completeTeachingApplication,
  resetInstructorRegistration,
} from "../../../../redux/features/userSlice";
import { toast } from "sonner";

const InstructorRegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const instructorRegistration = useSelector(
    (state) => state.user?.instructorRegistration
  ) || {
    step: 1,
    email: null,
    message: null,
    error: null,
    loading: false,
  };
  const { step, email, message, error, loading } = instructorRegistration;

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    mobile: "",
    expertise: "",
    bio: "",
    password: "",
    documents: null,
  });

  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (message === "Application completed successfully") {
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        dispatch(resetInstructorRegistration());
        router.push("/banglore/instructor/login");
      }, 3000);
    }
  }, [message, dispatch, router]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "documents" && files) {
      const file = files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (file.size > maxSize) {
        setFileError("File size should be less than 5MB");
        e.target.value = ""; // Clear the file input
        setFormData((prev) => ({ ...prev, documents: null }));
        return;
      }

      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are allowed");
        e.target.value = ""; // Clear the file input
        setFormData((prev) => ({ ...prev, documents: null }));
        return;
      }

      setFileError("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleInitiateApplication = async () => {
    await dispatch(initiateTeachingApplication({ email: formData.email }));
  };

  const handleVerifyOTP = async () => {
    await dispatch(
      verifyTeachingOTP({ email: formData.email, otp: formData.otp })
    );
  };

  const handleCompleteApplication = async () => {
    const completeFormData = new FormData();
    completeFormData.append("email", email);
    completeFormData.append("name", formData.name);
    completeFormData.append("mobile", formData.mobile);
    completeFormData.append("expertise", formData.expertise);
    completeFormData.append("bio", formData.bio);
    completeFormData.append("password", formData.password);
    if (formData.documents) {
      completeFormData.append("documents", formData.documents);
    }

    await dispatch(completeTeachingApplication(completeFormData));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            Join Our Teaching Community
          </h2>
          <p className="text-lg mb-8 text-green-100">
            Share your expertise, inspire learners, and grow your teaching
            career with ILS Learning Platform.
          </p>
          <div className="relative w-full h-64">
            <Image
              src="/images/instructor-register-illustration.svg"
              alt="Instructor Registration Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Registration
            </h1>
            <p className="mt-2 text-gray-600">
              Join ILS Learning Platform as an Instructor
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                      step >= stepNumber
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step >= stepNumber ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {stepNumber === 1
                      ? "Email"
                      : stepNumber === 2
                      ? "Verify OTP"
                      : "Complete Profile"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className="mt-8 space-y-6">
            {/* Step 1: Email Verification */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleInitiateApplication}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {loading ? (
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
                      Sending...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Enter the code sent to your email"
                  />
                </div>
                {message && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {loading ? (
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
                      Verifying...
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </div>
            )}

            {/* Step 3: Complete Profile */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your area of expertise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed CV (PDF)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      {formData.documents ? (
                        <div className="flex flex-col items-center">
                          <svg
                            className="mx-auto h-12 w-12 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">
                            {formData.documents.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(formData.documents.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                documents: null,
                              }));
                              setFileError("");
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                              <span>Upload CV</span>
                              <input
                                id="file-upload"
                                name="documents"
                                type="file"
                                accept=".pdf"
                                className="sr-only"
                                onChange={handleInputChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF files only, max 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {fileError && (
                    <p className="mt-2 text-sm text-red-600">{fileError}</p>
                  )}
                </div>
                {message && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleCompleteApplication}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {loading ? (
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
                      Submitting...
                    </span>
                  ) : (
                    "Complete Application"
                  )}
                </button>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already registered?{" "}
                <Link
                  href="/banglore/instructor/login"
                  className="font-medium text-green-600 hover:text-green-500 transition duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorRegisterPage;
