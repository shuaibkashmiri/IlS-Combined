// src/App.jsx

import React from "react";
import DropDownForm from "../components/DropDownForm";
import Footer from "../components/Footer";

import HorizontalRule from "../components/HorizontalRule";
import AboutUs from "./banglore/sharedComponents/AboutUs";

export const metadata = {
  title: "Interface Learning School - ILS",
  description: "Learn and grow with ILS - Your trusted partner in education",
  keywords: "education, learning, courses, online learning",
};

import { useEffect } from "react";
const url = `${process.env.NEXT_PUBLIC_API_URL}`;
export default function Index() {
  useEffect(() => {
    // Ping the /ting endpoint every 10 minutes
    const interval = setInterval(() => {
      fetch(`${url}/ting`).catch(() => {}); // Ignore errors
    }, 600000); // 600,000 ms = 10 minutes
    // Initial ping on mount
    fetch(`${url}/ting`).catch(() => {});
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <DropDownForm />
      <HorizontalRule />
      <AboutUs />
      <HorizontalRule />
      <Footer />
    </div>
  );
}
