"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInhouseStudentDetails } from "@/redux/features/inhouseSlice";
import {
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaGraduationCap,
  FaCertificate,
} from "react-icons/fa";
import { toast } from "sonner";

const InhouseStudentDashboard = () => {
  const dispatch = useDispatch();
  const { studentDetails, loading, error } = useSelector(
    (state) => state.inhouse
  );
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const storedStudent = localStorage.getItem("inHouseStudent");
      if (!storedStudent) {
        dispatch(getInhouseStudentDetails())
          .unwrap()
          .catch((error) => {
            toast.error(error.message || "Failed to fetch student details");
          });
      }
    }
  }, [dispatch, mounted]);

  if (!mounted) return null;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00965f]"></div>
      </div>
    );
  }

  const studentData =
    studentDetails || JSON.parse(localStorage.getItem("inHouseStudent"));

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No student data available</p>
      </div>
    );
  }

  // Navigation tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: FaChartLine },
    { id: "courses", label: "My Courses", icon: FaBook },
    { id: "exams", label: "Exams", icon: FaCalendarAlt },
    { id: "certificates", label: "Certificates", icon: FaCertificate },
  ];

  // Render different sections based on active tab
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Enrolled Courses
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {studentData.myCourses?.length || 0}
                    </h3>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <FaBook className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Overall Progress
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {studentData.overallProgress || 0}%
                    </h3>
                  </div>
                  <div className="bg-[#00965f]/10 p-4 rounded-xl">
                    <FaChartLine className="h-6 w-6 text-[#00965f]" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Next Class
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {studentData.nextClass || "Not Scheduled"}
                    </h3>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <FaCalendarAlt className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {studentData.status || "Active"}
                    </h3>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <FaUser className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#164758] mb-6">
                Course Progress
              </h2>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {studentData.myCourses?.map((course, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {course.course?.title}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {Math.round((course.paidFee / course.finalPrice) * 100)}
                        % Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#00965f] h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (course.paidFee / course.finalPrice) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-600">
                      <span>Paid: ₹{course.paidFee?.toLocaleString()}</span>
                      <span>Total: ₹{course.finalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );

      case "courses":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#164758] mb-6">
              My Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentData.myCourses?.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={course.course?.thumbnail}
                      alt={course.course?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {course.course?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {course.course?.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#00965f]">
                        {Math.round((course.paidFee / course.finalPrice) * 100)}
                        % Complete
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{course.finalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "exams":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#164758] mb-6">
              Upcoming Exams
            </h2>
            <div className="space-y-4">
              {studentData.myCourses?.map((course, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {course.course?.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Next Exam</p>
                      <p className="font-medium">Not Scheduled</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Last Exam Score</p>
                      <p className="font-medium">-</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certificates":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#164758] mb-6">
              My Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentData.myCourses?.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {course.course?.title}
                    </h3>
                    <FaGraduationCap className="h-6 w-6 text-[#00965f]" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {Math.round((course.paidFee / course.finalPrice) * 100) >=
                    100
                      ? "Certificate Available"
                      : "Complete course to get certificate"}
                  </p>
                  {Math.round((course.paidFee / course.finalPrice) * 100) >=
                    100 && (
                    <button className="w-full bg-[#00965f] text-white py-2 rounded-md hover:bg-[#008551] transition-colors">
                      Download Certificate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#164758] mb-2">
            Welcome, {studentData.name}!
          </h1>
          <p className="text-gray-600">Here's your learning dashboard</p>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeSection === tab.id
                        ? "border-[#00965f] text-[#164758]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Section */}
        {renderSection()}
      </div>
    </div>
  );
};

export default InhouseStudentDashboard;
