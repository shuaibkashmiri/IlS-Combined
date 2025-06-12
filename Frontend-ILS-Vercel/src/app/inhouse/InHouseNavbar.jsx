"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { handleLogout } from "../../utils/logout";
import Image from "next/image";

const InHouseNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Get student data from localStorage
    const storedStudent = localStorage.getItem("inHouseStudent");
    if (storedStudent) {
      setStudentData(JSON.parse(storedStudent));
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  // Default navbar for non-logged in users
  if (!studentData) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#164758]">
                <img src="/logo.png" className="w-20" alt="" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/about")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                About
              </Link>
              <Link
                href="/services"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/services")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/contact")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00965f]"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/about"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/about")
                    ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                About
              </Link>
              <Link
                href="/services"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/services")
                    ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive("/contact")
                    ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Logged in navbar
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/inhouse"
                className="text-2xl font-bold text-[#164758]"
              >
                ILS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/inhouse/student/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/inhouse/student/dashboard")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/inhouse/student/courses"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/inhouse/student/courses")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                My Courses
              </Link>
              <Link
                href="/inhouse/student/exams"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/inhouse/student/exams")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Exams
              </Link>
              <Link
                href="/inhouse/student/certificates"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive("/inhouse/student/certificates")
                    ? "border-[#00965f] text-[#164758]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Certificates
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 text-gray-700 hover:text-[#164758] focus:outline-none"
              >
                <span className="text-sm font-medium">{studentData.name}</span>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#00965f]">
                  {studentData.profilePicture ? (
                    <Image
                      src={studentData.profilePicture}
                      alt={studentData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#00965f] flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      href="/inhouse/student/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <FaUser className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/inhouse/student/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <FaCog className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00965f]"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/inhouse/student/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/inhouse/student/dashboard")
                  ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/inhouse/student/courses"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/inhouse/student/courses")
                  ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              My Courses
            </Link>
            <Link
              href="/inhouse/student/exams"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/inhouse/student/exams")
                  ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Exams
            </Link>
            <Link
              href="/inhouse/student/certificates"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/inhouse/student/certificates")
                  ? "border-[#00965f] text-[#164758] bg-[#00965f]/10"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Certificates
            </Link>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#00965f]">
                    {studentData.profilePicture ? (
                      <Image
                        src={studentData.profilePicture}
                        alt={studentData.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#00965f] flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {studentData.name}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/inhouse/student/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/inhouse/student/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default InHouseNavbar;
