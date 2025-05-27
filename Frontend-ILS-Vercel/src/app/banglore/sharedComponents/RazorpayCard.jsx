"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const RazorpayCard = ({ amount, courseId, onSuccess }) => {
  const userState = useSelector((state) => state.user);
  const user = userState?.user;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await initializeRazorpay();

      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      if (!user) {
        toast.error("Please login to make a payment");
        return;
      }

      // Add logging
      console.log("Attempting to create order with amount:", amount * 100);

      // Create order with error handling
      try {
        const { data } = await api.post("/api/payment/create-order", {
          amount: amount * 100,
        });

        console.log("Order created:", data);

        if (!data.success) {
          throw new Error(data.message || "Failed to create order");
        }

        const options = {
          key: "rzp_test_WoG9mH6d3QrW0B",
          amount: data.order.amount,
          currency: "INR",
          name: "ILS Learning",
          description: "Course Payment",
          order_id: data.order.id,
          handler: function (response) {
            handlePaymentSuccess(response);
          },
          prefill: {
            name: user?.fullname || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          notes: {
            address: "ILS Learning Corporate Office",
          },
          theme: {
            color: "#00965f",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          toast.error(response.error.description);
        });
        paymentObject.open();
      } catch (apiError) {
        console.error("API Error Details:", {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
        });
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(
        error.response?.data?.message || "Payment initialization failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Separate function to handle successful payment
  const handlePaymentSuccess = async (response) => {
    try {
      console.log("Payment successful, verifying...");
      const { data: verificationData } = await api.post("/api/payment/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        courseId: courseId,
      });

      if (verificationData.success) {
        console.log("Payment verified successfully");
        toast.success("Payment successful! Redirecting to course...");

        // Call onSuccess if provided
        if (onSuccess) {
          onSuccess({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            courseId: courseId,
          });
        }

        console.log("Navigating to:", `/banglore/courses/${courseId}`);
        // Force a small delay before navigation
        setTimeout(() => {
          router.push(`/banglore/courses/${courseId}`);
          toast.success("Payment successful!");
        }, 1000);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Complete Your Payment
        </h3>
        <p className="text-gray-600 mt-1">Secure payment via Razorpay</p>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Amount:</span>
        <span className="text-lg font-semibold text-gray-800">₹{amount}</span>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !user}
        className={`w-full ${
          loading || !user ? "bg-gray-400" : "bg-[#00965f] hover:bg-[#007a4d]"
        } text-white py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2`}
      >
        <span>
          {loading ? "Processing..." : !user ? "Please Login" : "Pay Now"}
        </span>
        {!loading && user && (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          By clicking Pay Now, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default RazorpayCard;
