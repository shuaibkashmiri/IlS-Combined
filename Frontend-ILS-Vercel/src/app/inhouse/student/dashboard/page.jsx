"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInhouseStudentDetails } from "../../../../redux/features/inhouseSlice";
import { FaUser, FaBook, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { toast } from "sonner";

const InhouseStudentDashboard = () => {
  const dispatch = useDispatch();
  const { studentDetails, loading, error } = useSelector(
    (state) => state.inhouse
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Check if we have student details in localStorage
      const storedStudent = localStorage.getItem("inHouseStudent");
      if (!storedStudent) {
        // If not in localStorage, fetch from API
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

  // Get student data from either Redux state or localStorage
  const studentData =
    studentDetails || JSON.parse(localStorage.getItem("inHouseStudent"));

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No student data available</p>
      </div>
    );
  }

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
                <p className="text-sm font-medium text-gray-600">Next Class</p>
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
                    {Math.round((course.paidFee / course.finalPrice) * 100)}%
                    Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#00965f] h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${(course.paidFee / course.finalPrice) * 100}%`,
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

        {/* Personal Information */}
        <section>
          <h2 className="text-2xl font-bold text-[#164758] mb-6">
            Personal Information
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{studentData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{studentData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{studentData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parent/Guardian Name</p>
                <p className="font-medium">{studentData.parentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{studentData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">
                  {new Date(studentData.dob).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InhouseStudentDashboard;
