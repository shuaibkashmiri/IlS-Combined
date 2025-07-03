"use client";
import { Suspense } from "react";
import GoogleCallbackPageInner from "./GoogleCallbackPageInner";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackPageInner />
    </Suspense>
  );
}
