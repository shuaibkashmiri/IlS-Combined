"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaBook, FaRupeeSign, FaGraduationCap } from "react-icons/fa";
import { getAllCoursesforAdmin } from "../../../redux/features/courseSlice";
import IsAdmin from "../../../auth/Admin";
import { getAllUsers } from "../../../redux/features/userSlice";

function AdminDashboard() {
  IsAdmin();
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(getAllCoursesforAdmin());
  }, [dispatch]);

  // Calculate statistics
  const totalStudents =
    courses?.reduce(
      (acc, course) => acc + (course.enrolledStudents?.length || 0),
      0
    ) || 0;
  const totalRevenue =
    courses?.reduce(
      (acc, course) =>
        acc +
        (course.enrolledStudents?.length || 0) *
          (course.price?.$numberDecimal || course.price || 0),
      0
    ) || 0;
  const totalCourses = courses?.length || 0;

  // Prepare data for enrollment chart
  const enrollmentData =
    courses?.map((course) => ({
      name: course.title,
      students: course.enrolledStudents?.length || 0,
    })) || [];

  // Prepare data for revenue by category
  const categoryData =
    courses?.reduce((acc, course) => {
      const category = course.category || "Uncategorized";
      const revenue =
        (course.enrolledStudents?.length || 0) *
        (course.price?.$numberDecimal || course.price || 0);

      if (!acc[category]) {
        acc[category] = revenue;
      } else {
        acc[category] += revenue;
      }
      return acc;
    }, {}) || {};

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Colors for pie chart
  const COLORS = ["#00965f", "#164758", "#38a169", "#2c7a7b", "#319795"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00965f]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {totalStudents.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-[#00965f]/10 rounded-lg">
              <FaUsers className="text-[#00965f] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {totalCourses.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-[#00965f]/10 rounded-lg">
              <FaBook className="text-[#00965f] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-[#00965f]/10 rounded-lg">
              <FaRupeeSign className="text-[#00965f] text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Avg. Students/Course
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {totalCourses ? (totalStudents / totalCourses).toFixed(1) : 0}
              </p>
            </div>
            <div className="p-3 bg-[#00965f]/10 rounded-lg">
              <FaGraduationCap className="text-[#00965f] text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Course Enrollments
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="students" fill="#00965f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#00965f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Enrollments
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses
                  .flatMap((course) =>
                    (course.enrolledStudents || []).map((student) => ({
                      student,
                      course: course.title,
                      date: student.enrollmentDate,
                    }))
                  )
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((enrollment, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
