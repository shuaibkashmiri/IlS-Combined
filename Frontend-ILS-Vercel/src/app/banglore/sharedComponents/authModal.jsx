"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  loginUser,
  googleLogin,
} from "../../../redux/features/userSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const AuthModal = ({ showModal, toggleModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isResendAvailable, setIsResendAvailable] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, tempdata } = useSelector((state) => state.user);

  const passwordRequirements = [
    {
      text: "At least 8 characters",
      test: (pass) => pass.length >= 8,
    },
    {
      text: "One uppercase letter",
      test: (pass) => /[A-Z]/.test(pass),
    },
    {
      text: "One number",
      test: (pass) => /[0-9]/.test(pass),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        const result = await dispatch(
          loginUser({ email: formData.email, password: formData.password })
        ).unwrap();

        if (result.needsVerification) {
          setNeedsVerification(true);
          setVerificationEmail(formData.email);
          return;
        }

        setFormData({ fullname: "", email: "", password: "" });
        toast.success("Logged in successfully!");
        toggleModal();

        if (result.tempdata?.length >= 1) {
          router.push("/banglore/dashboard");
        }
      } else {
        const result = await dispatch(registerUser(formData)).unwrap();

        if (result.needsVerification) {
          setNeedsVerification(true);
          setVerificationEmail(formData.email);
          setIsResendAvailable(false);
          return;
        }

        if (result.alreadyRegistered) {
          setIsLogin(true);
          setFormErrors({
            general: "This email is already registered. Please login instead.",
          });
          return;
        }

        toast.success(result.message);
        setIsLogin(true);
      }
    } catch (err) {
      if (err.needsVerification) {
        setNeedsVerification(true);
        setVerificationEmail(formData.email);
        setIsResendAvailable(false);
      } else {
        setFormErrors({ general: err.message || "An error occurred" });
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await dispatch(googleLogin()).unwrap();
      toast.success("Logged in successfully with Google!");
      toggleModal();

      if (result.tempdata?.length >= 1) {
        router.push("/banglore/dashboard");
      }
    } catch (err) {
      setFormErrors({ general: err.message || "Google login failed" });
    }
  };

  const switchForm = () => {
    setIsLogin(!isLogin);
    setFormData({ fullname: "", email: "", password: "" });
    setFormErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else {
      const failedRequirements = passwordRequirements.filter(
        (req) => !req.test(formData.password)
      );
      if (failedRequirements.length > 0) {
        errors.password = "Password does not meet all requirements";
      }
    }

    if (!isLogin && !formData.fullname.trim()) {
      errors.fullname = "Full Name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResendVerification = async () => {
    try {
      await axios.post(`${BASE_URL}/resend-verification`, {
        email: verificationEmail,
      });
      toast.success("Verification email resent successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification email"
      );
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div
        className="relative my-auto bg-white w-full max-w-md shadow-2xl rounded-lg transform transition-all overflow-hidden"
        style={{ maxHeight: "95vh" }}
      >
        {/* Header Section - Fixed */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#00965f] to-[#164758] p-6 text-white">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={toggleModal}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">
            Welcome {isLogin ? "Back" : "to ILS"}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {isLogin
              ? "Sign in to continue your learning journey"
              : "Create an account to start learning"}
          </p>
        </div>

        {/* Form Section - Scrollable */}
        <div
          className="overflow-y-auto overscroll-contain p-6 space-y-4"
          style={{
            maxHeight: "calc(95vh - 100px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all outline-none"
              />
              {formErrors.fullname && (
                <p className="mt-1 text-red-500 text-sm">
                  {formErrors.fullname}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all outline-none"
            />
            {formErrors.email && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>
            )}
          </div>

          {/* Password field with requirements */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-red-500 text-sm">{formErrors.password}</p>
            )}

            {/* Password Requirements */}
            <div
              className={`space-y-1.5 text-sm transition-all duration-300 ${
                !isLogin && (passwordFocus || formData.password)
                  ? "opacity-100 max-h-40"
                  : "opacity-0 max-h-0"
              } overflow-hidden`}
            >
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {req.test(formData.password) ? (
                    <FaCheck className="text-green-500 w-3.5 h-3.5" />
                  ) : (
                    <FaTimes className="text-red-500 w-3.5 h-3.5" />
                  )}
                  <span
                    className={`${
                      req.test(formData.password)
                        ? "text-green-500"
                        : "text-gray-600"
                    }`}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {formErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {formErrors.general}
            </div>
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00965f] text-white py-3 rounded-lg font-medium hover:bg-[#164758] transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
            )}
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <span className="bg-white px-2 text-sm text-gray-500 relative">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border-2 border-gray-300 py-3 rounded-lg flex justify-center items-center space-x-2 hover:bg-gray-50 transition-colors duration-300"
          >
            <img
              src="https://img.icons8.com/color/24/000000/google-logo.png"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={switchForm}
                className="text-[#00965f] font-medium hover:text-[#164758] transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {needsVerification && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h3 className="text-yellow-800 font-medium">
                Email Verification Required
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                Please verify your email address to continue. Check your inbox
                for the verification link.
              </p>
              {isResendAvailable && (
                <button
                  onClick={handleResendVerification}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
