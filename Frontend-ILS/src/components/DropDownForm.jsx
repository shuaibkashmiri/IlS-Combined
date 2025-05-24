"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import HorizontalRule from "./HorizontalRule";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IoLocationOutline, IoGlobeOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
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

const videos = [
  "https://www.youtube.com/embed/4RixMPF4xis",
  "https://www.youtube.com/embed/4V0CwzEP_ps",
  "https://www.youtube.com/embed/video3_id",
  "https://www.youtube.com/embed/video4_id",
  "https://www.youtube.com/embed/video5_id",
  "https://www.youtube.com/embed/video6_id",
];

const courseSlides = [
  {
    title: "Web Development",
    description: "Learn modern web development with React and more",
    image:
      "https://www.simplilearn.com/ice9/free_resources_article_thumb/is_web_development_good_career.jpg",
    duration: "6 months",
    level: "Beginner to Advanced",
  },
  {
    title: "Data Science",
    description: "Master data analysis, ML and AI fundamentals",
    image:
      "https://www.naukri.com/campus/career-guidance/wp-content/uploads/2023/11/what-is-data-science.jpg",
    duration: "10 months",
    level: "Intermediate",
  },
  {
    title: "Digital Marketing",
    description: "Learn SEO, social media marketing, and content strategy",
    image:
      "https://www.berlinsbi.com/uploads/sites/2/2021/12/5-ways-msc-digital-marketing-will-advance-your-career.jpg",
    duration: "1 months",
    level: "All Levels",
  },

  {
    title: "UI/UX Design",
    description: "Create beautiful user interfaces and experiences",
    image:
      "https://mobitouch.net/_next/image?url=https%3A%2F%2Fnew.mobitouch.pl%2Fwp-content%2Fuploads%2F2023%2F09%2FUI-Designera_-Blog-Main.jpg&w=3840&q=75",
    duration: "4 months",
    level: "Beginner Friendly",
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50;

  useEffect(() => {
    if (country) {
      setStates(countryStateData[country] || []);
    } else {
      setStates([]);
    }
  }, [country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!country || !state) {
      toast.error("Please select both country and state.", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #F87171",
        },
      });
      return;
    }

    // Handle navigation based on selected state
    if (state === "Srinagar") {
      window.location.href = siteUrls.Srinagar;
    } else if (state === "Bangalore") {
      window.location.href = siteUrls.Bangalore;
    } else {
      toast.error("Not Available for your location yet", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #F87171",
        },
      });
    }
  };

  const handleNavClick = (
    e,
    isAbout = false,
    isContact = false,
    isHome = false
  ) => {
    if (isContact) {
      e.preventDefault();
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    } else if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!isAbout) {
      e.preventDefault();
      toast.error("Please submit your location before accessing the courses", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#FEE2E2",
          color: "#991B1B",
          border: "1px solid #F87171",
        },
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === courseSlides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? courseSlides.length - 1 : prev - 1
    );
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Modified auto-slide effect to respect pause state
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <div className="min-h-screen w-full">
      {/* Contact Bar - Hidden on mobile */}
      <div className="bg-[#164758] text-white py-1.5 hidden md:block fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm ">
          <div className="flex items-center space-x-4">
            <a
              href="mailto:info@ils.com"
              className="flex items-center hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              info@ils.com
            </a>
            <a
              href="tel:+1234567890"
              className="flex items-center hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +1 234 567 890
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-200">
              Follow Us
            </a>
            <div className="flex items-center space-x-2">
              <a href="#" className="hover:text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="hover:text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar - Added solid white background */}
      <nav className="bg-gradient-to-b from-gray-50 to-white fixed w-full z-40 top-0 md:top-[32px] mb-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-auto cursor-pointer"
                onClick={(e) => handleNavClick(e, false, false, true)}
              />
            </div>
            <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
              <li className="hover:text-[#00965f] cursor-pointer">
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, false, false, true)}
                >
                  Home
                </a>
              </li>
              <li className="hover:text-[#00965f] cursor-pointer">
                <a href="#" onClick={(e) => handleNavClick(e)}>
                  Courses
                </a>
              </li>
              <li className="hover:text-[#00965f] cursor-pointer">
                <a href="#about" onClick={(e) => handleNavClick(e, true)}>
                  About Us
                </a>
              </li>
              <li className="hover:text-[#00965f] cursor-pointer">
                <a
                  href="#footer"
                  onClick={(e) => handleNavClick(e, false, true)}
                >
                  Contact
                </a>
              </li>
            </ul>
            <button
              className="md:hidden text-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Added solid white background */}
      {isMenuOpen && (
        <ul
          className={`md:hidden flex flex-col items-center space-y-4 text-sm font-medium text-gray-700 bg-white py-4 shadow-md fixed w-full z-30 top-14 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <li className="hover:text-[#00965f] cursor-pointer">
            <a href="#" onClick={(e) => handleNavClick(e, false, false, true)}>
              Home
            </a>
          </li>
          <li className="hover:text-[#00965f] cursor-pointer">
            <a href="#" onClick={(e) => handleNavClick(e)}>
              Courses
            </a>
          </li>
          <li className="hover:text-[#00965f] cursor-pointer">
            <a href="#about" onClick={(e) => handleNavClick(e, true)}>
              About Us
            </a>
          </li>
          <li className="hover:text-[#00965f] cursor-pointer">
            <a href="#footer" onClick={(e) => handleNavClick(e, false, true)}>
              Contact
            </a>
          </li>
        </ul>
      )}

      {/* Hero section - Adjusted margins to remove extra space */}
      <div className="flex flex-col md:flex-row items-start justify-between px-8 md:px-12 lg:px-16 py-2 space-y-6 md:space-y-0 min-h-screen md:h-auto md:pt-36 lg:pt-24 pt-20 relative mb-8 mt-0">
        {/* Left content */}
        <div className="flex flex-col space-y-6 md:w-1/2">
          <h1 className="text-4xl md:text-2xl leading-none">
            <span className="text-[#164758] text-6xl">R</span>
            <span className="text-[#164758]">
              evolutionizing Education With
            </span>{" "}
            <span className="text-[#00965f] font-bold"> AI Powered </span>
            <span className="text-[#164758]">Solutions</span>
          </h1>
          <h2 className="text-lg md:text-2xl leading-none -mt-4 font-bold text-[#0e7249] md:pl-10">
            <span className="text-[#164758] text-xl">
              Turning Knowledge Into{" "}
              <span className="text-[#0e7249] text-xl">Career</span> Success
            </span>
          </h2>
          <div className="bg-white-0 backdrop-blur-md rounded-3xl p-6 md:p-8 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg text-[#164758] mb-4 flex items-center gap-2">
                <IoGlobeOutline className="text-2xl text-[#00965f] animate-spin-slow" />
                Select Your Location
              </h3>

              <div className="relative">
                {/* Location Selection Cards */}
                <div className="grid gap-4">
                  {/* Country Card */}
                  <div
                    onClick={() => {
                      setActiveSelection("country");
                      setIsCountryOpen(!isCountryOpen);
                      setIsStateOpen(false);
                    }}
                    className={`relative overflow-visible group cursor-pointer transform transition-all duration-300 z-[110] ${
                      activeSelection === "country"
                        ? "scale-105"
                        : "hover:scale-102"
                    }`}
                  >
                    <div
                      className={`
                      p-3 rounded-xl border-2 
                      ${
                        country
                          ? "border-[#00965f] bg-[#00965f]/5"
                          : "border-gray-200 bg-white"
                      } 
                      transition-all duration-300
                    `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${
                              country
                                ? "bg-[#00965f] text-white"
                                : "bg-gray-100 text-gray-400"
                            }
                            transition-all duration-300
                          `}
                          >
                            {country && countryFlags[country] ? (
                              <div className="w-5 h-4 rounded-sm overflow-hidden">
                                {React.createElement(countryFlags[country])}
                              </div>
                            ) : (
                              <FaMapMarkerAlt className="text-lg" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-600">
                              Country
                            </p>
                            <p
                              className={`font-medium text-sm ${
                                country ? "text-[#00965f]" : "text-gray-400"
                              }`}
                            >
                              {country || "Select Country"}
                            </p>
                          </div>
                        </div>
                        <MdKeyboardArrowDown
                          className={`
                          text-xl transition-transform duration-300
                          ${
                            isCountryOpen
                              ? "rotate-180 text-[#00965f]"
                              : "text-gray-400"
                          }
                        `}
                        />
                      </div>
                    </div>

                    {/* Dropdown Panel */}
                    {isCountryOpen && (
                      <>
                        <div
                          className="fixed inset-0 bg-black/20 z-[115]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsCountryOpen(false);
                          }}
                        />
                        <div className="absolute z-[120] left-0 right-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 animate-slideDown">
                          <div className="p-2 max-h-48 overflow-y-auto">
                            {Object.keys(countryStateData).map((c) => {
                              const FlagComponent = countryFlags[c];
                              return (
                                <div
                                  key={c}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCountry(c);
                                    setState("");
                                    setIsCountryOpen(false);
                                    setActiveSelection("state");
                                  }}
                                  className={`
                                    p-3 rounded-lg flex items-center gap-3 cursor-pointer
                                    ${
                                      country === c
                                        ? "bg-[#00965f] text-white"
                                        : "hover:bg-gray-50"
                                    }
                                    transition-colors duration-200
                                  `}
                                >
                                  {FlagComponent && (
                                    <div className="w-6 h-4 rounded-sm overflow-hidden">
                                      <FlagComponent />
                                    </div>
                                  )}
                                  <span>{c}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* State Card */}
                  <div
                    onClick={() => {
                      if (country) {
                        setActiveSelection("state");
                        setIsStateOpen(!isStateOpen);
                        setIsCountryOpen(false);
                      }
                    }}
                    className={`relative overflow-visible transition-all duration-300 z-[100] ${
                      !country ? "opacity-50" : "group cursor-pointer"
                    } ${
                      activeSelection === "state"
                        ? "scale-105"
                        : "hover:scale-102"
                    }`}
                  >
                    <div
                      className={`
                      p-3 rounded-xl border-2
                      ${
                        state
                          ? "border-[#00965f] bg-[#00965f]/5"
                          : "border-gray-200 bg-white"
                      }
                      transition-all duration-300
                    `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${
                              state
                                ? "bg-[#00965f] text-white"
                                : "bg-gray-100 text-gray-400"
                            }
                            transition-all duration-300
                          `}
                          >
                            <IoLocationOutline className="text-lg" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-600">
                              State
                            </p>
                            <p
                              className={`font-medium text-sm ${
                                state ? "text-[#00965f]" : "text-gray-400"
                              }`}
                            >
                              {state || "Select State"}
                            </p>
                          </div>
                        </div>
                        <MdKeyboardArrowDown
                          className={`
                          text-xl transition-transform duration-300
                          ${
                            isStateOpen
                              ? "rotate-180 text-[#00965f]"
                              : "text-gray-400"
                          }
                        `}
                        />
                      </div>
                    </div>

                    {/* State Dropdown Panel */}
                    {isStateOpen && country && (
                      <>
                        <div
                          className="fixed inset-0 bg-black/20 z-[105]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsStateOpen(false);
                          }}
                        />
                        <div className="absolute z-[110] left-0 right-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 animate-slideDown">
                          <div className="p-2 max-h-48 overflow-y-auto">
                            {states.map((s) => (
                              <div
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setState(s);
                                  setIsStateOpen(false);
                                }}
                                className={`
                                  p-3 rounded-lg flex items-center gap-3 cursor-pointer
                                  ${
                                    state === s
                                      ? "bg-[#00965f] text-white"
                                      : "hover:bg-gray-50"
                                  }
                                  transition-colors duration-200
                                `}
                              >
                                <IoLocationOutline className="text-lg" />
                                {s}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00965f] text-white p-4 rounded-xl text-sm font-bold
                  hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00965f]/20
                  flex items-center justify-center gap-2"
              >
                <IoGlobeOutline className="text-xl" />
                Explore Courses
              </button>
            </form>
            <HorizontalRule />
          </div>
        </div>

        {/* Course slider - Adjusted bottom margin */}
        <div className="md:w-1/2 relative md:pl-8 mt-8 w-full mb-8">
          <div
            className="rounded-xl overflow-hidden bg-transparent cursor-pointer max-w-[500px] h-full mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={(e) => {
              if (!country || !state) {
                toast.error(
                  "Please select your location to access the course",
                  {
                    duration: 3000,
                    position: "top-right",
                    style: {
                      background: "#FEE2E2",
                      color: "#991B1B",
                      border: "1px solid #F87171",
                    },
                  }
                );
              } else {
                handleSubmit(e);
              }
            }}
          >
            <img
              src={courseSlides[currentSlide].image}
              alt={courseSlides[currentSlide].title}
              className="w-full h-48 md:h-64 object-cover rounded-t-xl"
            />
            <div className="p-4 md:p-6 bg-transparent rounded-b-xl">
              <h3 className="text-xl md:text-2xl font-bold text-[#2C3E50] mb-2">
                {courseSlides[currentSlide].title}
              </h3>
              <p className="text-[#34495E] mb-4 text-base md:text-lg line-clamp-2">
                {courseSlides[currentSlide].description}
              </p>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="bg-[#3498DB] text-white px-3 py-1 rounded-full">
                  {courseSlides[currentSlide].duration}
                </span>
                <span className="text-[#E74C3C] font-medium border-2 px-1">
                  {courseSlides[currentSlide].level}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation buttons  */}
          <div className="absolute top-1/2 -translate-y-1/2 w-[90%] hidden md:flex justify-between px-2 pointer-events-none">
            <button
              onClick={prevSlide}
              className="p-2 ml-10 rounded-full bg-white/20 hover:bg-white/50 shadow-lg transition-all pointer-events-auto"
              aria-label="Previous course"
            >
              <BsChevronLeft className="text-xl md:text-2xl text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 mr-4 rounded-full bg-white/20 hover:bg-white/50 shadow-lg transition-all pointer-events-auto"
              aria-label="Next course"
            >
              <BsChevronRight className="text-xl md:text-2xl text-gray-800" />
            </button>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {courseSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 3000);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 hover:bg-[#00965f]/70 ${
                  currentSlide === index ? "bg-[#00965f] w-4" : "bg-gray-300"
                }`}
                aria-label={`Go to course ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to your CSS/Tailwind config
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
        slideDown: "slideDown 0.2s ease-out",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      scale: {
        "102": "1.02",
      },
    },
  },
};

export default DropdownForm;
