"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses, getSingleCourse } from "@/redux/features/courseSlice";
import AuthModal from "./authModal";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { FaPhone, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "sonner";
import boyImg from "@/app/assets/bgBoy3.png";
// Counter component
const Counter = ({ end, duration = 2000, type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        const nextCount = Math.min(
          Math.floor((progress / duration) * end),
          end
        );
        setCount(nextCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-400 px-4 py-2 hover:border-[#00965f] transition-colors duration-300">
      {type === "students" ? (
        <FaUserGraduate className="text-[#00965f] text-xl" />
      ) : (
        <FaChalkboardTeacher className="text-[#00965f] text-xl" />
      )}
      <div className="flex flex-col">
        <span className="font-bold text-[#00965f] text-lg">{count}+</span>
        <span className="text-xs text-gray-600">
          {type === "students" ? "Students" : "Trainers"}
        </span>
      </div>
    </div>
  );
};

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 -mr-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#00965f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 -ml-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#00965f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

// Update the categorySliderSettings
const categorySliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToScroll: 1,
  variableWidth: true,
  arrows: true,
  nextArrow: <CategoryNextArrow />,
  prevArrow: <CategoryPrevArrow />,
  autoplay: false,
  swipeToSlide: true,
  centerMode: false,
  responsive: [
    {
      breakpoint: 640,
      settings: {
        swipeToSlide: true,
        infinite: true,
        variableWidth: true,
        arrows: true,
      },
    },
  ],
};

// Update the CategoryNextArrow and CategoryPrevArrow styles
function CategoryNextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow-sm hover:bg-white transition-all duration-200 sm:-mr-4 -mr-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-[#00965f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

function CategoryPrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1 rounded-full shadow-sm hover:bg-white transition-all duration-200 sm:-ml-4 -ml-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-[#00965f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

// Add this CSS to ensure single row
<style>
  {`
  .category-slider .slick-track {
    display: flex !important;
    gap: 0.5rem;
    margin-left: 0 !important;
  }
  .category-slider .slick-slide {
    height: auto;
    opacity: 1 !important;
    width: auto !important;
  }
  .category-slider .slick-slide > div {
    height: 100%;
  }
  `}
</style>;

// Helper function to format rating display
const formatRating = (rating) => Number(rating).toFixed(1);

export default function DemoClassesGrid() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector(
    (state) => state.courses || {}
  );
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  const [visibleCourses, setVisibleCourses] = useState(10); // Default to 10 for SSR safety

  useEffect(() => {
    // Set visibleCourses based on window width (client-side only)
    if (typeof window !== 'undefined') {
      setVisibleCourses(window.innerWidth < 640 ? 4 : 10);
    }
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCourses(window.innerWidth < 640 ? 4 : 10);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  const visibleFilteredCourses = filteredCourses.slice(0, visibleCourses);

  const handleWatchDemo = async (course) => {
    try {
      await dispatch(getSingleCourse(course._id)).unwrap();

      if (!user) {
        setSelectedCourse(course);
        setShowAuthModal(true);
        return;
      }

      // Check if user is enrolled in this course
      const isEnrolled = user.enrolledCourses?.some(
        (enrolledCourse) => enrolledCourse.courseId === course._id
      );

      if (isEnrolled) {
        // If enrolled, navigate to full course
        router.push(`/banglore/courses/${course._id}`);
      } else {
        // If not enrolled, navigate to demo videos
        router.push("/banglore/demo-videos", { state: { course } });
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to load course details");
    }
  };

  const handleLoadMore = () => {
    const increment = window.innerWidth < 640 ? 4 : 10;
    setVisibleCourses((prev) => prev + increment);
  };

  // Update the slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Watch Our Free Demo Classes
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Experience quality learning with our expert instructors.
          </p>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 bg-gray-100 text-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full pb-8 sm:pb-12 bg-gray-100">
        <div className="flex w-full flex-col mt-0 bg-gray/10 backdrop-blur-md bg-gradient-to-t from-gray/80 to-gray/1 shadow-md py-3 px-4 justify-center items-center rounded-md">
          <div className="flex w-full flex-col lg:flex-row">
            <div className="flex flex-col justify-start items-start w-full lg:w-1/2">
              <div className="px-2 md:px-4">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-1 sm:mb-2 mt-3 sm:mt-5 lg:mt-10 text-left">
                  Master the Skills{" "}
                  <span className="text-[#00965f]">That Matter!</span>
                </h2>
                <p className="text-sm sm:text-md lg:text-lg font-medium text-gray-600 mb-4 sm:mb-6 lg:mb-8 text-left">
                  From basic beginner training to advanced technical expertise,
                  we've got you covered.
                </p>
              </div>

              <div className="relative w-full px-2 md:px-4">
                {(() => {
                  const uniqueCategories = [
                    "All",
                    ...new Set(courses.map((course) => course.category)),
                  ];
                  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
                  const shouldUseSlider =
                    isMobile || uniqueCategories.length > 6;

                  if (shouldUseSlider) {
                    return (
                      <Slider
                        {...categorySliderSettings}
                        className="category-slider"
                      >
                        {uniqueCategories.map((category) => (
                          <div key={category} className="!w-auto">
                            <button
                              onClick={() => handleCategoryClick(category)}
                              className={`relative transition duration-300 px-3 py-1 text-xs sm:text-sm lg:text-lg font-medium rounded-full whitespace-nowrap ${
                                category === "All"
                                  ? selectedCategory === "All"
                                    ? "text-[#00965f] font-bold"
                                    : "text-gray-800 hover:text-[#00965f]"
                                  : selectedCategory === category
                                  ? "bg-[#164758] text-white"
                                  : "bg-transparent text-gray-800 hover:text-[#00965f]"
                              }`}
                            >
                              {category}
                            </button>
                          </div>
                        ))}
                      </Slider>
                    );
                  }

                  return (
                    <div className="flex flex-nowrap gap-2 overflow-x-hidden">
                      {uniqueCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryClick(category)}
                          className={`relative transition duration-300 px-3 py-1 text-xs sm:text-sm lg:text-lg font-medium rounded-full whitespace-nowrap ${
                            category === "All"
                              ? selectedCategory === "All"
                                ? "text-[#00965f] font-bold"
                                : "text-gray-800 hover:text-[#00965f]"
                              : selectedCategory === category
                              ? "bg-[#164758] text-white"
                              : "bg-transparent text-gray-800 hover:text-[#00965f]"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="hidden lg:flex flex-row items-center ml-auto">
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row gap-2 mb-6 mt-6">
                  <Counter end={10000} type="students" />
                  <Counter end={200} type="trainers" />
                </div>

                <p className="text-md font-md text-gray-700 mb-4 text-center">
                  Need more support? We're here for you!
                </p>
                <button
                  onClick={() => router.push("/banglore/contact")}
                  className="bg-[#00965f] flex flex-row text-white px-6 py-2 rounded-md font-medium hover:bg-[#164758] transition"
                >
                  <span className="px-2">Contact Us</span>{" "}
                  <span className="mt-0.5">
                    <FaPhone />
                  </span>
                </button>
              </div>
              <img
                src={boyImg.src}
                alt="support"
                className="h-40 lg:h-50 w-auto object-contain self-end"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-10">
          {filteredCourses.length > 0 ? (
            <>
              {/* Mobile View - Grid Layout */}
              <div className="sm:hidden grid grid-cols-2 gap-3 py-4">
                {visibleFilteredCourses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleWatchDemo(course)}
                    className="cursor-pointer"
                  >
                    <div className="bg-white shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-100 hover:border-[#00965f]/30 flex flex-col h-full">
                      <div className="relative">
                        <div className="w-full h-20 overflow-hidden">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <div className="absolute top-2 right-2 bg-[#164758] text-white px-1 py-0.5 rounded-sm text-[10px] font-bold shadow-md">
                          ₹{course.price?.$numberDecimal || "Free"}
                        </div>
                      </div>

                      <div className="p-2 flex-1 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-gray-800 mb-1 line-clamp-1 hover:text-[#00965f] transition-colors">
                          {course.title}
                        </h3>

                        <div className="space-y-1 mb-2">
                          <div className="flex items-center justify-between text-[10px] text-gray-600">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1 text-[#00965f]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{course.duration || "8"}h</span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1 text-[#00965f]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="truncate max-w-[80px]">
                                {course.instructor_id?.fullname ||
                                  "Expert Instructor"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-2 w-2 ${
                                    i < Math.floor(course.rating || 4.5)
                                      ? "text-yellow-400"
                                      : i < (course.rating || 4.5)
                                      ? "text-yellow-400 opacity-50"
                                      : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              {Number(course.rating || 4.5).toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({Math.floor(Math.random() * 1000 + 500)})
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-[#00965f] text-white py-1 px-2 hover:bg-[#164758] transition-colors text-[10px] font-medium flex items-center justify-center gap-1 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Watch
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {visibleCourses < filteredCourses.length && (
                  <div
                    onClick={handleLoadMore}
                    className="col-span-2 mt-4 flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300 border border-[#00965f]/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#00965f] group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 mt-2 group-hover:text-[#00965f] transition-colors duration-300">
                      Load More
                    </span>
                  </div>
                )}
              </div>

              {/* Desktop View - Slider */}
              <div className="hidden sm:block">
                {filteredCourses.length > 4 ? (
                  <Slider {...settings} className="py-4">
                    {filteredCourses.map((course) => (
                      <div key={course._id} className="px-2">
                        <div
                          onClick={() => handleWatchDemo(course)}
                          className="bg-white shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-100 hover:border-[#00965f]/30 flex flex-col h-full cursor-pointer"
                        >
                          <div className="relative">
                            <div className="w-full h-24 sm:h-32 overflow-hidden">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            </div>
                            <div className="absolute top-2 right-2 bg-[#164758] text-white px-1 sm:px-2 py-0.5 rounded-sm text-[10px] sm:text-xs font-bold shadow-md">
                              ₹{course.price?.$numberDecimal || "Free"}
                            </div>
                          </div>

                          <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 line-clamp-1 hover:text-[#00965f] transition-colors">
                              {course.title}
                            </h3>

                            <div className="space-y-1 mb-2">
                              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600">
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1 text-[#00965f]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>{course.duration || "8"}h</span>
                                </div>
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1 text-[#00965f]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  <span className="truncate max-w-[100px]">
                                    {course.instructor_id?.fullname ||
                                      "Expert Instructor"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(course.rating || 4.5)
                                          ? "text-yellow-400"
                                          : i < (course.rating || 4.5)
                                          ? "text-yellow-400 opacity-50"
                                          : "text-gray-300"
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {Number(course.rating || 4.5).toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({Math.floor(Math.random() * 1000 + 500)})
                                </span>
                              </div>
                            </div>

                            <div className="w-full bg-[#00965f] text-white py-1 sm:py-1.5 px-2 sm:px-3 hover:bg-[#164758] transition-colors text-[10px] sm:text-xs font-medium flex items-center justify-center gap-1 pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 sm:h-4 sm:w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Watch Demo
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {filteredCourses.map((course) => (
                      <div key={course._id} className="px-4">
                        <div
                          onClick={() => handleWatchDemo(course)}
                          className="bg-white shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-100 hover:border-[#00965f]/30 flex flex-col h-full cursor-pointer"
                        >
                          <div className="relative">
                            <div className="w-full h-24 sm:h-32 overflow-hidden">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            </div>
                            <div className="absolute top-2 right-2 bg-[#164758] text-white px-1 sm:px-2 py-0.5 rounded-sm text-[10px] sm:text-xs font-bold shadow-md">
                              ₹{course.price?.$numberDecimal || "Free"}
                            </div>
                          </div>

                          <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 line-clamp-1 hover:text-[#00965f] transition-colors">
                              {course.title}
                            </h3>

                            <div className="space-y-1 mb-2">
                              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600">
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1 text-[#00965f]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>{course.duration || "8"}h</span>
                                </div>
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1 text-[#00965f]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  <span className="truncate max-w-[100px]">
                                    {course.instructor_id?.fullname ||
                                      "Expert Instructor"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(course.rating || 4.5)
                                          ? "text-yellow-400"
                                          : i < (course.rating || 4.5)
                                          ? "text-yellow-400 opacity-50"
                                          : "text-gray-300"
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {Number(course.rating || 4.5).toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  ({Math.floor(Math.random() * 1000 + 500)})
                                </span>
                              </div>
                            </div>

                            <div className="w-full bg-[#00965f] text-white py-1 sm:py-1.5 px-2 sm:px-3 hover:bg-[#164758] transition-colors text-[10px] sm:text-xs font-medium flex items-center justify-center gap-1 pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 sm:h-4 sm:w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Watch Demo
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No courses available in this category.
              </p>
              <button
                onClick={() => handleCategoryClick("All")}
                className="mt-4 px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#164758] transition-colors"
              >
                View All Courses
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        showModal={showAuthModal}
        toggleModal={() => setShowAuthModal(false)}
        selectedCourse={selectedCourse}
        fromDemoClass={true}
      />
    </>
  );
}
