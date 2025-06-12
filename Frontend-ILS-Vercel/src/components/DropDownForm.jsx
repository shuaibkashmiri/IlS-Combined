"use client";

import React, { useState, useEffect } from "react";
import ThreeSixtyCarousel from "./ThreeSixtyCarousel";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  BsBook,
  BsClock,
  BsArrowRight,
  BsGlobe,
  BsGeoAlt,
  BsCodeSlash,
  BsLightning,
  BsRocket,
  BsStars,
  BsMap,
} from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GB, US, IN } from "country-flag-icons/react/3x2";

const countryStateData = {
  India: ["Srinagar", "Bangalore", "Delhi", "Mumbai"],
  USA: ["California", "Texas", "New York"],
  UK: ["London", "Manchester"],
};

const siteUrls = {
  Srinagar: "https://ilssrinagar.com",
  Bangalore: "/banglore",
  Delhi: null,
  Mumbai: null,
  International: "https://international-site.com",
};

const courses = [
  {
    title: "Web Development",
    description: "Master modern web technologies",
    duration: "6 months",
    level: "Beginner to Advanced",
  },
  {
    title: "Data Science",
    description: "Learn data analysis and ML",
    duration: "8 months",
    level: "Intermediate",
  },
  {
    title: "Digital Marketing",
    description: "Master digital marketing strategies",
    duration: "4 months",
    level: "All Levels",
  },
  {
    title: "UI/UX Design",
    description: "Design stunning user interfaces",
    duration: "5 months",
    level: "Beginner to Intermediate",
  },
  {
    title: "Cloud Computing",
    description: "Deploy and manage cloud apps",
    duration: "7 months",
    level: "Intermediate",
  },
  {
    title: "Cyber Security",
    description: "Protect systems and networks",
    duration: "6 months",
    level: "Advanced",
  },
];

const countryFlags = {
  UK: GB,
  USA: US,
  India: IN,
};

const DropdownForm = () => {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (country) {
      setState("");
    }
  }, [country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!country || !state) {
      toast.error("Please select both country and state");
      return;
    }

    if (state === "Srinagar") {
      window.location.href = siteUrls.Srinagar;
    } else if (state === "Bangalore") {
      window.location.href = siteUrls.Bangalore;
    } else {
      toast.error("Not available for your location yet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Pattern - Keeping the subtle dot pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="text-emerald-600 w-25">
            <button
              onClick={() => (window.location.href = "/")}
              className="focus:outline-none"
            >
              <img
                src="/logo.png"
                alt="ILS Logo"
                className="md:ml-18 h-8 w-auto"
              />
            </button>
          </div>

          {/* Mobile Menu Button and In-House Link */}
          <div className="md:hidden flex items-center gap-4">
            <a
              href="/inhouse/student/login"
              className="hover:text-grey-600 transition-colors bg-gradient-to-r from-emerald-500 to-green-500 p-2 px-3 rounded-2xl text-white text-sm"
            >
              In-House
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-gray-700 font-medium md:mr-10">
            <a
              href="#aboutus"
              className="hover:text-emerald-600 transition-colors"
            >
              About
            </a>
            <a
              href="#team"
              className="hover:text-emerald-600 transition-colors"
            >
              Team
            </a>
            <a
              href="#contact"
              className="hover:text-emerald-600 transition-colors"
            >
              Contact
            </a>
            <a
              href="/inhouse/student/login"
              className="hover:text-grey-600 transition-colors bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-2xl text-white"
            >
              In-House
            </a>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-sm mt-4 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-4">
                <a
                  href="#aboutus"
                  className="text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  About
                </a>
                <a
                  href="#team"
                  className="text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  Team
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-emerald-600 transition-colors py-2"
                >
                  Contact
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Add padding-top to account for fixed header */}
      <div className="container pt-32 pb-24 relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl md:ml-24 flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Side - Country/State Dropdown Form */}
          <motion.div
            className="w-full lg:w-1/2 space-y-8 text-center lg:text-left order-2 lg:order-1 lg:pr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              We Are <br className="hidden md:block" />{" "}
              <span className="text-emerald-600">ONLINE EDUCATION</span>
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Turn knowledge into career success with interactive, modern, and
              immersive online courses.{" "}
            </motion.p>
            {/* Start Now Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(16, 185, 129, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-10 py-4 rounded-full font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              START NOW
            </motion.button>
          </motion.div>

          {/* Right Side - Illustration Placeholder */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center items-center order-1 lg:order-2 lg:pl-8"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-emerald-700 md:ml-8 mb-8">
              Our Top Courses
            </h2>
            <ThreeSixtyCarousel
              courses={courses}
              onWatchDemo={(course) => {
                setIsModalOpen(true);
                toast.info(`Selected course: ${course.title}`);
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Select Your Location
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
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
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Country/State Dropdown Form */}
              <div className="space-y-8">
                {/* Country Selection */}
                <motion.div className="relative" whileHover={{ scale: 1.01 }}>
                  <div
                    onClick={() => {
                      setIsCountryOpen(!isCountryOpen);
                      setIsStateOpen(false);
                    }}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/90 transition-all duration-300 border border-white/50 hover:border-emerald-500/50 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {country && countryFlags[country] ? (
                          <motion.div
                            className="relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-16 h-12 rounded-md bg-white shadow-sm flex items-center justify-center overflow-hidden">
                              <span className="w-full h-full">
                                {React.createElement(countryFlags[country])}
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-16 h-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
                              <BsGlobe className="text-white text-xl" />
                            </div>
                          </motion.div>
                        )}
                        <div>
                          <p className="text-sm text-emerald-600 font-medium mb-0.5">
                            Select Country
                          </p>
                          <p className="text-gray-900 font-semibold text-lg">
                            {country || "Choose your country"}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors shadow-sm"
                        animate={{ rotate: isCountryOpen ? 180 : 0 }}
                      >
                        <MdKeyboardArrowDown className="text-xl text-emerald-600 group-hover:text-emerald-500" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCountryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[100] w-full mt-2 bg-white rounded-xl border border-emerald-200 shadow-xl"
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          top: "100%",
                          left: 0,
                          right: 0,
                        }}
                      >
                        <div className="py-1">
                          {Object.keys(countryStateData).map((c, index) => (
                            <motion.div
                              key={c}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                              }}
                              onClick={() => {
                                setCountry(c);
                                setIsCountryOpen(false);
                              }}
                              className="p-4 flex items-center gap-4 cursor-pointer border-b border-emerald-100 last:border-0 hover:bg-emerald-50/50 transition-colors"
                            >
                              <motion.div
                                className="w-14 h-10 rounded-md bg-white shadow-sm flex items-center justify-center overflow-hidden"
                                whileHover={{ scale: 1.1 }}
                              >
                                {countryFlags[c] && (
                                  <span className="w-full h-full">
                                    {React.createElement(countryFlags[c])}
                                  </span>
                                )}
                              </motion.div>
                              <div className="flex-1">
                                <span className="text-gray-900 text-base font-medium block mb-0.5">
                                  {c}
                                </span>
                                <p className="text-emerald-600 text-sm">
                                  {countryStateData[c].length} locations
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* State Selection */}
                {!isCountryOpen && (
                  <motion.div className="relative" whileHover={{ scale: 1.01 }}>
                    <div
                      onClick={() => {
                        if (country) {
                          setIsStateOpen(!isStateOpen);
                          setIsCountryOpen(false);
                        }
                      }}
                      className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 border border-white/50 ${
                        !country
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white/90 hover:border-emerald-500/50"
                      } shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-16 h-12 rounded-md bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
                              <BsGeoAlt className="text-white text-xl" />
                            </div>
                          </motion.div>
                          <div>
                            <p className="text-sm text-emerald-600 font-medium mb-0.5">
                              Select State
                            </p>
                            <p className="text-gray-900 font-semibold text-lg">
                              {state || "Choose your state"}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors shadow-sm"
                          animate={{ rotate: isStateOpen ? 180 : 0 }}
                        >
                          <MdKeyboardArrowDown className="text-xl text-emerald-600 group-hover:text-emerald-500" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isStateOpen && country && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-[100] w-full mt-2 bg-white rounded-xl border border-emerald-200 shadow-xl"
                          style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            top: "100%",
                            left: 0,
                            right: 0,
                          }}
                        >
                          <div className="py-1">
                            {countryStateData[country].map((s, index) => (
                              <motion.div
                                key={s}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{
                                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                                }}
                                onClick={() => {
                                  setState(s);
                                  setIsStateOpen(false);
                                }}
                                className="p-4 flex items-center gap-4 cursor-pointer border-b border-emerald-100 last:border-0 hover:bg-emerald-50/50 transition-colors"
                              >
                                <motion.div
                                  className="w-14 h-10 rounded-md bg-gradient-to-br from-emerald-500/10 to-green-500/10 flex items-center justify-center shadow-sm"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <BsGeoAlt className="text-emerald-500 text-xl" />
                                </motion.div>
                                <div className="flex-1">
                                  <span className="text-gray-900 text-base font-medium block mb-0.5">
                                    {s}
                                  </span>
                                  <p className="text-emerald-600 text-sm">
                                    View courses
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

<style jsx>{`
  .custom-image-border {
    max-width: 700px;
    width: 100%;
    border: 6px solid #222;
    border-radius: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    display: inline-block;
    padding: 10px;
    background: #fff;
    transition: box-shadow 0.3s;
  }
  .custom-image-border:hover {
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.18);
    border-color: #00965f;
  }
`}</style>;

export default DropdownForm;
