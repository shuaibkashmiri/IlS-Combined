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

import PingKeepAlive from "../components/PingKeepAlive";
export default function Index() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <PingKeepAlive />
      <DropDownForm />
      <HorizontalRule />
      <AboutUs />
      <HorizontalRule />
      <Footer />
    </div>
  );
}
