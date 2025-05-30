"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { BsBook, BsClock, BsArrowRight, BsGlobe, BsGeoAlt, BsCodeSlash, BsLightning, BsRocket, BsStars, BsMap } from "react-icons/bs";
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
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-emerald-500/20"
        >
          <BsStars className="text-7xl" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 text-emerald-500/20"
        >
          <BsRocket className="text-7xl" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <motion.div 
            className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Location Selection */}
              <div className="p-8 border-r border-white/50 relative overflow-hidden">
                <motion.div
                  className="absolute -right-20 -top-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="space-y-8 relative">
                  {/* Country Selection */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div
                      onClick={() => {
                        setIsCountryOpen(!isCountryOpen);
                        setIsStateOpen(false);
                      }}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/90 transition-all duration-300 border border-white/50 hover:border-emerald-500/50 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          {country && countryFlags[country] ? (
                            <motion.div 
                              className="relative"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="w-20 h-20 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden">
                                <span className="w-16 h-12">
                                  {React.createElement(countryFlags[country])}
                                </span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                <BsGlobe className="text-white text-sm" />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              className="relative"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-md">
                                <BsGlobe className="text-white text-3xl" />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <BsMap className="text-emerald-500 text-sm" />
                              </div>
                            </motion.div>
                          )}
                          <div>
                            <p className="text-sm text-emerald-600 font-medium mb-1">Select Country</p>
                            <p className="text-gray-900 font-semibold text-xl">
                              {country || "Choose your country"}
                            </p>
                          </div>
                        </div>
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors shadow-sm"
                          animate={{ rotate: isCountryOpen ? 180 : 0 }}
                        >
                          <MdKeyboardArrowDown className="text-2xl text-emerald-600 group-hover:text-emerald-500" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isCountryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-lg overflow-hidden"
                        >
                          {Object.keys(countryStateData).map((c, index) => (
                            <motion.div
                              key={c}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                              onClick={() => {
                                setCountry(c);
                                setIsCountryOpen(false);
                              }}
                              className="p-5 flex items-center gap-5 cursor-pointer border-b border-white/50 last:border-0 hover:bg-emerald-50/50 transition-colors"
                            >
                              <motion.div 
                                className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center overflow-hidden"
                                whileHover={{ scale: 1.1 }}
                              >
                                {countryFlags[c] && (
                                  <span className="w-14 h-10">
                                    {React.createElement(countryFlags[c])}
                                  </span>
                                )}
                              </motion.div>
                              <div className="flex-1">
                                <span className="text-gray-900 text-lg font-medium block mb-1">{c}</span>
                                <p className="text-emerald-600 text-sm">{countryStateData[c].length} locations available</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* State Selection */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div
                      onClick={() => {
                        if (country) {
                          setIsStateOpen(!isStateOpen);
                          setIsCountryOpen(false);
                        }
                      }}
                      className={`bg-white/70 backdrop-blur-sm rounded-xl p-6 cursor-pointer transition-all duration-300 border border-white/50 ${
                        !country ? "opacity-50 cursor-not-allowed" : "hover:bg-white/90 hover:border-emerald-500/50"
                      } shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <motion.div 
                            className="relative"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-md">
                              <BsGeoAlt className="text-white text-3xl" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <BsMap className="text-emerald-500 text-sm" />
                            </div>
                          </motion.div>
                          <div>
                            <p className="text-sm text-emerald-600 font-medium mb-1">Select State</p>
                            <p className="text-gray-900 font-semibold text-xl">
                              {state || "Choose your state"}
                            </p>
                          </div>
                        </div>
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors shadow-sm"
                          animate={{ rotate: isStateOpen ? 180 : 0 }}
                        >
                          <MdKeyboardArrowDown className="text-2xl text-emerald-600 group-hover:text-emerald-500" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isStateOpen && country && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-3 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-lg overflow-hidden"
                        >
                          {countryStateData[country].map((s, index) => (
                            <motion.div
                              key={s}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                              onClick={() => {
                                setState(s);
                                setIsStateOpen(false);
                              }}
                              className="p-5 flex items-center gap-5 cursor-pointer border-b border-white/50 last:border-0 hover:bg-emerald-50/50 transition-colors"
                            >
                              <motion.div 
                                className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 flex items-center justify-center shadow-sm"
                                whileHover={{ scale: 1.1 }}
                              >
                                <BsGeoAlt className="text-emerald-500 text-2xl" />
                              </motion.div>
                              <div className="flex-1">
                                <span className="text-gray-900 text-lg font-medium block mb-1">{s}</span>
                                <p className="text-emerald-600 text-sm">View available courses</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-5 rounded-xl font-medium text-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Continue
                      <motion.span
                        animate={{
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <BsArrowRight className="text-xl" />
                      </motion.span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </div>
              </div>

              {/* Right Side - Laptop Screen with Courses */}
              <div className="p-8 bg-white/30 backdrop-blur-sm relative overflow-hidden">
                <motion.div
                  className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Laptop Display */}
                <div className="relative flex justify-center">
                  {/* Laptop Frame */}
                  <motion.div 
                    className="relative w-[600px] h-[450px] bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
                      {/* Screen Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="w-3 h-3 rounded-full bg-red-500"
                            whileHover={{ scale: 1.2 }}
                          />
                          <motion.div 
                            className="w-3 h-3 rounded-full bg-yellow-500"
                            whileHover={{ scale: 1.2 }}
                          />
                          <motion.div 
                            className="w-3 h-3 rounded-full bg-emerald-500"
                            whileHover={{ scale: 1.2 }}
                          />
                        </div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <BsLightning className="text-emerald-500 text-xl" />
                          </motion.div>
                          <span className="font-medium">ILS Learning Platform</span>
                        </div>
                      </div>

                      {/* Course Grid */}
                      <div className="grid grid-cols-1 gap-4">
                        {courses.map((course, index) => (
                          <motion.div
                            key={course.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)"
                            }}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-emerald-500 transition-colors group"
                          >
                            <div className="flex items-start gap-4">
                              <motion.div 
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/20"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <BsCodeSlash className="text-white text-xl" />
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="text-white text-base font-medium mb-1 group-hover:text-emerald-400 transition-colors">
                                  {course.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-2">
                                  {course.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <motion.div 
                                    className="flex items-center gap-2"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    <BsClock className="text-emerald-500 text-base" />
                                    <span>{course.duration}</span>
                                  </motion.div>
                                  <motion.div 
                                    className="flex items-center gap-2"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    <BsBook className="text-emerald-500 text-base" />
                                    <span>{course.level}</span>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                            <motion.div 
                              className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                              initial={false}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Laptop Base */}
                  <motion.div 
                    className="absolute bottom-0 w-[700px] h-6 bg-gray-800 rounded-b-3xl shadow-xl"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-32 h-1 bg-gray-700 rounded-full mx-auto mt-2"></div>
                  </motion.div>

                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-emerald-500/20 rounded-full blur-sm"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DropdownForm;
