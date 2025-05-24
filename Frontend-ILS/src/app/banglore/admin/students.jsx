"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEye,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaTimes,
  FaUserPlus,
  FaGraduationCap,
  FaCheck,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import {
  getAllUsers,
  deleteUser,
  addOfflineStudent,
} from "../../../redux/features/userSlice";
import { getAllCourses, enrollOfflineStudentInCourse } from "../../../redux/features/courseSlice";

function AdminStudents() {
  // ...existing hooks
  const dispatch = useDispatch();

  // Handler for giving access
  const handleGiveAccess = async (studentId, courseId) => {
  try {
    const resultAction = await dispatch(enrollOfflineStudentInCourse({ studentId, courseId }));
    if (enrollOfflineStudentInCourse.fulfilled.match(resultAction)) {
      toast.success("Access granted successfully!");
      // Refetch users and courses for real-time update
      dispatch(getAllUsers());
      dispatch(getAllCourses());
    } else {
      toast.error(resultAction.payload || "Failed to grant access");
    }
  } catch (err) {
    toast.error("An error occurred while granting access");
  }
}
  const { loading, users, error, message } = useSelector((state) => state.user);
  const { courses } = useSelector((state) => state.courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    enrollmentStatus: "all",
    courseCount: "all",
    lastActive: "all",
    isOflineStudent: false,
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [showCourseAccessModal, setShowCourseAccessModal] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addOfflineStudent(formData)).unwrap();
      setShowAddModal(false);
      setFormData({ fullname: "", email: "", password: "" });
    } catch (err) {
      // Error is handled via useEffect and toast
    }
  };

  // Filter and sort students
  const filteredAndSortedUsers = users
    ?.filter((user) => {
      const userRole = (user.role || "student").toLowerCase();
      if (userRole !== "student") return false;

      // Search filter
      const matchesSearch =
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Enrollment status filter
      const matchesEnrollmentStatus =
        filters.enrollmentStatus === "all" ||
        (filters.enrollmentStatus === "enrolled" &&
          user.enrolledCourses?.length > 0) ||
        (filters.enrollmentStatus === "not_enrolled" &&
          (!user.enrolledCourses || user.enrolledCourses.length === 0));

      // Course count filter
      const courseCount = user.enrolledCourses?.length || 0;
      const matchesCourseCount =
        filters.courseCount === "all" ||
        (filters.courseCount === "none" && courseCount === 0) ||
        (filters.courseCount === "one" && courseCount === 1) ||
        (filters.courseCount === "multiple" && courseCount > 1);

      // Last active filter
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      const now = new Date();
      const matchesLastActive =
        filters.lastActive === "all" ||
        (filters.lastActive === "today" &&
          lastActive &&
          lastActive.toDateString() === now.toDateString()) ||
        (filters.lastActive === "week" &&
          lastActive &&
          now - lastActive <= 7 * 24 * 60 * 60 * 1000) ||
        (filters.lastActive === "month" &&
          lastActive &&
          now - lastActive <= 30 * 24 * 60 * 60 * 1000) ||
        (filters.lastActive === "inactive" &&
          (!lastActive || now - lastActive > 30 * 24 * 60 * 60 * 1000));

      // Offline student filter
      const matchesOflineStatus =
        !filters.isOflineStudent ||
        user.isOflineStudent === true ||
        user.isOflineStudent === "true";

      return (
        matchesSearch &&
        matchesEnrollmentStatus &&
        matchesCourseCount &&
        matchesLastActive &&
        matchesOflineStatus
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue, bValue;

      if (sortConfig.key === "enrolledCourses") {
        aValue = a.enrolledCourses?.length || 0;
        bValue = b.enrolledCourses?.length || 0;
      } else if (sortConfig.key === "lastActive") {
        aValue = a.lastActive ? new Date(a.lastActive) : new Date(0);
        bValue = b.lastActive ? new Date(b.lastActive) : new Date(0);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      enrollmentStatus: "all",
      courseCount: "all",
      lastActive: "all",
      isOflineStudent: false,
    });
    setSearchTerm("");
    setSortConfig({ key: null, direction: "ascending" });
  };

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("Student deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00965f]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-[#164758]">
          Manage Students
        </h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007a4d] transition-colors flex items-center gap-2"
          >
            <FaUserPlus />
            Add Offline Student
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Status
              </label>
              <select
                value={filters.enrollmentStatus}
                onChange={(e) =>
                  handleFilterChange("enrollmentStatus", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
              >
                <option value="all">All</option>
                <option value="enrolled">Enrolled</option>
                <option value="not_enrolled">Not Enrolled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Count
              </label>
              <select
                value={filters.courseCount}
                onChange={(e) =>
                  handleFilterChange("courseCount", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
              >
                <option value="all">All</option>
                <option value="none">No Courses</option>
                <option value="one">One Course</option>
                <option value="multiple">Multiple Courses</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Active
              </label>
              <select
                value={filters.lastActive}
                onChange={(e) =>
                  handleFilterChange("lastActive", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="inactive">Inactive (30+ Days)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Type
              </label>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isOflineStudent}
                    onChange={(e) =>
                      handleFilterChange("isOflineStudent", e.target.checked)
                    }
                    className="form-checkbox h-5 w-5 text-[#00965f] rounded border-gray-300 focus:ring-[#00965f]"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show Offline Students Only
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Add Offline Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Offline Student
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                  placeholder="Enter full name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00965f] text-white rounded-md hover:bg-[#007a4d] transition-colors flex items-center gap-2"
                >
                  <FaUserPlus />
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("fullname")}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon("fullname")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("enrolledCourses")}
                >
                  <div className="flex items-center">
                    Enrolled Courses
                    {getSortIcon("enrolledCourses")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("lastActive")}
                >
                  <div className="flex items-center">
                    Last Active
                    {getSortIcon("lastActive")}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers && filteredAndSortedUsers.length > 0 ? (
                filteredAndSortedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullname}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.enrolledCourses?.length || 0} courses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive
                        ? new Date(user.lastActive).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isOflineStudent === true ||
                          user.isOflineStudent === "true"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isOflineStudent === true ||
                        user.isOflineStudent === "true"
                          ? "Offline"
                          : "Online"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            toast.error("View details coming soon!")
                          }
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaEye size={18} />
                        </button>
                        {(user.isOflineStudent === true ||
                          user.isOflineStudent === "true") && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowCourseAccessModal(true);
                            }}
                            className="text-green-500 hover:text-green-700 transition-colors"
                            title="Give Course Access"
                          >
                            <FaGraduationCap size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="py-8">
                      <div className="text-gray-400 text-6xl mb-4">👥</div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        No Students Found
                      </h2>
                      <p className="text-gray-600">
                        {searchTerm ||
                        Object.values(filters).some((v) => v !== "all")
                          ? "Try adjusting your search or filters"
                          : "Students will appear here once they are registered."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedUser.fullname}? This
              action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FaTrash className="inline-block mr-2" />
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Access Modal */}
      {showCourseAccessModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Course Access for {selectedUser.fullname}
              </h3>
              <button
                onClick={() => {
                  setShowCourseAccessModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-6">
              {/* Get approved courses that the student is not already enrolled in */}
              {(() => {
                const approvedCourses =
                  courses?.filter(
                    (course) => course.isApproved?.status === "approved"
                  ) || [];

                const availableCourses = approvedCourses.filter(
                  (course) =>
                    !selectedUser.enrolledCourses?.some(
                      (enrolled) => enrolled.courseId === course._id
                    )
                );

                if (availableCourses.length === 0) {
                  return (
                    <div className="text-center py-6">
                      <div className="text-gray-400 text-5xl mb-4">
                        <FaCheck className="mx-auto" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        All Courses Enrolled
                      </h2>
                      <p className="text-gray-600">
                        This student is already enrolled in all available
                        courses.
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    <h4 className="text-md font-medium text-gray-800 mb-4">
                      Available Courses
                    </h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {availableCourses.map((course) => (
  <div
    key={course._id}
    className="border border-gray-200 rounded-lg p-4 hover:border-[#00965f] transition-colors"
  >
    <div className="flex justify-between items-center">
      <div>
        <h5 className="font-medium text-gray-900 mb-1">
          {course.title}
        </h5>
        <p className="text-sm text-gray-500 line-clamp-1">
          {course.description?.substring(0, 100) || "No description available"}
        </p>
      </div>
      <button
        onClick={async () => {
          await handleGiveAccess(selectedUser._id, course._id);
          setShowCourseAccessModal(false);
          setSelectedUser(null);
        }}
        className="ml-4 px-3 py-1 bg-[#00965f] text-white rounded-md hover:bg-[#007a4d] transition-colors flex items-center gap-1 whitespace-nowrap"
      >
        <FaGraduationCap size={14} />
        Give Access
      </button>
    </div>
  </div>
))}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowCourseAccessModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudents;
