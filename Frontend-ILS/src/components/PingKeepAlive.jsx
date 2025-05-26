"use client";
import { useEffect } from "react";

const url = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function PingKeepAlive() {
  useEffect(() => {
    // Ping the /ting endpoint every 10 minutes
    const interval = setInterval(() => {
      fetch(`${url}/ting`).catch(() => {}); // Ignore errors
    }, 600000); // 600,000 ms = 10 minutes
    // Initial ping on mount
    fetch(`${url}/ting`).catch(() => {});
    return () => clearInterval(interval);
  }, []);
  return null; // No UI
}
