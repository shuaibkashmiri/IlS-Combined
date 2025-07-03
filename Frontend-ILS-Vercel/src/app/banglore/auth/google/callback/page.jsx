"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../../../../redux/features/userSlice";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completeGoogleAuth = async () => {
      try {
        const success = searchParams.get("success");
        const token = searchParams.get("token");
        if (token) {
          localStorage.setItem("token", token);
        }
        if (success === "true") {
          // Get user details and update Redux store
          const userData = await dispatch(getUserDetails()).unwrap();
          toast.success("Successfully logged in with Google!");
          // Navigate based on whether user has enrolled courses
          if (userData?.enrolledCourses?.length > 0) {
            router.push("/banglore/dashboard");
          } else {
            router.push("/banglore");
          }
        } else {
          throw new Error("Google authentication failed");
        }
      } catch (error) {
        console.error("Error completing Google auth:", error);
        toast.error("Failed to complete Google login");
        router.push("/banglore");
      } finally {
        setIsLoading(false);
      }
    };
    completeGoogleAuth();
  }, [dispatch, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00965f]"></div>
      </div>
    );
  }
  return null;
}
