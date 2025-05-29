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
      "https://onlineinfatuation.com/wp-content/uploads/2024/06/Digital-Marketing-services-1.png",
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

const features = [
  {
    icon: (
      <svg
        className="w-10 h-10 text-[#00965f]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 20l9-5-9-5-9 5 9 5z" />
        <path d="M12 12V4l9 5-9 5-9-5 9-5z" />
      </svg>
    ),
    title: "AI-Powered Learning",
    desc: "Personalized content and smart recommendations.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-[#164758]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "24/7 Support",
    desc: "Always here to help you succeed.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-[#00965f]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M17 20h5v-2a4 4 0 0 0-3-3.87" />
        <path d="M9 20H4v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Global Community",
    desc: "Connect and collaborate with peers worldwide.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-[#164758]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
      </svg>
    ),
    title: "Flexible Schedules",
    desc: "Learn at your own pace, anytime.",
  },
];

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

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
    // Close modal before navigating
    setIsLocationModalOpen(false);

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

  const handleNavClick = (item) => {
    setActiveLink(item);
    setIsMenuOpen(false);

    if (item === "Contact") {
      const footer = document.querySelector("footer"); // Assuming your footer has a <footer> tag or a specific class/id
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
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
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center">
      {/* Modern Navbar (Content of original, design of image) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-6 text-gray-700">
            {["Home", "About Us", "Contact"].map((item) => (
              <li key={item} className="text-sm font-medium">
                <a
                  href={
                    item === "Home"
                      ? "#"
                      : `#${item.replace(/\s+/g, "").toLowerCase()}`
                  }
                  className={`transition-colors duration-200 ${
                    activeLink === item
                      ? "bg-[#00965f] text-white px-4 py-1.5 rounded-md"
                      : "hover:text-[#00965f]"
                  }`}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-xl text-[#164758]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span>{isMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-14 left-0 w-full bg-white shadow-lg transition-all duration-300 ${
            isMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible overflow-hidden"
          }`}
        >
          <ul className="flex flex-col items-center space-y-3 text-sm font-medium text-gray-700 py-3">
            {["Home", "About Us", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={
                    item === "Home"
                      ? "#"
                      : `#${item.replace(/\s+/g, "").toLowerCase()}`
                  }
                  className={`transition-colors duration-200 w-full text-center py-2 ${
                    activeLink === item
                      ? "bg-[#00965f] text-white rounded-md"
                      : "hover:text-[#00965f]"
                  }`}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="h-14 w-full" />

      {/* Hero Section (Inspired by image) */}
      <div className="relative w-full max-w-7xl mx-auto  px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Left Side (Illustration and Shape) */}
        <div className="flex-1 flex justify-center md:justify-start items-center relative">
          {/* Curved Shape */}
          {/* <div className="relative w-80 h-80 md:w-[600px] md:h-[500px] bg-white rounded-tl-[80px] rounded-br-[80px] rounded-tr-md shadow-lg">
          
          </div> */}
          {/* Illustration Image positioned on the shape */}
          <img
            src="/hero-image.png"
            alt="Illustration"
            className=" w-80 pt-0 mt-0 h-72 md:w-full md:h-[600px] "
          />
        </div>
        {/* Right Side (Headline, Buttons, and Courses Grid) */}
        <div className="flex-1 flex flex-col">
          {/* Headline and Buttons */}
          <div className="text-center md:text-left  mb-2">
            <div className="text-[#00965f] w-fit p-1 rounded-lg text-xs bg-gray-300 font-semibold mb-2">
              Online Education
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#164758] mb-4 leading-tight">
              Revolutionizing Education With <br className="hidden md:inline" />
              <span className="text-[#00965f]">AI Powered </span>
              Solutions
            </h1>
            <p className="text-gray-600 mb-6">
              At ILS Imperia, we understand that every student is unique and so
              are their learning needs. Our mission is to match students with
              experienced and caring home tutors who will provide personalized
              support, inspire confidence and ignite a passion for learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="bg-[#00965f] text-white px-6 py-2 h-12 rounded-lg font-bold shadow-md hover:bg-[#0e7249] transition-colors duration-200 text-md flex items-center justify-center"
              >
                GET STARTED
                <span className="ml-2 text-xl pb-1">»</span>
              </button>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="bg-transparent h-12 text-gray-700 border-2 border-gray-300 px-8 py-2 rounded-md font-bold hover:bg-gray-100 transition-colors duration-200 text-lg flex items-center justify-center"
              >
                Explore Courses
                <span className="ml-2 text-xl">»</span>
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-[#164758] text-center md:text-left">
                Our Popular Courses
              </h2>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="text-[#00965f] text-sm font-semibold hover:text-[#0e7249] transition-colors duration-200 flex items-center gap-1"
              >
                See All
                <span className="text-xl">»</span>
              </button>
            </div>
            <div className="flex gap-2 items-center">
              {courseSlides.map((course, idx) => (
                <div
                  key={idx}
                  onClick={() => setIsLocationModalOpen(true)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-2 flex flex-col group hover:scale-105 cursor-pointer w-[140px]"
                >
                  <div className="w-full h-18 rounded-md overflow-hidden mb-1.5">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-[#164758] mb-1 text-center">
                    {course.title}
                  </h3>
                  <div className="flex justify-center gap-1 text-[9px]">
                    <span className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded-full font-semibold">
                      {course.duration}
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded-full font-semibold">
                      {course.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Selection Modal */}
      {isLocationModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-opacity-50 "
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setIsLocationModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-[#164758] mb-6 text-center flex items-center gap-2 justify-center">
              <IoGlobeOutline className="text-2xl text-[#00965f] animate-spin-slow" />
              Select Your Location
            </h3>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Country Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#164758] mb-1">
                  Country
                </label>
                <div
                  onClick={() => {
                    setActiveSelection("country");
                    setIsCountryOpen(!isCountryOpen);
                    setIsStateOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-md border border-gray-300 cursor-pointer transition-colors duration-200 ${
                    country ? "border-[#00965f]" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        country
                          ? "bg-[#00965f] text-white"
                          : "bg-gray-200 text-gray-600"
                      } transition-all duration-300`}
                    >
                      {country && countryFlags[country] ? (
                        <span className="w-4 h-3 rounded-sm overflow-hidden">
                          {React.createElement(countryFlags[country])}
                        </span>
                      ) : (
                        <FaMapMarkerAlt className="text-sm" />
                      )}
                    </span>
                    <span
                      className={`font-medium text-sm ${
                        country ? "text-[#164758]" : "text-gray-500"
                      }`}
                    >
                      {country || "Select Country"}
                    </span>
                  </div>
                  <MdKeyboardArrowDown
                    className={`text-xl transition-transform duration-300 ${
                      isCountryOpen
                        ? "rotate-180 text-[#00965f]"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                {/* Dropdown Panel */}
                {isCountryOpen && (
                  <div className="absolute z-10 left-0 right-0 w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 animate-slideDown">
                    <div className="p-1 max-h-40 overflow-y-auto">
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
                            className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${
                              country === c
                                ? "bg-[#00965f] text-white"
                                : "hover:bg-gray-100"
                            } transition-colors duration-200`}
                          >
                            {FlagComponent && (
                              <span className="w-5 h-3 rounded-sm overflow-hidden">
                                {React.createElement(FlagComponent)}
                              </span>
                            )}
                            <span>{c}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* State Dropdown */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[#164758] mb-1">
                  State
                </label>
                <div
                  onClick={() => {
                    if (country) {
                      setActiveSelection("state");
                      setIsStateOpen(!isStateOpen);
                      setIsCountryOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-md border border-gray-300 transition-colors duration-200 ${
                    state ? "border-[#00965f]" : ""
                  } ${
                    !country
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        state
                          ? "bg-[#00965f] text-white"
                          : "bg-gray-200 text-gray-600"
                      } transition-all duration-300`}
                    >
                      <IoLocationOutline className="text-sm" />
                    </span>
                    <span
                      className={`font-medium text-sm ${
                        state ? "text-[#164758]" : "text-gray-500"
                      }`}
                    >
                      {state || "Select State"}
                    </span>
                  </div>
                  <MdKeyboardArrowDown
                    className={`text-xl transition-transform duration-300 ${
                      isStateOpen
                        ? "rotate-180 text-[#00965f]"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                {/* State Dropdown Panel */}
                {isStateOpen && country && (
                  <div className="absolute z-10 left-0 right-0 w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 animate-slideDown">
                    <div className="p-1 max-h-40 overflow-y-auto">
                      {states.map((s) => (
                        <div
                          key={s}
                          onClick={(e) => {
                            e.stopPropagation();
                            setState(s);
                            setIsStateOpen(false);
                          }}
                          className={`p-2 rounded-md flex items-center gap-2 cursor-pointer ${
                            state === s
                              ? "bg-[#00965f] text-white"
                              : "hover:bg-gray-100"
                          } transition-colors duration-200`}
                        >
                          <IoLocationOutline className="text-sm" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#00965f] text-white p-3 rounded-md font-bold shadow hover:bg-[#0e7249] transition-colors duration-200 text-base"
              >
                <IoGlobeOutline className="text-xl mr-2 inline-block align-middle" />
                Explore Courses
              </button>
            </form>
            <HorizontalRule />
          </div>
        </div>
      )}
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
