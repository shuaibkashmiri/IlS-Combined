"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "../../../redux/features/userSlice";
import {
  getAllCourses,
  getSingleCourse,
} from "../../../redux/features/courseSlice";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaTachometerAlt,
  FaSignOutAlt,
  FaSearch,
  FaChevronRight,
  FaGlobe,
} from "react-icons/fa";
import AuthModal from "./authModal";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const { user } = useSelector((state) => state.user);
  const { courses } = useSelector((state) => state.courses);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(getAllCourses());
    console.log("Courses:", courses);
    console.log("User:", user);
  }, [dispatch]);

  const handleCourseClick = async (course) => {
    if (!user) {
      setSelectedCourse(course);
      setShowModal(true);
      setActiveDropdown(null);
      setMobileMenuOpen(false);
      return;
    }

    try {
      await dispatch(getSingleCourse(course._id)).unwrap();

      // Check if user is enrolled in this course
      const isEnrolled = user.enrolledCourses?.some(
        (enrolledCourse) => enrolledCourse.courseId === course._id
      );

      console.log("Course ID:", course._id);
      console.log("User Enrolled Courses:", user.enrolledCourses);
      console.log("Is Enrolled:", isEnrolled);

      // Navigate based on enrollment status
      if (isEnrolled) {
        router.push(`/banglore/full-courses/${course._id}`);
      } else {
        router.push("/banglore/demo-videos");
      }

      // Clear UI states
      setActiveDropdown(null);
      setMobileMenuOpen(false);
      setSearchQuery("");
      setShowSearchResults(false);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setSelectedCourse(null);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/banglore");
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/banglore/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(true);

    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      const filtered = courses?.filter((course) => {
        const titleMatch = course.title?.toLowerCase().includes(searchTerm);
        const descriptionMatch = course.description
          ?.toLowerCase()
          .includes(searchTerm);
        const categoryMatch = course.category
          ?.toLowerCase()
          .includes(searchTerm);

        return titleMatch || descriptionMatch || categoryMatch;
      });
      setSearchResults(filtered || []);
    } else {
      setSearchResults(courses || []);
    }
  };

  const getCategories = () => {
    const categories = courses?.map((course) => course.category) || [];
    return [...new Set(categories)]; // Get unique categories
  };

  const getCoursesByCategory = (category) => {
    return courses?.filter((course) => course.category === category) || [];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown &&
        !event.target.closest("#courses-dropdown") &&
        !event.target.closest("button")
      ) {
        setActiveDropdown(null);
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 px-4">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link href="/banglore" className="flex items-center">
            <img src="/logo.png" alt="ILS Logo" className="h-12 w-auto" />
          </Link>

          {/* navbar links */}
          <div className="hidden md:flex space-x-6 items-center">
            {/* Explore Dropdown */}
            <div className="relative group ml-4">
              <button
                onClick={() => toggleDropdown("Explore")}
                className={`flex items-center space-x-1 px-4 py-2 rounded transition-colors ${activeDropdown === "Explore" ? "text-[#164758] font-medium bg-gray-100" : "hover:text-[#164758]"}`}
              >
                <span>Explore</span>
                <FaChevronDown size={12} className={`transform transition-transform duration-200 ${activeDropdown === "Explore" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "Explore" && (
                <div className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
                  <Link href="/banglore/courses" className="block px-4 py-2 hover:bg-gray-100">All Courses</Link>
                  <Link href="/banglore/courses/category/technology" className="block px-4 py-2 hover:bg-gray-100">Technology</Link>
                  <Link href="/banglore/courses/category/business" className="block px-4 py-2 hover:bg-gray-100">Business</Link>
                  <Link href="/banglore/courses/category/design" className="block px-4 py-2 hover:bg-gray-100">Design</Link>
                </div>
              )}
            </div>
            <Link href="/banglore/plans" className="px-4 py-2 rounded hover:text-[#164758]">Plans & Pricing</Link>
          </div>

          {/* Centered Search bar */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-full max-w-xl">
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Find your next course by skill, topic, or instructor"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={() => {
                      setTimeout(() => setShowSearchResults(false), 200);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent w-full text-sm bg-[#f7f9fa]"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </form>
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute mt-2 w-full bg-white border rounded-md shadow-lg max-h-[70vh] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map((course) => (
                      <button
                        key={course._id}
                        onClick={() => {
                          handleCourseClick(course);
                          setSearchQuery("");
                          setShowSearchResults(false);
                        }}
                        className="block w-full px-4 py-3 text-left hover:bg-gray-100 border-b last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {course.category}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No courses found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cart, Language, Login/Signup Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Icon */}
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
              <FaGlobe className="text-xl text-gray-600" />
            </button>
            {/* Login/Signup Buttons */}
            {!user ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="px-6 py-2 rounded-md font-medium bg-[#00965f] text-white hover:bg-[#164758] transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="px-6 py-2 rounded-md font-medium bg-[#00965f] text-white hover:bg-[#164758] transition"
                >
                  Sign up
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <button
                      onClick={() => {
                        router.push("/banglore/instructor/login");
                        setShowUserMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#164758] hover:text-white w-full text-left"
                    >
                      Login as Instructor
                    </button>
                    <button
                      onClick={() => {
                        toggleModal();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#164758] hover:text-white w-full text-left"
                    >
                      Login as User
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                {/* Desktop View */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaUser className="text-gray-600" />
                  <span className="font-medium">{user.email}</span>
                  <FaChevronDown size={12} />
                </button>

                {/* Mobile View */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaUser className="text-gray-600 text-lg" />
                </button>

                {/* User Dropdown Menu - Updated for both mobile and desktop */}
                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border
                      ${window.innerWidth < 768 ? "right-0" : "right-0"}`}
                  >
                    {/* Show email only in mobile view */}
                    <div className="md:hidden px-4 py-2 border-b">
                      <p className="text-sm text-gray-600 font-medium truncate">
                        {user.email}
                      </p>
                    </div>
                    {/* <button
                      onClick={() => {
                        router.push("/banglore/dashboard");
                        setShowUserMenu(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#164758] hover:text-white w-full text-left"
                    >
                      <FaTachometerAlt className="mr-2" />
                      Dashboard
                    </button> */}

<button
  onClick={() => {
    if (user?.role === "instructor") {
      router.push("/banglore/instructor");
    } else {
      router.push("/banglore/dashboard");
    }
    setShowUserMenu(false);
  }}
  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#164758] hover:text-white w-full text-left"
>
  <FaTachometerAlt className="mr-2" />
  Dashboard
</button>


                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#00965f] hover:text-white w-full text-left"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button - Move this after the user icon */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t mt-4 p-4 space-y-4">
            {/* Add Search Bar for Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={() => {
                    setTimeout(() => setShowSearchResults(false), 200);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowSearchResults(true);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </form>

            {/* Mobile Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-2 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => {
                      handleCourseClick(course);
                      setSearchQuery("");
                      setShowSearchResults(false);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{course.title}</p>
                        {course.price && (
                          <p className="text-xs text-gray-500">
                            ₹{course.price.$numberDecimal}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {[
              { name: "Home", path: "/banglore" },
              { name: "About", path: "/banglore/about" },
              { name: "Contact", path: "/banglore/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block hover:text-[#164758]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Courses Dropdown in Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown("Courses")}
                className="flex items-center space-x-1 hover:text-[#164758] w-full"
              >
                <span>Courses</span>
                <FaChevronDown size={12} />
              </button>
              {activeDropdown === "Courses" && (
                <div className="mt-2 bg-white border rounded-md shadow-md">
                  {getCategories().map((category) => (
                    <div key={category}>
                      <button
                        onClick={() =>
                          setActiveCategory(
                            activeCategory === category ? null : category
                          )
                        }
                        className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 border-b"
                      >
                        <span className="font-medium">{category}</span>
                        <FaChevronDown
                          size={12}
                          className={`transform transition-transform ${
                            activeCategory === category ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeCategory === category && (
                        <div className="bg-gray-50">
                          {getCoursesByCategory(category).map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleCourseClick(course)}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              <div className="flex items-center space-x-2">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-8 h-8 object-cover rounded"
                                />
                                <div>
                                  <p className="text-sm">{course.title}</p>
                                  {course.price && (
                                    <p className="text-xs text-gray-500">
                                      ₹{course.price.$numberDecimal}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Update mobile menu user section */}
            {user && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    router.push("/banglore/dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
      <div className="h-[80px]"></div>

      {/* Auth Modal with selected course */}
      <AuthModal
        showModal={showModal}
        toggleModal={toggleModal}
        selectedCourse={selectedCourse}
        fromDemoClass={true}
      />
    </>
  );
};

export default Navbar;
