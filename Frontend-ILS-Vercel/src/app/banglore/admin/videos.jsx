"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTimes,
  FaVideo,
  FaTrash,
  FaEdit,
  FaCheck,
  FaBan,
  FaPlay,
  FaFilter,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  addVideo,
  getAllCoursesforAdmin,
  approveVideo,
  rejectVideo,
  deleteVideo,
} from "../../../redux/features/courseSlice";
import toast, { Toaster } from "react-hot-toast";

function AdminVideos() {
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    course: "",
    status: "",
    instructor: "",
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);

  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(getAllCoursesforAdmin());
  }, [dispatch]);

  // Get all videos from all courses
  const allVideos = courses.reduce((acc, course) => {
    if (course.videos && course.videos.length > 0) {
      const videosWithCourse = course.videos.map((video) => ({
        ...video,
        courseName: course.title,
        courseThumbnail: course.thumbnail,
        instructorName: course.instructor_id?.fullname || "N/A",
      }));
      return [...acc, ...videosWithCourse];
    }
    return acc;
  }, []);

  // Filter videos based on search term and filters
  const filteredVideos = allVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      !filters.course || video.courseName === filters.course;
    const matchesStatus =
      !filters.status || video.isApproved?.status === filters.status;
    const matchesInstructor =
      !filters.instructor || video.instructorName === filters.instructor;

    return matchesSearch && matchesCourse && matchesStatus && matchesInstructor;
  });

  // Get unique values for filters
  const courseNames = [...new Set(allVideos.map((video) => video.courseName))];
  const instructorNames = [
    ...new Set(allVideos.map((video) => video.instructorName)),
  ];

  // Function to check if URL is YouTube
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Function to convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (isYouTubeUrl(url)) {
      // Handle different YouTube URL formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
    }

    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", videoTitle);
      formData.append("description", videoDescription);
      formData.append("videoUrl", videoUrl);
      formData.append("thumbnail", thumbnail);
      formData.append("course", selectedCourse);

      const result = await dispatch(addVideo(formData)).unwrap();

      if (result.success) {
        setVideoTitle("");
        setVideoDescription("");
        setVideoUrl("");
        setThumbnail(null);
        setSelectedCourse("");
        setShowAddVideo(false);
        toast.success("Video added successfully!");
        dispatch(getAllCoursesforAdmin()); // Updated here
      }
    } catch (err) {
      console.error("Error adding video:", err);
      toast.error(err.message || "Failed to add video");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmationAction) return;

    const toastId = toast.loading(
      confirmationAction.type === "approve"
        ? "Approving video..."
        : "Rejecting video..."
    );

    try {
      if (confirmationAction.type === "approve") {
        await dispatch(
          approveVideo({
            videoId: confirmationAction.videoId,
            reason: confirmationAction.reason,
          })
        );
        toast.dismiss(toastId);
        toast.success("Video approved successfully");
      } else {
        await dispatch(
          rejectVideo({
            videoId: confirmationAction.videoId,
            reason: confirmationAction.reason,
          })
        );
        toast.dismiss(toastId);
        toast.success("Video rejected successfully");
      }

      setShowConfirmationModal(false);
      setConfirmationAction(null);
      // Refresh the videos list
      dispatch(getAllCoursesforAdmin());
    } catch {
      // Silently handle any errors
      toast.dismiss(toastId);
      setShowConfirmationModal(false);
      setConfirmationAction(null);
    }
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      const result = await dispatch(deleteVideo(videoToDelete._id));
      if (deleteVideo.fulfilled.match(result)) {
        toast.success("Video deleted successfully");
        setShowDeleteModal(false);
        setVideoToDelete(null);
        dispatch(getAllCoursesforAdmin()); // Refresh the list
      } else if (deleteVideo.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to delete video");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the video"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">
              Course Videos
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize your course videos
            </p>
          </div>
          <button
            onClick={() => setShowAddVideo(true)}
            className="w-1/5 text-sm  sm:w-auto bg-[#00965f] text-white px-6 py-3 rounded-lg hover:bg-[#164758] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <FaVideo className="text-md" />
            Add New Video
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search videos by title, course, instructor, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full  pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent shadow-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <FaFilter className="text-lg" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    value={filters.course}
                    onChange={(e) =>
                      setFilters({ ...filters, course: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                  >
                    <option value="">All Courses</option>
                    {courseNames.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Instructor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <select
                    value={filters.instructor}
                    onChange={(e) =>
                      setFilters({ ...filters, instructor: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                  >
                    <option value="">All Instructors</option>
                    {instructorNames.map((instructor) => (
                      <option key={instructor} value={instructor}>
                        {instructor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    setFilters({ course: "", status: "", instructor: "" })
                  }
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-h-[400px] max-h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="w-[40%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Video
                    </th>
                    <th
                      scope="col"
                      className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Instructor
                    </th>
                    <th
                      scope="col"
                      className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="w-[15%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                      <tr
                        key={video._id || video.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-16 w-24 flex-shrink-0 relative">
                              <img
                                src={video.thumbnail || video.courseThumbnail}
                                alt={video.title}
                                className="h-16 w-24 rounded-lg object-cover"
                              />
                              <button
                                onClick={() => {
                                  setSelectedVideo(video);
                                  setShowVideoPlayer(true);
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaPlay className="text-white text-xl" />
                              </button>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 whitespace-normal">
                                {video.title}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                {video.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 inline-flex items-center">
                            {video.courseName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {video.instructorName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedVideoDetails(video);
                                setShowDetailsModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye size={14} />
                            </button>
                            {(!video.isApproved?.status ||
                              video.isApproved?.status === "pending") && (
                              <>
                                <button
                                  onClick={() => {
                                    setConfirmationAction({
                                      type: "approve",
                                      videoId: video._id || video.id,
                                      reason: "",
                                    });
                                    setShowConfirmationModal(true);
                                  }}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve Video"
                                >
                                  <FaCheck size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmationAction({
                                      type: "reject",
                                      videoId: video._id || video.id,
                                      reason: "",
                                    });
                                    setShowConfirmationModal(true);
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject Video"
                                >
                                  <FaBan size={14} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setVideoToDelete(video);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Video"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📹</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          No Videos Available
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Start by adding your first video using the button
                          above.
                        </p>
                        <button
                          onClick={() => setShowAddVideo(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00965f] text-white rounded-xl hover:bg-[#164758] transition-colors"
                        >
                          <FaVideo />
                          Add New Video
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm  bg-opacity-50"
            onClick={() => {
              setShowVideoPlayer(false);
              setSelectedVideo(null);
            }}
          />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedVideo.title}
                </h2>
                <button
                  onClick={() => {
                    setShowVideoPlayer(false);
                    setSelectedVideo(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                {isYouTubeUrl(selectedVideo.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    className="w-full h-[500px] rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    className="w-full h-[500px] rounded-xl"
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

      {/* Add Video Modal */}
      {showAddVideo && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-opacity-50"
            onClick={() => setShowAddVideo(false)}
          />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaVideo />
                  Add New Video
                </h2>
                <button
                  onClick={() => setShowAddVideo(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Enter YouTube video URL"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Select Course
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      >
                        <option value="">Choose a course</option>
                        {courses &&
                          courses.map((course) => (
                            <option key={course._id} value={course.title}>
                              {course.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Video Description
                      </label>
                      <textarea
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Video Thumbnail
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setThumbnail(e.target.files[0])}
                          className="hidden"
                          id="thumbnail"
                          required
                        />
                        <label
                          htmlFor="thumbnail"
                          className="w-full p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00965f] transition-colors"
                        >
                          <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            {thumbnail
                              ? thumbnail.name
                              : "Click to upload thumbnail"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddVideo(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#00965f] text-white hover:bg-[#164758] transition-colors flex items-center gap-2"
                    disabled={loading}
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
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaVideo />
                        Add Video
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {confirmationAction?.type === "approve"
                ? "Approve Video"
                : "Reject Video"}
            </h3>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent mb-6"
              placeholder="Enter reason..."
              value={confirmationAction?.reason || ""}
              onChange={(e) =>
                setConfirmationAction({
                  ...confirmationAction,
                  reason: e.target.value,
                })
              }
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  setConfirmationAction(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  confirmationAction?.type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmationAction?.type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Delete Video
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVideoToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the video "{videoToDelete?.title}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVideoToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Details Modal */}
      {showDetailsModal && selectedVideoDetails && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedVideoDetails(null);
            }}
          />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white/95 rounded-xl w-full max-w-4xl p-6 relative shadow-2xl">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 z-10 pb-4 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Video Details
                </h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedVideoDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Video Preview */}
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      {isYouTubeUrl(selectedVideoDetails.videoUrl) ? (
                        <iframe
                          src={getEmbedUrl(selectedVideoDetails.videoUrl)}
                          title={selectedVideoDetails.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={selectedVideoDetails.videoUrl}
                          controls
                          className="w-full h-full"
                          title={selectedVideoDetails.title}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                    <div className="bg-gray-50/80 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedVideoDetails.title}
                      </h3>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        {selectedVideoDetails.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Course Information
                      </h3>
                      <div className="bg-gray-50/80 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Course:
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {selectedVideoDetails.courseName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Instructor:
                          </span>
                          <span className="text-sm text-gray-600">
                            {selectedVideoDetails.instructorName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Status Information
                      </h3>
                      <div className="bg-gray-50/80 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Current Status:
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              selectedVideoDetails.isApproved?.status ===
                              "approved"
                                ? "bg-green-100 text-green-800"
                                : selectedVideoDetails.isApproved?.status ===
                                  "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedVideoDetails.isApproved?.status ||
                              "pending"}
                          </span>
                        </div>
                        {selectedVideoDetails.isApproved?.reason && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-900">
                              Reason:
                            </span>
                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                              {selectedVideoDetails.isApproved.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Video Information
                      </h3>
                      <div className="bg-gray-50/80 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Video URL:
                          </span>
                          <a
                            href={selectedVideoDetails.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate"
                          >
                            {selectedVideoDetails.videoUrl}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Thumbnail:
                          </span>
                          <img
                            src={
                              selectedVideoDetails.thumbnail ||
                              selectedVideoDetails.courseThumbnail
                            }
                            alt="Video thumbnail"
                            className="h-12 w-20 rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVideos;
