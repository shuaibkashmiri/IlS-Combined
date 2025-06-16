"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  FaUser,
  FaSignOutAlt,
  FaInfoCircle,
  FaGraduationCap,
  FaPhoneAlt,
  FaHome,
} from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";
import { clearState } from "@/redux/features/inhouseSlice";

const InHouseNavbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { studentDetails } = useSelector((state) => state.inhouse);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const studentData =
    studentDetails || JSON.parse(localStorage.getItem("inHouseStudent"));
  const isLoggedIn = !!studentData;

  const handleLogout = async () => {
    try {
      // Clear Redux state first
      dispatch(clearState());

      // Clear localStorage
      localStorage.removeItem("inHouseStudent");

      // Clear any cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Close the user menu
      setIsUserMenuOpen(false);

      // Show success message
      toast.success("Logged out successfully");

      // Use setTimeout to ensure state is cleared before navigation
      setTimeout(() => {
        router.push("/inhouse/student/login");
      }, 100);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/about", label: "About Us", icon: FaInfoCircle },
    { href: "/services", label: "Services", icon: FaGraduationCap },
    { href: "/contact", label: "Contact", icon: FaPhoneAlt },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => router.push("/")}
              className="focus:outline-none"
            >
              <Image
                src="/logo.png"
                alt="ILS Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#00965f]/10 text-[#164758]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#164758]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu or Login Button */}
          {isLoggedIn ? (
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-[#00965f]">
                    {studentData?.profileImage ? (
                      <Image
                        src={studentData.profileImage}
                        alt={studentData.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#00965f] flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {studentData?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {studentData?.name || "User"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          router.push("/inhouse/student/dashboard");
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        <FaUser className="mr-3 h-4 w-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        <FaSignOutAlt className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4"></div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default InHouseNavbar;
