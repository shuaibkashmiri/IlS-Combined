"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const InHouseNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    // Add logout logic here
    router.push("/inhouse/student/login");
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 px-4">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="ILS Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/inhouse/dashboard"
              className="text-gray-700 hover:text-[#00965f] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/inhouse/courses"
              className="text-gray-700 hover:text-[#00965f] transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/inhouse/profile"
              className="text-gray-700 hover:text-[#00965f] transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FaUser className="text-gray-600" />
                <span className="font-medium hidden md:inline">Student</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <button
                    onClick={() => {
                      router.push("/inhouse/profile");
                      setShowUserMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#00965f] hover:text-white w-full text-left"
                  >
                    <FaUser className="mr-2" />
                    Profile
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 backdrop-blur-sm bg-white/30 z-50"
            onClick={toggleMobileMenu}
          >
            <div
              className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <button
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-end w-full"
                >
                  <FaTimes size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <Link
                  href="/inhouse/dashboard"
                  className="block text-gray-700 hover:text-[#00965f] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/inhouse/courses"
                  className="block text-gray-700 hover:text-[#00965f] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  href="/inhouse/profile"
                  className="block text-gray-700 hover:text-[#00965f] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-[#00965f] py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-[80px]"></div>
    </>
  );
};

export default InHouseNavbar;
