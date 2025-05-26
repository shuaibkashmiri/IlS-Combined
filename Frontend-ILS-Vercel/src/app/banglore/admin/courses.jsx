"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourse,
  getAllCoursesforAdmin,
  approveCourse,
  rejectCourse,
  deleteCourse,
} from "../../../redux/features/courseSlice";
import {
  FaTimes,
  FaUsers,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheck,
  FaBan,
  FaFilter,
  FaPlay,
} from "react-icons/fa";
import { FiBook, FiPlus } from "react-icons/fi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "sonner";

function AdminCourses() {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [showEnrolledStudents, setShowEnrolledStudents] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    type: "",
    course: null,
  });
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    priceRange: "",
  });
  const [showCourseVideos, setShowCourseVideos] = useState(false);
  const [selectedCourseForVideos, setSelectedCourseForVideos] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, success, courses } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    dispatch(getAllCoursesforAdmin());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseThumbnail) {
      toast.error("Please select a course thumbnail");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", courseTitle);
      formData.append("thumbnail", courseThumbnail);
      formData.append("price", coursePrice);
      formData.append("duration", courseDuration);
      formData.append("category", courseCategory);
      formData.append("description", courseDescription);

      toast.loading("Creating course...");
      const result = await dispatch(addCourse(formData)).unwrap();

      if (result.success) {
        // Reset form after successful submission
        setCourseTitle("");
        setCourseThumbnail(null);
        setCoursePrice("");
        setCourseDuration("");
        setCourseCategory("");
        setCourseDescription("");
        setShowCreateCourse(false);
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Course created successfully!");
        dispatch(getAllCoursesforAdmin());
      }
    } catch (err) {
      toast.dismiss(); // Dismiss the loading toast
      console.error("Error creating course:", err);
      toast.error(err.message || "Failed to create course");
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    try {
      const result = await dispatch(deleteCourse(courseToDelete._id));
      if (deleteCourse.fulfilled.match(result)) {
        toast.success("Course deleted successfully");
        setShowDeleteModal(false);
        setCourseToDelete(null);
      } else if (deleteCourse.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to delete course");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the course"
      );
    }
  };

  const handleEdit = (course) => {
    try {
      // Add your edit logic here
      toast.success("Course updated successfully!");
    } catch (error) {
      toast.error("Failed to update course");
    }
  };

  const handleApprove = (course) => {
    if (!course?._id) {
      setShowConfirmModal(false);
      return;
    }
    setConfirmAction({ type: "approve", course });
    setShowConfirmModal(true);
  };

  const handleReject = (course) => {
    if (!course?._id) {
      setShowConfirmModal(false);
      return;
    }
    setConfirmAction({ type: "reject", course });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    let toastId = null;
    try {
      if (!confirmAction?.course?._id) {
        setShowConfirmModal(false);
        setConfirmAction({ type: "", course: null });
        setReason("");
        return;
      }

      if (!reason.trim()) {
        toast.error("Please provide a reason");
        return;
      }

      setIsSubmitting(true);
      toastId = toast.loading(
        confirmAction.type === "approve"
          ? "Approving course..."
          : "Rejecting course..."
      );

      const payload = {
        courseId: confirmAction.course._id,
        reason: reason.trim(),
      };

      try {
        if (confirmAction.type === "approve") {
          await dispatch(approveCourse(payload)).unwrap();
          toast.dismiss(toastId);
          toast.success("Course approved and instructor notified");
          dispatch(getAllCoursesforAdmin());
        } else if (confirmAction.type === "reject") {
          await dispatch(rejectCourse(payload)).unwrap();
          toast.dismiss(toastId);
          toast.success("Course rejected and instructor notified");
          dispatch(getAllCoursesforAdmin());
        }

        // Reset states after successful action
        setShowConfirmModal(false);
        setConfirmAction({ type: "", course: null });
        setReason("");
      } catch (error) {
        throw error; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      if (error.message && !error.message.includes("_id")) {
        toast.error(error.message || "Failed to process the action");
      }
      setShowConfirmModal(false);
      setConfirmAction({ type: "", course: null });
      setReason("");
    } finally {
      setIsSubmitting(false);
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  };

  // Add cleanup effect for modal
  useEffect(() => {
    if (!showConfirmModal) {
      setConfirmAction({ type: "", course: null });
      setReason("");
      setIsSubmitting(false);
    }
  }, [showConfirmModal]);

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup any remaining toasts when component unmounts
      toast.dismiss();
    };
  }, []);

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_id?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filters.category || course.category === filters.category;
    const matchesStatus =
      !filters.status || course.isApproved?.status === filters.status;

    let matchesPrice = true;
    if (filters.priceRange) {
      const price = getNumericValue(course.price);
      switch (filters.priceRange) {
        case "low":
          matchesPrice = price < 1000;
          break;
        case "medium":
          matchesPrice = price >= 1000 && price < 5000;
          break;
        case "high":
          matchesPrice = price >= 5000;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  // Get unique categories for filter
  const categories = [...new Set(courses.map((course) => course.category))];

  // Helper function to safely convert Decimal128 to number
  const getNumericValue = (value) => {
    if (value && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    return value || 0;
  };

  // Function to check if URL is YouTube
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Function to convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (isYouTubeUrl(url)) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    }

    return url;
  };

  return (
    <div className="h-screen flex">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search courses by title, category, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaFilter />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                    >
                      <option value="">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) =>
                        setFilters({ ...filters, priceRange: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f]"
                    >
                      <option value="">All Prices</option>
                      <option value="low">Under ₹1,000</option>
                      <option value="medium">₹1,000 - ₹5,000</option>
                      <option value="high">Above ₹5,000</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      setFilters({ category: "", status: "", priceRange: "" })
                    }
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <button
              onClick={() => setShowCreateCourse(true)}
              className="w-full md:w-auto bg-[#00965f] text-white px-6 py-2 rounded-lg hover:bg-[#164758] transition-colors flex items-center justify-center gap-2"
            >
              <FiPlus size={20} />
              Add New Course
            </button>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-h-[400px] max-h-[calc(100vh-400px)] overflow-y-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th
                        scope="col"
                        className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Course
                      </th>
                      <th
                        scope="col"
                        className="w-1/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Duration
                      </th>
                      <th
                        scope="col"
                        className="w-1/6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Instructor
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Students
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <tr
                        key={course._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedCourseForVideos(course);
                          setShowCourseVideos(true);
                        }}
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0">
                              <img
                                className="h-8 w-8 rounded-lg object-cover"
                                src={course.thumbnail}
                                alt={course.title}
                              />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {course.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 whitespace-normal">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                          ₹{getNumericValue(course.price)}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {getNumericValue(course.duration)}h
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 truncate max-w-[120px]">
                          {course.instructor_id?.fullname || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourse(course);
                              setShowEnrolledStudents(true);
                            }}
                            className="flex items-center gap-1 text-[#00965f] hover:text-[#164758]"
                          >
                            <FaUsers />
                            {course.enrolledStudents?.length || 0}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.isApproved?.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : course.isApproved?.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.isApproved?.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {(!course.isApproved?.status ||
                              course.isApproved?.status === "pending") && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(course);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve Course"
                                >
                                  <FaCheck size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(course);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject Course"
                                >
                                  <FaBan size={14} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCourseToDelete(course);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Delete Course"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showCreateCourse && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="absolute inset-0 bg-opacity-40"
              onClick={() => setShowCreateCourse(false)}
            />
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-2xl w-11/12 md:w-2/3 lg:w-3/4 max-h-[90vh] shadow-2xl relative">
                {/* Header - keep fixed */}
                <div className="bg-[#00965f] px-8 py-6 sticky top-0 z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                      <FiBook className="text-3xl" />
                      Create New Course
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowCreateCourse(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>
                </div>

                {/* Form - make scrollable */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Course Title */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Course Title
                          </label>
                          <input
                            type="text"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:bg-white transition-all"
                            placeholder="Enter course title"
                            required
                          />
                        </div>

                        {/* Course Price */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Course Price (₹)
                          </label>
                          <input
                            type="number"
                            value={coursePrice}
                            onChange={(e) => setCoursePrice(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:bg-white transition-all"
                            placeholder="Enter price"
                            required
                          />
                        </div>

                        {/* Course Duration */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Duration (hours)
                          </label>
                          <input
                            type="number"
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:bg-white transition-all"
                            placeholder="Enter duration"
                            required
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Course Category */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Course Category
                          </label>
                          <select
                            value={courseCategory}
                            onChange={(e) => setCourseCategory(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:bg-white transition-all"
                            required
                          >
                            <option value="">Select category</option>
                            <option value="Development">Web-Development</option>
                            <option value="Design">Software-Development</option>
                            <option value="Marketing">Digital Marketing</option>
                            <option value="Business">Business</option>
                            <option value="Data Science">Data Science</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Cyber Security">
                              Cyber Security
                            </option>
                            <option value="Cloud Computing">
                              Cloud Computing
                            </option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Game Development">
                              Game Development
                            </option>
                          </select>
                        </div>

                        {/* Updated Course Description */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Course Description
                          </label>
                          <textarea
                            value={courseDescription}
                            onChange={(e) =>
                              setCourseDescription(e.target.value)
                            }
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:bg-white transition-all"
                            placeholder="Enter course description"
                            rows="6"
                            required
                          />
                        </div>

                        {/* Course Thumbnail */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Course Thumbnail
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setCourseThumbnail(e.target.files[0])
                              }
                              className="hidden"
                              id="thumbnail"
                              required
                            />
                            <label
                              htmlFor="thumbnail"
                              className="w-full p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00965f] transition-colors"
                            >
                              <div className="text-center">
                                <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  {courseThumbnail
                                    ? courseThumbnail.name
                                    : "Click to upload thumbnail"}
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer with Buttons - keep fixed at bottom */}
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t sticky bottom-0 bg-white">
                      <button
                        type="button"
                        onClick={() => setShowCreateCourse(false)}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-[#00965f] text-white hover:bg-[#164758] transition-colors flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            <FiPlus size={20} />
                            Create Course
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEnrolledStudents && selectedCourse && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 backdrop-blur-sm bg-opacity-50"
              onClick={() => setShowEnrolledStudents(false)}
            />
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {selectedCourse.title} - Enrolled Students
                  </h2>
                  <button
                    onClick={() => setShowEnrolledStudents(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-h-[200px] max-h-[60vh] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Enrolled On
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCourse.enrolledStudents?.map(
                          (student, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.fullname}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {student.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(
                                  student.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 z-[100]">
            <div
              className="fixed inset-0 backdrop-blur-sm bg-opacity-50"
              onClick={() => {
                if (!isSubmitting) {
                  setShowConfirmModal(false);
                  setConfirmAction({ type: "", course: null });
                  setReason("");
                }
              }}
            ></div>
            <div className="fixed inset-0 z-[101] overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div
                        className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                          confirmAction.type === "approve"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {confirmAction.type === "approve" ? (
                          <FaCheck className="h-6 w-6 text-green-600" />
                        ) : (
                          <FaBan className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {confirmAction.type === "approve"
                            ? "Approve Course"
                            : "Reject Course"}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to{" "}
                            {confirmAction.type === "approve"
                              ? "approve"
                              : "reject"}{" "}
                            the course "{confirmAction.course?.title}"?
                            {confirmAction.type === "reject" &&
                              " This action cannot be undone."}
                          </p>
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Reason *
                          </label>
                          <textarea
                            id="reason"
                            rows="3"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${
                              confirmAction.type === "approve" ? "green" : "red"
                            }-500 focus:ring-${
                              confirmAction.type === "approve" ? "green" : "red"
                            }-500 sm:text-sm`}
                            placeholder="Please provide a reason for your action"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      onClick={handleConfirmAction}
                      disabled={isSubmitting}
                      className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                        confirmAction.type === "approve"
                          ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                          : "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {confirmAction.type === "approve"
                            ? "Approving..."
                            : "Rejecting..."}
                        </div>
                      ) : confirmAction.type === "approve" ? (
                        "Approve"
                      ) : (
                        "Reject"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isSubmitting) {
                          setShowConfirmModal(false);
                          setConfirmAction({ type: "", course: null });
                          setReason("");
                        }
                      }}
                      disabled={isSubmitting}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Course
                </h3>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the course "
                {courseToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCourseToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Videos Modal */}
        {showCourseVideos && selectedCourseForVideos && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 backdrop-blur-sm bg-opacity-50"
              onClick={() => setShowCourseVideos(false)}
            />
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-[#164758]">
                    {selectedCourseForVideos.title} - Course Videos
                  </h2>
                  <button
                    onClick={() => setShowCourseVideos(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-h-[200px] max-h-[60vh] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Video
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCourseForVideos.videos?.map((video) => (
                          <tr key={video._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-12 w-20 flex-shrink-0 relative">
                                  <img
                                    src={
                                      video.thumbnail ||
                                      selectedCourseForVideos.thumbnail
                                    }
                                    alt={video.title}
                                    className="h-12 w-20 rounded-lg object-cover"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedVideo(video);
                                      setShowVideoPlayer(true);
                                    }}
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <FaPlay className="text-white" />
                                  </button>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {video.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {video.description?.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  video.isApproved?.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : video.isApproved?.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {video.isApproved?.status || "pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {(!video.isApproved?.status ||
                                  video.isApproved?.status === "pending") && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmAction({
                                          type: "approve",
                                          videoId: video._id,
                                          reason: "",
                                        });
                                        setShowConfirmModal(true);
                                      }}
                                      className="text-green-600 hover:text-green-900"
                                      title="Approve Video"
                                    >
                                      <FaCheck size={14} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmAction({
                                          type: "reject",
                                          videoId: video._id,
                                          reason: "",
                                        });
                                        setShowConfirmModal(true);
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                      title="Reject Video"
                                    >
                                      <FaBan size={14} />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVideoToDelete(video);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete Video"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {showVideoPlayer && selectedVideo && (
          <div className="fixed inset-0 z-[60]">
            <div
              className="absolute inset-0 backdrop-blur-sm bg-opacity-50"
              onClick={() => {
                setShowVideoPlayer(false);
                setSelectedVideo(null);
              }}
            />
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-[#164758]">
                    {selectedVideo.title}
                  </h2>
                  <button
                    onClick={() => {
                      setShowVideoPlayer(false);
                      setSelectedVideo(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  {isYouTubeUrl(selectedVideo.videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(selectedVideo.videoUrl)}
                      title={selectedVideo.title}
                      className="w-full h-[500px] rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={selectedVideo.videoUrl}
                      controls
                      className="w-full h-[500px] rounded-lg"
                      title={selectedVideo.title}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCourses;
