"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const VerifyEmail = ({ params }) => {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const router = useRouter();
  const { token } = params;

  // const BASE_URL = "https://ils-project.onrender.com";
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/auth/verify-email/${token}`,
          { withCredentials: true }
        );

        setVerificationStatus("success");
        toast.success(response.data.message);

        // Navigate to root of Banglore after success
        setTimeout(() => {
          router.push("/banglore");
        }, 3000);
      } catch (error) {
        console.error("Verification Error:", error);
        setVerificationStatus("error");
        toast.error(error.response?.data?.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [token, router, BASE_URL]);

  // Add console log for debugging
  useEffect(() => {
    console.log("Current verification status:", verificationStatus);
    console.log("Token:", token);
  }, [verificationStatus, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {verificationStatus === "verifying" && (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00965f] mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-[#00965f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been verified. Redirecting to login page...
            </p>
          </div>
        )}

        {verificationStatus === "error" && (
          <div>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
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
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={() => router.push("/banglore")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00965f] hover:bg-[#164758] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00965f]"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
