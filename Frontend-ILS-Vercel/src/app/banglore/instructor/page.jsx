"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaGraduationCap,
  FaFileAlt,
  FaCheckCircle,
  FaBook,
  FaUsers,
  FaChartLine,
  FaVideo,
  FaPlusSquare,
  FaListUl,
  FaUserFriends,
  FaTimes,
  FaPlay,
  FaCalendarAlt,
  FaHistory,
  FaSignOutAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import ProgressBar from "@ramonak/react-progress-bar"; // Import react-progressbar
import { getUserDetails } from "../../../redux/features/userSlice";
import {
  addCourse,
  addVideo,
  deleteVideo,
  editVideo,
  editCourse,
} from "../../../redux/features/courseSlice";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import IsInstructor from "@/auth/Instructor";

// Add these styles at the top of your component, after the imports
const modalStyles = {
  overlay:
    "fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4 transition-all duration-300",
  container:
    "bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative my-8 transform transition-all duration-300",
  header: "flex items-center justify-between mb-6",
  title: "text-2xl font-bold text-gray-800",
  closeButton:
    "text-gray-400 hover:text-gray-600 transition-colors duration-200",
  form: "space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2",
  inputGroup: "space-y-2",
  label: "block text-sm font-medium text-gray-700",
  input:
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all duration-200",
  select:
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all duration-200",
  textarea:
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all duration-200 min-h-[100px]",
  fileInput:
    "w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00965f]/10 file:text-[#00965f] hover:file:bg-[#00965f]/20",
  submitButton:
    "w-full bg-[#00965f] text-white px-6 py-3 rounded-xl hover:bg-[#007f4f] transition-all duration-300 disabled:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-[#00965f] font-medium",
  cancelButton:
    "w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium",
  deleteButton:
    "w-full bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-medium",
  buttonGroup: "flex gap-4 mt-6",
  filePreview: "mt-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg",
};

const InstructorPanel = () => {
  IsInstructor();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: userLoading, error: userError } = useSelector(
    (state) => state.user
  );
  const {
    loading: courseLoading,
    error: courseError,
    message: courseMessage,
    uploadProgress, // Fetch upload progress from Redux state
  } = useSelector((state) => state.courses);

  // Add detailed console logs
  console.log("=== User Data Debug ===");
  console.log("User:", user);
  console.log("User Loading:", userLoading);
  console.log("User Error:", userError);
  console.log("=== Course Data Debug ===");
  console.log("Upload Progress:", uploadProgress);
  console.log("=====================");

  // Fetch user details when the component mounts
  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  // Add console log after getUserDetails
  useEffect(() => {
    console.log("=== After getUserDetails ===");
    console.log("Updated User:", user);
    console.log("=========================");
  }, [user]);

  // State for Add Course modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    price: "",
    duration: "",
    category: "",
    description: "",
    thumbnail: null,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission for adding a course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();

    // Validate required fields
    if (
      !courseForm.title ||
      !courseForm.price ||
      !courseForm.duration ||
      !courseForm.category ||
      !courseForm.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate thumbnail
    if (!courseForm.thumbnail) {
      alert("Please upload a thumbnail");
      return;
    }

    // Validate file type
    if (!courseForm.thumbnail.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (courseForm.thumbnail.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    try {
      // Append all form fields
      formData.append("title", courseForm.title);
      formData.append("price", courseForm.price);
      formData.append("duration", courseForm.duration);
      formData.append("category", courseForm.category);
      formData.append("description", courseForm.description);

      // Append the file last
      formData.append("thumbnail", courseForm.thumbnail);

      // Log the FormData contents
      console.log("Form data before submission:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }

      console.log("Submitting form data...");
      const result = await dispatch(addCourse(formData));

      if (addCourse.fulfilled.match(result)) {
        console.log("Course added successfully:", result.payload);
        toast.success("Course added successfully!");
        // Refetch user details to update createdCourses
        await dispatch(getUserDetails());
        setIsModalOpen(false);
        setCourseForm({
          title: "",
          price: "",
          duration: "",
          category: "",
          description: "",
          thumbnail: null,
        });
      } else if (addCourse.rejected.match(result)) {
        console.error("Failed to add course:", result.payload);
        alert(result.payload?.message || "Failed to add course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert(error.message || "An error occurred while adding the course");
    }
  };

  // Add new state for video modal and form
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    course: "",
    video: null,
    thumbnail: null,
  });

  // Handle video form input changes
  const handleVideoInputChange = (e) => {
    const { name, value, files } = e.target;
    setVideoForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle video form submission
  const handleAddVideo = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!videoForm.title || !videoForm.description || !videoForm.course) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if either videoUrl is provided or video file is uploaded
    if (!videoForm.videoUrl && !videoForm.video) {
      alert("Please provide either a video URL or upload a video file");
      return;
    }

    // Check if thumbnail is provided
    if (!videoForm.thumbnail) {
      alert("Please upload a thumbnail");
      return;
    }

    // Validate file types
    if (videoForm.video && !videoForm.video.type.startsWith("video/")) {
      alert("Please upload a valid video file");
      return;
    }

    if (!videoForm.thumbnail.type.startsWith("image/")) {
      alert("Please upload a valid image file for thumbnail");
      return;
    }

    // Validate file sizes
    if (videoForm.video && videoForm.video.size > 100 * 1024 * 1024) {
      // 100MB limit
      alert("Video file size should be less than 100MB");
      return;
    }

    if (videoForm.thumbnail.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("Thumbnail file size should be less than 5MB");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("title", videoForm.title);
      formData.append("description", videoForm.description);
      formData.append("course", videoForm.course);
      if (videoForm.videoUrl) {
        formData.append("videoUrl", videoForm.videoUrl);
      }
      if (videoForm.video) {
        formData.append("video", videoForm.video);
      }
      formData.append("thumbnail", videoForm.thumbnail);

      const result = await dispatch(addVideo(formData));
      if (addVideo.fulfilled.match(result)) {
        toast.success("Video added successfully!");
        await dispatch(getUserDetails());
        setIsVideoModalOpen(false);
        setVideoForm({
          title: "",
          description: "",
          videoUrl: "",
          course: "",
          video: null,
          thumbnail: null,
        });
      } else if (addVideo.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to add video");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while adding the video");
    }
  };

  // Map the user data from Redux
  const instructorProfile = user
    ? {
        name: user?.fullname || "N/A",
        email: user?.email || "N/A",
        applicationStatus:
          user?.instructorProfile?.applicationStatus || "pending_verification",
        isApproved: user?.instructorProfile?.isApproved || {
          status: "pending",
        },
        expertise: user?.instructorProfile?.expertise || "N/A",
        bio: user?.instructorProfile?.bio || "N/A",
        documents: user?.instructorProfile?.documents || null,
        createdCourses: user?.instructorProfile?.createdCourses || [],
        isVerified: user?.isVerified || false,
        role: user?.role || "instructor",
        enrolledCourses: user?.enrolledCourses || [],
        isOflineStudent: user?.isOflineStudent || false,
        createdAt: user?.createdAt || "N/A",
        updatedAt: user?.updatedAt || "N/A",
      }
    : {
        name: "Loading...",
        email: "N/A",
        applicationStatus: "pending_verification",
        isApproved: { status: "pending" },
        expertise: "N/A",
        bio: "N/A",
        documents: null,
        createdCourses: [],
        isVerified: false,
        role: "instructor",
        enrolledCourses: [],
        isOflineStudent: false,
        createdAt: "N/A",
        updatedAt: "N/A",
      };

  // Add console logs to debug the data
  console.log("=== User Data Debug ===");
  console.log("User:", user);
  console.log("Mapped Profile:", instructorProfile);
  console.log("=====================");

  // Add new state for live class menu
  const [activeMenu, setActiveMenu] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Get the stored menu from localStorage or default to 'dashboard'
      return localStorage.getItem("instructorActiveMenu") || "dashboard";
    }
    return "dashboard";
  });

  // Update the setActiveMenu function to also save to localStorage
  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    if (typeof window !== "undefined") {
      localStorage.setItem("instructorActiveMenu", menu);
    }
  };

  // Add new state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  // Add new state for edit video modal
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [editVideoForm, setEditVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    course: "",
    video: null,
    thumbnail: null,
  });

  // Add handleEditVideoInputChange function
  const handleEditVideoInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditVideoForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Add handleEditVideo function
  const handleEditVideo = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !editVideoForm.title ||
      !editVideoForm.description ||
      !editVideoForm.course
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("videoId", videoToEdit._id);
      formData.append("title", editVideoForm.title);
      formData.append("description", editVideoForm.description);
      formData.append("course", editVideoForm.course);
      if (editVideoForm.videoUrl) {
        formData.append("videoUrl", editVideoForm.videoUrl);
      }
      if (editVideoForm.video) {
        formData.append("video", editVideoForm.video);
      }
      if (editVideoForm.thumbnail) {
        formData.append("thumbnail", editVideoForm.thumbnail);
      }

      const result = await dispatch(editVideo(formData));
      if (editVideo.fulfilled.match(result)) {
        toast.success("Video updated successfully!");
        await dispatch(getUserDetails());
        setIsEditVideoModalOpen(false);
        setVideoToEdit(null);
        setEditVideoForm({
          title: "",
          description: "",
          videoUrl: "",
          course: "",
          video: null,
          thumbnail: null,
        });
      } else if (editVideo.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to update video");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the video"
      );
    }
  };

  // Add new state for edit course modal
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [editCourseForm, setEditCourseForm] = useState({
    title: "",
    price: "",
    duration: "",
    category: "",
    description: "",
    thumbnail: null,
  });

  // Add handleEditCourseInputChange function
  const handleEditCourseInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditCourseForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Add handleEditCourse function
  const handleEditCourse = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !editCourseForm.title ||
      !editCourseForm.price ||
      !editCourseForm.duration ||
      !editCourseForm.category ||
      !editCourseForm.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("courseId", courseToEdit._id);
      formData.append("title", editCourseForm.title);
      formData.append("price", editCourseForm.price);
      formData.append("duration", editCourseForm.duration);
      formData.append("category", editCourseForm.category);
      formData.append("description", editCourseForm.description);
      if (editCourseForm.thumbnail) {
        formData.append("thumbnail", editCourseForm.thumbnail);
      }

      const result = await dispatch(editCourse(formData));
      if (editCourse.fulfilled.match(result)) {
        toast.success("Course updated successfully!");
        await dispatch(getUserDetails());
        setIsEditCourseModalOpen(false);
        setCourseToEdit(null);
        setEditCourseForm({
          title: "",
          price: "",
          duration: "",
          category: "",
          description: "",
          thumbnail: null,
        });
      } else if (editCourse.rejected.match(result)) {
        toast.error(result.payload?.message || "Failed to update course");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the course"
      );
    }
  };

  // Content for each menu
  const renderMainContent = () => {
    if (activeMenu === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#00965f]/10 p-3 rounded-full">
                <FaUser className="h-8 w-8 text-[#00965f]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome, {instructorProfile.name}!
                </h2>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your courses today.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {instructorProfile.createdCourses?.length || 0}
                  </h3>
                </div>
                <div className="bg-[#00965f]/10 p-3 rounded-full">
                  <FaBook className="h-6 w-6 text-[#00965f]" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">↑</span>
                  <span>Active courses</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {instructorProfile.enrolledCourses?.length || 0}
                  </h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <FaUsers className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">↑</span>
                  <span>Enrolled students</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Videos
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {instructorProfile.createdCourses?.reduce(
                      (acc, course) => acc + (course.videos?.length || 0),
                      0
                    ) || 0}
                  </h3>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <FaVideo className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">↑</span>
                  <span>Uploaded videos</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1 capitalize">
                    {instructorProfile.isApproved.status}
                  </h3>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <FaChartLine className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span
                    className={`${
                      instructorProfile.isApproved.status === "approved"
                        ? "text-green-500"
                        : "text-yellow-500"
                    } mr-2`}
                  >
                    {instructorProfile.isApproved.status === "approved"
                      ? "✓"
                      : "•"}
                  </span>
                  <span>Account status</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Activity
                </h3>
                <button className="text-[#00965f] hover:text-[#007f4f] text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {instructorProfile.createdCourses?.slice(0, 5).map((course) => (
                  <div
                    key={course._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-[#00965f]/10 p-2 rounded-full">
                      <FaBook className="h-4 w-4 text-[#00965f]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          {course.title}
                        </p>
                        <span className="text-sm text-gray-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.videos?.length || 0} videos •{" "}
                        {course.enrolledStudents?.length || 0} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center gap-3 p-4 bg-[#00965f]/10 rounded-lg hover:bg-[#00965f]/20 transition-colors"
                >
                  <FaPlusSquare className="h-5 w-5 text-[#00965f]" />
                  <span className="font-medium text-gray-800">
                    Add New Course
                  </span>
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-full flex items-center gap-3 p-4 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors"
                >
                  <FaVideo className="h-5 w-5 text-purple-500" />
                  <span className="font-medium text-gray-800">
                    Add New Video
                  </span>
                </button>
                <button
                  onClick={() => router.push("/banglore/instructor/profile")}
                  className="w-full flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <FaUser className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-gray-800">
                    Edit Profile
                  </span>
                </button>
              </div>

              {/* Profile Status */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verification</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        instructorProfile.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {instructorProfile.isVerified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Application</span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {instructorProfile.applicationStatus.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm text-gray-800">
                      {new Date(
                        instructorProfile.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeMenu === "my-courses") {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#00965f] p-3 rounded-full">
                <FaGraduationCap className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                My Courses
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00965f] text-white px-4 py-2 rounded-lg hover:bg-[#007f4f] transition duration-300 flex items-center gap-2"
            >
              <FaPlusSquare className="h-5 w-5" />
              Add New Course
            </button>
          </div>

          {instructorProfile.createdCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thumbnail
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructorProfile.createdCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="relative w-32 h-20">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <FaBook className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            Category: {course.category}
                          </div>
                          <div className="text-sm text-gray-600">
                            Price: ₹
                            {typeof course.price === "object"
                              ? course.price.$numberDecimal
                              : course.price}
                          </div>
                          <div className="text-sm text-gray-600">
                            Duration: {course.duration} hours
                          </div>
                          <div className="text-sm text-gray-600">
                            Videos: {course.videos?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Students: {course.enrolledStudents?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {course.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.isApproved.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              const modal = document.createElement("div");
                              modal.className =
                                "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";
                              modal.innerHTML = `
                                <div class="relative w-full max-w-4xl mx-4 bg-white rounded-xl p-6">
                                  <button class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                  <h3 class="text-xl font-semibold text-gray-800 mb-4">${
                                    course.title
                                  } - Videos</h3>
                                  <div class="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                    ${
                                      course.videos && course.videos.length > 0
                                        ? course.videos
                                            .map(
                                              (video) => `
                                        <div class="bg-gray-50 rounded-lg p-4">
                                          <div class="flex items-start gap-4">
                                            <div class="relative w-48 h-32 flex-shrink-0">
                                              ${
                                                video.thumbnail
                                                  ? `<img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover rounded" />`
                                                  : `<div class="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                    <FaVideo class="h-8 w-8 text-gray-400" />
                                                  </div>`
                                              }
                                            <button
                                              onclick="playVideo('${
                                                video.videoUrl ||
                                                URL.createObjectURL(video.video)
                                              }')"
                                              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                              <FaPlay class="h-6 w-6 text-white" />
                                            </button>
                                          </div>
                                          <div class="flex-1">
                                            <h4 class="font-medium text-gray-800 mb-1">${
                                              video.title
                                            }</h4>
                                            <p class="text-sm text-gray-600 mb-2">${
                                              video.description
                                            }</p>
                                            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              video.isApproved?.status ===
                                              "approved"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }">
                                              ${
                                                video.isApproved?.status ===
                                                "approved"
                                                  ? "Approved"
                                                  : "Pending"
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      `
                                            )
                                            .join("")
                                        : '<p class="text-gray-600 text-center py-4">No videos available for this course</p>'
                                    }
                                  </div>
                                </div>
                              `;
                              document.body.appendChild(modal);
                              const closeButton = modal.querySelector("button");
                              closeButton.onclick = () => {
                                document.body.removeChild(modal);
                              };
                            }}
                            className="text-[#00965f] hover:text-[#007f4f] font-medium"
                          >
                            View Videos
                          </button>
                          <button
                            className="text-[#00965f] hover:text-[#007f4f] font-medium"
                            onClick={() => {
                              setCourseToEdit(course);
                              setEditCourseForm({
                                title: course.title,
                                price:
                                  typeof course.price === "object"
                                    ? course.price.$numberDecimal
                                    : course.price,
                                duration: course.duration,
                                category: course.category,
                                description: course.description,
                                thumbnail: null,
                              });
                              setIsEditCourseModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No courses created yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#00965f] text-white px-6 py-2 rounded-lg hover:bg-[#007f4f] transition duration-300"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      );
    }

    if (activeMenu === "my-videos") {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#00965f] p-3 rounded-full">
                <FaVideo className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">My Videos</h2>
            </div>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="bg-[#00965f] text-white px-4 py-2 rounded-lg hover:bg-[#007f4f] transition duration-300 flex items-center gap-2"
            >
              <FaPlusSquare className="h-5 w-5" />
              Add New Video
            </button>
          </div>

          {instructorProfile.createdCourses?.length > 0 ? (
            <div className="space-y-8">
              {instructorProfile.createdCourses.map((course) => (
                <div key={course._id} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                    {course.title}
                  </h3>
                  {course.videos && course.videos.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thumbnail
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {course.videos.map((video) => (
                            <tr key={video._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="relative w-32 h-20">
                                  {video.thumbnail ? (
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                      <FaVideo className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      const videoUrl =
                                        video.videoUrl ||
                                        URL.createObjectURL(video.video);
                                      const modal = document.createElement(
                                        "div"
                                      );
                                      modal.className =
                                        "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";
                                      modal.innerHTML = `
                                        <div class="relative w-full max-w-4xl mx-4">
                                          <button class="absolute -top-10 right-0 text-white hover:text-gray-300">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                          <video class="w-full rounded-lg" controls>
                                            <source src="${videoUrl}" type="video/mp4">
                                            Your browser does not support the video tag.
                                          </video>
                                        </div>
                                      `;
                                      document.body.appendChild(modal);
                                      const closeButton = modal.querySelector(
                                        "button"
                                      );
                                      closeButton.onclick = () => {
                                        document.body.removeChild(modal);
                                      };
                                    }}
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <FaPlay className="h-6 w-6 text-white" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {video.title}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-gray-600 max-w-md line-clamp-2">
                                  {video.description}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    video.isApproved?.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {video.isApproved?.status === "approved"
                                    ? "Approved"
                                    : "Pending"}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <div className="flex gap-3">
                                  <button
                                    className="text-[#00965f] hover:text-[#007f4f] font-medium"
                                    onClick={() => {
                                      setVideoToEdit(video);
                                      setEditVideoForm({
                                        title: video.title,
                                        description: video.description,
                                        videoUrl: video.videoUrl || "",
                                        course: course.title,
                                        video: null,
                                        thumbnail: null,
                                      });
                                      setIsEditVideoModalOpen(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-[#00965f] hover:text-[#007f4f] font-medium"
                                    onClick={() => {
                                      setVideoToDelete(video);
                                      setIsDeleteModalOpen(true);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        No videos added to this course yet
                      </p>
                      <button
                        onClick={() => {
                          setVideoForm((prev) => ({
                            ...prev,
                            course: course.title,
                          }));
                          setIsVideoModalOpen(true);
                        }}
                        className="bg-[#00965f] text-white px-6 py-2 rounded-lg hover:bg-[#007f4f] transition duration-300"
                      >
                        Add First Video
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No courses available to add videos
              </p>
              <button
                onClick={() => setActiveMenu("my-courses")}
                className="bg-[#00965f] text-white px-6 py-2 rounded-lg hover:bg-[#007f4f] transition duration-300"
              >
                Create a Course First
              </button>
            </div>
          )}
        </div>
      );
    }

    if (activeMenu === "live-classes") {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#00965f] p-3 rounded-full">
                <FaChalkboardTeacher className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Live Classes
              </h2>
            </div>
            <button className="bg-[#00965f] text-white px-4 py-2 rounded-lg hover:bg-[#007f4f] transition duration-300 flex items-center gap-2">
              <FaPlusSquare className="h-5 w-5" />
              Schedule New Class
            </button>
          </div>

          <div className="space-y-6">
            {/* Upcoming Classes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upcoming Classes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        React.js Masterclass
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Upcoming
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <FaCalendarAlt className="inline mr-2" />
                        Today, 2:00 PM
                      </p>
                      <p className="text-sm text-gray-600">Duration: 1 hour</p>
                      <p className="text-sm text-gray-600">
                        Students: 25 enrolled
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 bg-[#00965f] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#007f4f] transition duration-300">
                        Start Class
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition duration-300">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Classes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Past Classes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recording
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Node.js Fundamentals
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            Yesterday, 3:00 PM
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">1 hour</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            20 students
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button className="text-[#00965f] hover:text-[#007f4f] text-sm font-medium">
                            View Recording
                          </button>
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

    if (activeMenu === "class-history") {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="bg-[#00965f] p-3 rounded-full mr-4">
              <FaHistory className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Class History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        React.js Masterclass
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        2024-03-{item}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">1 hour</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        18/25 students
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button className="text-[#00965f] hover:text-[#007f4f] font-medium mr-3">
                        View Recording
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium">
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeMenu === "students") {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="bg-[#00965f] p-3 rounded-full mr-4">
              <FaUserFriends className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Students Enrolled
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">John Doe</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    React.js Masterclass
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap">Jane Smith</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    Node.js Fundamentals
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  // Add this before the return statement
  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      const result = await dispatch(deleteVideo(videoToDelete._id));
      if (deleteVideo.fulfilled.match(result)) {
        toast.success("Video deleted successfully!");
        await dispatch(getUserDetails());
        setIsDeleteModalOpen(false);
        setVideoToDelete(null);
      } else {
        toast.error(result.payload?.message || "Failed to delete video");
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the video"
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header with Swiper Menu */}
      <div className="lg:hidden bg-[#00965f] text-white p-4 flex flex-col sticky top-0 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaUser className="h-6 w-6" />
            <span className="text-xl font-bold">Instructor</span>
          </div>
        </div>
        <Swiper spaceBetween={10} slidesPerView="auto" className="w-full">
          <SwiperSlide className="!w-auto">
            <button
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeMenu === "dashboard"
                  ? "bg-white text-[#00965f]"
                  : "hover:bg-[#007f4f]"
              }`}
              onClick={() => handleMenuChange("dashboard")}
            >
              Dashboard
            </button>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <button
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeMenu === "my-courses"
                  ? "bg-white text-[#00965f]"
                  : "hover:bg-[#007f4f]"
              }`}
              onClick={() => handleMenuChange("my-courses")}
            >
              My Courses
            </button>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <button
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeMenu === "my-videos"
                  ? "bg-white text-[#00965f]"
                  : "hover:bg-[#007f4f]"
              }`}
              onClick={() => handleMenuChange("my-videos")}
            >
              My Videos
            </button>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <button
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeMenu === "live-classes"
                  ? "bg-white text-[#00965f]"
                  : "hover:bg-[#007f4f]"
              }`}
              onClick={() => handleMenuChange("live-classes")}
            >
              Live Classes
            </button>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <button
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeMenu === "class-history"
                  ? "bg-white text-[#00965f]"
                  : "hover:bg-[#007f4f]"
              }`}
              onClick={() => handleMenuChange("class-history")}
            >
              Class History
            </button>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <button
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                activeMenu === "students"
                  ? "bg-white text-[#00965f]"
                  : "hover:bg-[#007f4f]"
              }`}
              onClick={() => handleMenuChange("students")}
            >
              Students
            </button>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Sidebar */}
      <aside className=" lg:block w-64 bg-[#00965f] text-white flex flex-col py-8 px-4 min-h-screen fixed top-0 left-0 z-40">
        <div className="hidden lg:flex mb-10 items-center gap-2">
          <FaUser className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold">Instructor</span>
        </div>
        <nav className="flex flex-col gap-4">
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-colors ${
              activeMenu === "dashboard"
                ? "bg-white text-[#00965f]"
                : "hover:bg-[#007f4f]"
            }`}
            onClick={() => handleMenuChange("dashboard")}
          >
            <FaChartLine className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-colors ${
              activeMenu === "my-courses"
                ? "bg-white text-[#00965f]"
                : "hover:bg-[#007f4f]"
            }`}
            onClick={() => handleMenuChange("my-courses")}
          >
            <FaBook className="h-5 w-5" />
            <span>My Courses</span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-colors ${
              activeMenu === "my-videos"
                ? "bg-white text-[#00965f]"
                : "hover:bg-[#007f4f]"
            }`}
            onClick={() => handleMenuChange("my-videos")}
          >
            <FaVideo className="h-5 w-5" />
            <span>My Videos</span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-colors ${
              activeMenu === "live-classes"
                ? "bg-white text-[#00965f]"
                : "hover:bg-[#007f4f]"
            }`}
            onClick={() => handleMenuChange("live-classes")}
          >
            <FaChalkboardTeacher className="h-5 w-5" />
            <span>Live Classes</span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-colors ${
              activeMenu === "class-history"
                ? "bg-white text-[#00965f]"
                : "hover:bg-[#007f4f]"
            }`}
            onClick={() => handleMenuChange("class-history")}
          >
            <FaHistory className="h-5 w-5" />
            <span>Class History</span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-md focus:outline-none transition-colors ${
              activeMenu === "students"
                ? "bg-white text-[#00965f]"
                : "hover:bg-[#007f4f]"
            }`}
            onClick={() => handleMenuChange("students")}
          >
            <FaUserFriends className="h-5 w-5" />
            <span>Students Enrolled</span>
          </button>
        </nav>
        <div className="mt-auto pt-10">
          <button
            onClick={() => {
              // Add logout logic here
              router.push("/banglore/login");
            }}
            className="w-full bg-white text-[#00965f] px-4 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
          >
            <FaSignOutAlt className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 lg:ml-64">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
          {activeMenu === "dashboard"
            ? "Dashboard"
            : activeMenu === "my-courses"
            ? "My Courses"
            : activeMenu === "my-videos"
            ? "My Videos"
            : activeMenu === "live-classes"
            ? "Live Classes"
            : activeMenu === "class-history"
            ? "Class History"
            : "Instructor Dashboard"}
        </h1>

        {renderMainContent()}

        {/* Add Course Modal */}
        {isModalOpen && (
          <div className={modalStyles.overlay}>
            <div className={modalStyles.container}>
              <div className={modalStyles.header}>
                <h2 className={modalStyles.title}>Add New Course</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={modalStyles.closeButton}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddCourse} className={modalStyles.form}>
                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleInputChange}
                    className={modalStyles.input}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={courseForm.price}
                    onChange={handleInputChange}
                    className={modalStyles.input}
                    placeholder="Enter course price"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Duration (in hours)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleInputChange}
                    className={modalStyles.input}
                    placeholder="e.g., 45"
                    min="1"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Category</label>
                  <select
                    name="category"
                    value={courseForm.category}
                    onChange={handleInputChange}
                    className={modalStyles.select}
                    required
                  >
                    <option value="">Select a category</option>
                    <optgroup label="Web Development">
                      <option value="Frontend Development">
                        Frontend Development
                      </option>
                      <option value="Backend Development">
                        Backend Development
                      </option>
                      <option value="Full Stack Development">
                        Full Stack Development
                      </option>
                      <option value="Web Design">Web Design</option>
                    </optgroup>
                    <optgroup label="Data Science & AI">
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Deep Learning">Deep Learning</option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>
                    </optgroup>
                    <optgroup label="Mobile Development">
                      <option value="Android Development">
                        Android Development
                      </option>
                      <option value="iOS Development">iOS Development</option>
                      <option value="Cross-Platform Development">
                        Cross-Platform Development
                      </option>
                    </optgroup>
                    <optgroup label="Cloud & DevOps">
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="DevOps">DevOps</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                    </optgroup>
                    <optgroup label="Digital Marketing">
                      <option value="SEO">SEO</option>
                      <option value="Social Media Marketing">
                        Social Media Marketing
                      </option>
                      <option value="Content Marketing">
                        Content Marketing
                      </option>
                      <option value="Digital Advertising">
                        Digital Advertising
                      </option>
                    </optgroup>
                    <optgroup label="Programming Languages">
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="C++">C++</option>
                    </optgroup>
                    <optgroup label="Database">
                      <option value="SQL">SQL</option>
                      <option value="NoSQL">NoSQL</option>
                      <option value="Database Design">Database Design</option>
                    </optgroup>
                    <optgroup label="Cybersecurity">
                      <option value="Network Security">Network Security</option>
                      <option value="Ethical Hacking">Ethical Hacking</option>
                      <option value="Information Security">
                        Information Security
                      </option>
                    </optgroup>
                  </select>
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Description</label>
                  <textarea
                    name="description"
                    value={courseForm.description}
                    onChange={handleInputChange}
                    className={modalStyles.textarea}
                    placeholder="Enter course description"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Thumbnail</label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleInputChange}
                    className={modalStyles.fileInput}
                    accept="image/*"
                    required
                  />
                  {courseForm.thumbnail && (
                    <div className={modalStyles.filePreview}>
                      Selected file: {courseForm.thumbnail.name}
                    </div>
                  )}
                </div>

                <button type="submit" className={modalStyles.submitButton}>
                  {courseLoading ? "Adding..." : "Add Course"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Add Video Modal */}
        {isVideoModalOpen && (
          <div className={modalStyles.overlay}>
            <div className={modalStyles.container}>
              <div className={modalStyles.header}>
                <h2 className={modalStyles.title}>Add New Video</h2>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className={modalStyles.closeButton}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className={modalStyles.form}>
                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Course</label>
                  <select
                    name="course"
                    value={videoForm.course}
                    onChange={handleVideoInputChange}
                    className={modalStyles.select}
                    required
                  >
                    <option value="">Select a course</option>
                    {instructorProfile.createdCourses.map((course) => (
                      <option key={course._id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={videoForm.title}
                    onChange={handleVideoInputChange}
                    className={modalStyles.input}
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Description</label>
                  <textarea
                    name="description"
                    value={videoForm.description}
                    onChange={handleVideoInputChange}
                    className={modalStyles.textarea}
                    placeholder="Enter video description"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Video URL (Optional if uploading video)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={videoForm.videoUrl}
                    onChange={handleVideoInputChange}
                    className={modalStyles.input}
                    placeholder="Enter video URL"
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Upload Video (Optional if providing URL)
                  </label>
                  <input
                    type="file"
                    name="video"
                    onChange={handleVideoInputChange}
                    className={modalStyles.fileInput}
                    accept="video/*"
                  />
                  {videoForm.video && (
                    <div className={modalStyles.filePreview}>
                      Selected file: {videoForm.video.name}
                    </div>
                  )}
                  {videoForm.video && courseLoading && uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading: {uploadProgress}%</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <ProgressBar
                        completed={uploadProgress}
                        bgColor="#00965f"
                        height="10px"
                        borderRadius="5px"
                        labelAlignment="center"
                        labelColor="#ffffff"
                        labelSize="12px"
                      />
                    </div>
                  )}
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Thumbnail</label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleVideoInputChange}
                    className={modalStyles.fileInput}
                    accept="image/*"
                    required
                  />
                  {videoForm.thumbnail && (
                    <div className={modalStyles.filePreview}>
                      Selected file: {videoForm.thumbnail.name}
                    </div>
                  )}
                </div>

                <button type="submit" className={modalStyles.submitButton}>
                  Add Video
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className={modalStyles.overlay}>
            <div className={modalStyles.container}>
              <div className={modalStyles.header}>
                <h2 className={modalStyles.title}>Delete Video</h2>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setVideoToDelete(null);
                  }}
                  className={modalStyles.closeButton}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="text-gray-600 mb-6">
                <p className="mb-4">
                  Are you sure you want to delete the video "
                  {videoToDelete?.title}"?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>

              <div className={modalStyles.buttonGroup}>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setVideoToDelete(null);
                  }}
                  className={modalStyles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteVideo}
                  className={modalStyles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {isEditVideoModalOpen && (
          <div className={modalStyles.overlay}>
            <div className={modalStyles.container}>
              <div className={modalStyles.header}>
                <h2 className={modalStyles.title}>Edit Video</h2>
                <button
                  onClick={() => {
                    setIsEditVideoModalOpen(false);
                    setVideoToEdit(null);
                    setEditVideoForm({
                      title: "",
                      description: "",
                      videoUrl: "",
                      course: "",
                      video: null,
                      thumbnail: null,
                    });
                  }}
                  className={modalStyles.closeButton}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditVideo} className={modalStyles.form}>
                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Course</label>
                  <select
                    name="course"
                    value={editVideoForm.course}
                    onChange={handleEditVideoInputChange}
                    className={modalStyles.select}
                    required
                  >
                    <option value="">Select a course</option>
                    {instructorProfile.createdCourses.map((course) => (
                      <option key={course._id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editVideoForm.title}
                    onChange={handleEditVideoInputChange}
                    className={modalStyles.input}
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Description</label>
                  <textarea
                    name="description"
                    value={editVideoForm.description}
                    onChange={handleEditVideoInputChange}
                    className={modalStyles.textarea}
                    placeholder="Enter video description"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Video URL (Optional if uploading video)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={editVideoForm.videoUrl}
                    onChange={handleEditVideoInputChange}
                    className={modalStyles.input}
                    placeholder="Enter video URL"
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Upload New Video (Optional if providing URL)
                  </label>
                  <input
                    type="file"
                    name="video"
                    onChange={handleEditVideoInputChange}
                    className={modalStyles.fileInput}
                    accept="video/*"
                  />
                  {editVideoForm.video && (
                    <div className={modalStyles.filePreview}>
                      Selected file: {editVideoForm.video.name}
                    </div>
                  )}
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Upload New Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleEditVideoInputChange}
                    className={modalStyles.fileInput}
                    accept="image/*"
                  />
                  {editVideoForm.thumbnail && (
                    <div className={modalStyles.filePreview}>
                      Selected file: {editVideoForm.thumbnail.name}
                    </div>
                  )}
                </div>

                <button type="submit" className={modalStyles.submitButton}>
                  Update Video
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {isEditCourseModalOpen && (
          <div className={modalStyles.overlay}>
            <div className={modalStyles.container}>
              <div className={modalStyles.header}>
                <h2 className={modalStyles.title}>Edit Course</h2>
                <button
                  onClick={() => {
                    setIsEditCourseModalOpen(false);
                    setCourseToEdit(null);
                    setEditCourseForm({
                      title: "",
                      price: "",
                      duration: "",
                      category: "",
                      description: "",
                      thumbnail: null,
                    });
                  }}
                  className={modalStyles.closeButton}
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditCourse} className={modalStyles.form}>
                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editCourseForm.title}
                    onChange={handleEditCourseInputChange}
                    className={modalStyles.input}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editCourseForm.price}
                    onChange={handleEditCourseInputChange}
                    className={modalStyles.input}
                    placeholder="Enter course price"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Duration (in hours)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={editCourseForm.duration}
                    onChange={handleEditCourseInputChange}
                    className={modalStyles.input}
                    placeholder="e.g., 45"
                    min="1"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Category</label>
                  <select
                    name="category"
                    value={editCourseForm.category}
                    onChange={handleEditCourseInputChange}
                    className={modalStyles.select}
                    required
                  >
                    <option value="">Select a category</option>
                    <optgroup label="Web Development">
                      <option value="Frontend Development">
                        Frontend Development
                      </option>
                      <option value="Backend Development">
                        Backend Development
                      </option>
                      <option value="Full Stack Development">
                        Full Stack Development
                      </option>
                      <option value="Web Design">Web Design</option>
                    </optgroup>
                    <optgroup label="Data Science & AI">
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Deep Learning">Deep Learning</option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>
                    </optgroup>
                    <optgroup label="Mobile Development">
                      <option value="Android Development">
                        Android Development
                      </option>
                      <option value="iOS Development">iOS Development</option>
                      <option value="Cross-Platform Development">
                        Cross-Platform Development
                      </option>
                    </optgroup>
                    <optgroup label="Cloud & DevOps">
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="DevOps">DevOps</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                    </optgroup>
                    <optgroup label="Digital Marketing">
                      <option value="SEO">SEO</option>
                      <option value="Social Media Marketing">
                        Social Media Marketing
                      </option>
                      <option value="Content Marketing">
                        Content Marketing
                      </option>
                      <option value="Digital Advertising">
                        Digital Advertising
                      </option>
                    </optgroup>
                    <optgroup label="Programming Languages">
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="C++">C++</option>
                    </optgroup>
                    <optgroup label="Database">
                      <option value="SQL">SQL</option>
                      <option value="NoSQL">NoSQL</option>
                      <option value="Database Design">Database Design</option>
                    </optgroup>
                    <optgroup label="Cybersecurity">
                      <option value="Network Security">Network Security</option>
                      <option value="Ethical Hacking">Ethical Hacking</option>
                      <option value="Information Security">
                        Information Security
                      </option>
                    </optgroup>
                  </select>
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>Description</label>
                  <textarea
                    name="description"
                    value={editCourseForm.description}
                    onChange={handleEditCourseInputChange}
                    className={modalStyles.textarea}
                    placeholder="Enter course description"
                    required
                  />
                </div>

                <div className={modalStyles.inputGroup}>
                  <label className={modalStyles.label}>
                    Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleEditCourseInputChange}
                    className={modalStyles.fileInput}
                    accept="image/*"
                  />
                  {editCourseForm.thumbnail && (
                    <div className={modalStyles.filePreview}>
                      Selected file: {editCourseForm.thumbnail.name}
                    </div>
                  )}
                </div>

                <button type="submit" className={modalStyles.submitButton}>
                  Update Course
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorPanel;
