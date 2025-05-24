"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEye,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import {
  getAllUsers,
  deleteUser,
  approveInstructor,
  rejectInstructor,
} from "../../../redux/features/userSlice";

function AdminInstructors() {
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    applicationStatus: "all",
    hasDocuments: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [approveReason, setApproveReason] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Filter and sort instructors
  const filteredAndSortedUsers = users
    ?.filter((user) => {
      const userRole = (user.role || "student").toLowerCase();
      if (userRole !== "instructor") return false;

      // Search filter
      const matchesSearch =
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        user.instructorProfile?.isApproved?.status === filters.status;

      // Application status filter
      const matchesApplicationStatus =
        filters.applicationStatus === "all" ||
        user.instructorProfile?.applicationStatus === filters.applicationStatus;

      // Documents filter
      const matchesDocuments =
        filters.hasDocuments === "all" ||
        (filters.hasDocuments === "yes" && user.instructorProfile?.documents) ||
        (filters.hasDocuments === "no" && !user.instructorProfile?.documents);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesApplicationStatus &&
        matchesDocuments
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key] || a.instructorProfile?.[sortConfig.key];
      const bValue = b[sortConfig.key] || b.instructorProfile?.[sortConfig.key];

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
      status: "all",
      applicationStatus: "all",
      hasDocuments: "all",
    });
    setSearchTerm("");
    setSortConfig({ key: null, direction: "ascending" });
  };

  const handleViewDetails = (instructor) => {
    setSelectedInstructor(instructor);
    setShowModal(true);
  };

  const handleApprove = async (instructorId) => {
    if (!approveReason.trim()) {
      toast.error("Please provide a reason for approval");
      return;
    }
    try {
      await dispatch(
        approveInstructor({ instructorId, reason: approveReason })
      ).unwrap();
      toast.success("Instructor approved successfully!");
      dispatch(getAllUsers());
      setShowModal(false);
      setShowApproveModal(false);
      setApproveReason("");
    } catch (error) {
      toast.error(error.message || "Failed to approve instructor");
    }
  };

  const handleReject = async (instructorId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await dispatch(
        rejectInstructor({ instructorId, reason: rejectReason })
      ).unwrap();
      toast.success("Instructor application rejected");
      dispatch(getAllUsers());
      setShowModal(false);
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      toast.error(error.message || "Failed to reject instructor");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("Instructor deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete instructor");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "email_verified":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
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
          Manage Instructors
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
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Status
              </label>
              <select
                value={filters.applicationStatus}
                onChange={(e) =>
                  handleFilterChange("applicationStatus", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
              >
                <option value="all">All</option>
                <option value="pending_verification">
                  Pending Verification
                </option>
                <option value="email_verified">Email Verified</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents
              </label>
              <select
                value={filters.hasDocuments}
                onChange={(e) =>
                  handleFilterChange("hasDocuments", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
              >
                <option value="all">All</option>
                <option value="yes">Has Documents</option>
                <option value="no">No Documents</option>
              </select>
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

      {/* Instructors Table */}
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
                  onClick={() => requestSort("createdCourses")}
                >
                  <div className="flex items-center">
                    Courses
                    {getSortIcon("createdCourses")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("isApproved.status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isApproved.status")}
                  </div>
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
                      {user.instructorProfile?.createdCourses?.length || 0}{" "}
                      courses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          user.instructorProfile?.isApproved?.status
                        )}`}
                      >
                        {user.instructorProfile?.isApproved?.status ||
                          "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaEye size={18} />
                        </button>
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
                        No Instructors Found
                      </h2>
                      <p className="text-gray-600">
                        {searchTerm ||
                        Object.values(filters).some((v) => v !== "all")
                          ? "Try adjusting your search or filters"
                          : "Instructors will appear here once they are registered."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedInstructor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Instructor Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedInstructor.fullname}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedInstructor.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expertise
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedInstructor.instructorProfile?.expertise ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedInstructor.instructorProfile?.bio || "Not provided"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created Courses
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedInstructor.instructorProfile?.createdCourses
                    ?.length || 0}{" "}
                  courses
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Application Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getApplicationStatusColor(
                      selectedInstructor.instructorProfile?.applicationStatus
                    )}`}
                  >
                    {selectedInstructor.instructorProfile?.applicationStatus?.replace(
                      /_/g,
                      " "
                    ) || "pending verification"}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval Status
                </label>
                <p className="mt-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      selectedInstructor.instructorProfile?.isApproved?.status
                    )}`}
                  >
                    {selectedInstructor.instructorProfile?.isApproved?.status ||
                      "pending"}
                  </span>
                </p>
                {selectedInstructor.instructorProfile?.isApproved?.reason && (
                  <p className="mt-1 text-sm text-gray-600">
                    Reason:{" "}
                    {selectedInstructor.instructorProfile.isApproved.reason}
                  </p>
                )}
              </div>

              {selectedInstructor.instructorProfile?.documents && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Documents
                  </label>
                  <a
                    href={selectedInstructor.instructorProfile.documents}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Documents
                  </a>
                </div>
              )}
            </div>

            {(!selectedInstructor.instructorProfile?.isApproved?.status ||
              selectedInstructor.instructorProfile?.isApproved?.status ===
                "pending") && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowRejectModal(true);
                  }}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                >
                  <FaTimes className="inline-block mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowApproveModal(true);
                  }}
                  className="px-4 py-2 bg-[#00965f] text-white rounded-md hover:bg-[#007f4f] transition-colors"
                >
                  <FaCheck className="inline-block mr-2" />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedInstructor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Approval
              </h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to approve {selectedInstructor.fullname} as
              an instructor? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Approval
              </label>
              <textarea
                value={approveReason}
                onChange={(e) => setApproveReason(e.target.value)}
                placeholder="Please provide a reason for approval..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                rows="3"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedInstructor._id)}
                className="px-4 py-2 bg-[#00965f] text-white rounded-md hover:bg-[#007f4f] transition-colors"
              >
                <FaCheck className="inline-block mr-2" />
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && selectedInstructor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Rejection
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to reject {selectedInstructor.fullname}'s
              instructor application? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                rows="3"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedInstructor._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FaTimes className="inline-block mr-2" />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

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
                Delete Instructor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInstructors;
