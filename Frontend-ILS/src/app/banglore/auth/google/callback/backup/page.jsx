"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Suspense } from "react";

function GoogleCallbackPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  useEffect(() => {
    // Example: Redirect to dashboard on success, login on error
    if (success === "true") {
      // You can show a message or directly redirect
      setTimeout(() => {
        router.replace("/banglore/dashboard");
      }, 1500);
    } else if (success === "false" || error) {
      setTimeout(() => {
        router.replace("/banglore/auth/login");
      }, 2000);
    }
  }, [success, error, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      {success === "true" && <h2>Login successful! Redirecting to dashboard...</h2>}
      {(success === "false" || error) && (
        <h2>Login failed. Redirecting to login page...</h2>
      )}
      {!success && !error && <h2>Processing authentication...</h2>}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackPageInner />
    </Suspense>
  );
}
