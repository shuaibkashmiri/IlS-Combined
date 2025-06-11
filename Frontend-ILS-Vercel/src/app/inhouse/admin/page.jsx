"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfflineCourses, fetchOfflineStudents } from "../../../redux/features/inhouseSlice";
import { FaBook, FaUsers, FaSignOutAlt, FaChartLine, FaCalendarAlt, FaGraduationCap, FaFilter } from "react-icons/fa";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00965f]"></div>
  </div>
);

// Main component with dynamic import and SSR disabled
const InhouseAdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { offlineCourses = [], offlineStudents = [], error } = useSelector((state) => state.inhouse);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [installmentPeriod, setInstallmentPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchOfflineCourses()),
          dispatch(fetchOfflineStudents())
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (mounted) {
      fetchData();
    }
  }, [dispatch, mounted]);

  // Filter students based on selected course
  const filteredStudents = selectedCourse === 'all' 
    ? offlineStudents 
    : offlineStudents.filter(student => student?.course === selectedCourse);

  // Filter installments based on period
  const getFilteredInstallments = (students) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return students.reduce((total, student) => {
      const studentInstallments = student?.installments || [];
      let filteredInstallments = studentInstallments;

      if (installmentPeriod === 'monthly') {
        filteredInstallments = studentInstallments.filter(inst => {
          const instDate = new Date(inst?.date);
          return instDate.getMonth() === currentMonth && instDate.getFullYear() === currentYear;
        });
      } else if (installmentPeriod === 'yearly') {
        filteredInstallments = studentInstallments.filter(inst => {
          const instDate = new Date(inst?.date);
          return instDate.getFullYear() === currentYear;
        });
      }

      return total + filteredInstallments.length;
    }, 0);
  };

  // Calculate stats from filtered data
  const stats = {
    totalStudents: filteredStudents?.length || 0,
    totalFee: filteredStudents?.reduce((total, student) => total + (student?.fee || 0), 0) || 0,
    totalInstallments: getFilteredInstallments(filteredStudents),
    paidInstallments: filteredStudents?.reduce((total, student) => {
      const studentInstallments = student?.installments || [];
      const filteredInstallments = installmentPeriod === 'all' 
        ? studentInstallments 
        : studentInstallments.filter(inst => {
            const instDate = new Date(inst?.date);
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            if (installmentPeriod === 'monthly') {
              return instDate.getMonth() === currentMonth && instDate.getFullYear() === currentYear;
            } else if (installmentPeriod === 'yearly') {
              return instDate.getFullYear() === currentYear;
            }
            return true;
          });
      
      return total + filteredInstallments.filter(inst => inst?.status === 'paid').length;
    }, 0) || 0
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col py-8 px-4 min-h-screen fixed">
        <div className="mb-10 flex flex-col items-center">
          <img src="/logo.png" alt="ILS Logo" className="h-12 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800">In-House Admin</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                href="/banglore/inhouseadmin"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  true
                    ? "bg-[#00965f]/10 text-[#00965f]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaBook className="h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/inhouse/admin/courses"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100"
              >
                <FaBook className="h-5 w-5" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                href="/inhouse/admin/students"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100"
              >
                <FaUsers className="h-5 w-5" />
                Students Enrolled
              </Link>
            </li>
            <li>
              <Link
                href="/banglore/inhouseadmin/analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-100"
              >
                <FaChartLine className="h-5 w-5" />
                Analytics
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-10">
          <Link
            href="/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="h-5 w-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 ml-72">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-[#164758] mb-2">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your courses today.</p>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {offlineCourses?.map((course) => (
                  <option key={course?._id} value={course?._id}>
                    {course?.title || 'Untitled Course'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <select
                value={installmentPeriod}
                onChange={(e) => setInstallmentPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <FaGraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Fee</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalFee.toLocaleString()}</h3>
                    </div>
                    <div className="bg-[#00965f]/10 p-3 rounded-lg">
                      <FaChartLine className="h-6 w-6 text-[#00965f]" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Installments</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalInstallments}</h3>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <FaCalendarAlt className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Paid Installments</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.paidInstallments}</h3>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <FaChartLine className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* My Courses Section */}
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <FaBook className="h-6 w-6 text-[#00965f]" />
                  <h3 className="text-xl font-semibold text-gray-800">My Courses</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  {!offlineCourses || offlineCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <FaBook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No courses available yet</p>
                      <p className="text-sm text-gray-400">Get started by adding your first course</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {offlineCourses.map((course) => (
                        <div key={course?._id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900">{course?.title || 'Untitled Course'}</h4>
                          <p className="text-sm text-gray-600 mt-1">{course?.description || 'No description available'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Students Enrolled Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <FaUsers className="h-6 w-6 text-[#00965f]" />
                  <h3 className="text-xl font-semibold text-gray-800">Students Enrolled</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  {!offlineStudents || offlineStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <FaUsers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No students enrolled yet</p>
                      <p className="text-sm text-gray-400">Start by adding your first student</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-gray-200">
                            <th className="pb-3 font-medium text-gray-600">Name</th>
                            <th className="pb-3 font-medium text-gray-600">Course</th>
                            <th className="pb-3 font-medium text-gray-600">Status</th>
                            <th className="pb-3 font-medium text-gray-600">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offlineStudents.map((student) => (
                            <tr key={student?._id} className="border-b border-gray-100">
                              <td className="py-4">{student?.name || '-'}</td>
                              <td className="py-4">
                                {offlineCourses?.find(course => course?._id === student?.course)?.title || '-'}
                              </td>
                              <td className="py-4">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-600">
                                  Active
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-[#00965f] h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Export the component with dynamic import and SSR disabled
export default dynamic(() => Promise.resolve(InhouseAdminDashboard), {
  ssr: false
});