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
  FaDownload,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";

const InhouseStudentDashboard = () => {
  const dispatch = useDispatch();
  const { studentDetails, loading, error } = useSelector(
    (state) => state.inhouse
  );
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Ready");
    };
  }, []);

  const initializePlayer = (videoId) => {
    if (player) {
      player.destroy();
    }

    const newPlayer = new window.YT.Player("youtube-player", {
      height: "100%",
      width: "100%",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });

    setPlayer(newPlayer);
  };

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const handleVideoClick = (video) => {
    const videoId = video.videoUrl.includes("youtube.com")
      ? video.videoUrl.split("v=")[1]?.split("&")[0]
      : video.videoUrl.split("youtu.be/")[1];

    setSelectedVideo({
      ...video,
      videoId,
    });

    // Initialize player after a short delay to ensure the modal is rendered
    setTimeout(() => {
      initializePlayer(videoId);
    }, 100);
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (player) {
      setCurrentTime(player.getCurrentTime());
    }
  };

  useEffect(() => {
    const interval = setInterval(handleTimeUpdate, 1000);
    return () => clearInterval(interval);
  }, [player]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const seekTo = (time) => {
    if (player) {
      player.seekTo(time);
    }
  };

  const toggleFullscreen = () => {
    const playerElement = document.getElementById("youtube-player");
    if (!playerElement) return;

    if (!isFullscreen) {
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      } else if (playerElement.webkitRequestFullscreen) {
        playerElement.webkitRequestFullscreen();
      } else if (playerElement.msRequestFullscreen) {
        playerElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  if (!mounted) return null;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00965f]"></div>
      </div>
    );
  }

  const studentData =
    studentDetails || JSON.parse(localStorage.getItem("inHouseStudent"));

  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-20">
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

  const getVideoEmbedUrl = (videoUrl) => {
    if (!videoUrl) return "";

    // Handle YouTube URLs
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.includes("youtube.com")
        ? videoUrl.split("v=")[1]?.split("&")[0]
        : videoUrl.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle Vimeo URLs
    if (videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Handle direct video URLs
    return videoUrl;
  };

  const getVideoThumbnail = (video) => {
    if (video.thumbnail) return video.thumbnail;

    if (
      video.videoUrl?.includes("youtube.com") ||
      video.videoUrl?.includes("youtu.be")
    ) {
      const videoId = video.videoUrl.includes("youtube.com")
        ? video.videoUrl.split("v=")[1]?.split("&")[0]
        : video.videoUrl.split("youtu.be/")[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    return "/default-video-thumbnail.jpg";
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Render different sections based on active tab
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8 ">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#164758]">
                  Course Progress
                </h2>
                <button
                  onClick={() => setActiveSection("courses")}
                  className="flex items-center text-[#00965f] hover:text-[#008551] transition-colors"
                >
                  View All Courses
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                {studentData.myCourses?.map((course, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {course.course?.title}
                      </h3>
                      <span className="text-sm font-medium text-[#00965f]">
                        {Math.round((course.paidFee / course.finalPrice) * 100)}
                        % Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
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
          </div>
        );

      case "courses":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#164758]">My Courses</h2>
            <div className="grid grid-cols-1 gap-6">
              {studentData.myCourses?.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Collapsed View */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() =>
                      setExpandedCourse(expandedCourse === index ? null : index)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={course.course?.thumbnail}
                            alt={course.course?.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {course.course?.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {course.course?.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-sm font-medium text-[#00965f]">
                            {Math.round(
                              (course.paidFee / course.finalPrice) * 100
                            )}
                            % Complete
                          </span>
                          <div className="w-32 bg-gray-100 rounded-full h-2 mt-1">
                            <div
                              className="bg-[#00965f] h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (course.paidFee / course.finalPrice) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg
                            className={`w-6 h-6 transform transition-transform ${
                              expandedCourse === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {expandedCourse === index && (
                    <div className="border-t border-gray-100">
                      <div className="p-6">
                        {/* Course Details Section */}
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Course Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h5 className="text-sm font-medium text-gray-600 mb-2">
                                Course Information
                              </h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Category
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {course.course?.category}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Level</span>
                                  <span className="font-medium text-gray-800">
                                    {course.course?.level}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Duration
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {course.course?.duration} months
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Instructor
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {course.course?.instructor_name}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h5 className="text-sm font-medium text-gray-600 mb-2">
                                Payment Details
                              </h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Course Fee
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    ₹{course.course?.fee?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Discount
                                  </span>
                                  <span className="font-medium text-green-600">
                                    {course.course?.fee && course.finalPrice
                                      ? `-₹${(
                                          course.course.fee - course.finalPrice
                                        ).toLocaleString()}`
                                      : "₹0"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Final Price
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    ₹{course.finalPrice?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Paid Amount
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    ₹{course.paidFee?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Pending Amount
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    ₹
                                    {(
                                      course.finalPrice - course.paidFee
                                    )?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h5 className="text-sm font-medium text-gray-600 mb-2">
                                Progress
                              </h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Payment Progress
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {Math.round(
                                      (course.paidFee / course.finalPrice) * 100
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-[#00965f] h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${
                                        (course.paidFee / course.finalPrice) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Installments
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {course.installments || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status</span>
                                  <span
                                    className={`font-medium ${
                                      course.paidFee >= course.finalPrice
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                    }`}
                                  >
                                    {course.paidFee >= course.finalPrice
                                      ? "Fully Paid"
                                      : "Partially Paid"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Course Videos */}
                          <div className="space-y-4">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() =>
                                setExpandedSection(
                                  expandedSection === "videos" ? null : "videos"
                                )
                              }
                            >
                              <h4 className="font-semibold text-gray-800 flex items-center">
                                <FaBook className="mr-2 h-5 w-5 text-[#00965f]" />
                                Course Videos
                              </h4>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg
                                  className={`w-5 h-5 transform transition-transform ${
                                    expandedSection === "videos"
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                            {expandedSection === "videos" && (
                              <div className="space-y-3 mt-4">
                                {course.course?.videos?.length > 0 ? (
                                  course.course.videos.map((video) => (
                                    <div
                                      key={video._id}
                                      onClick={() => handleVideoClick(video)}
                                      className="bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden"
                                    >
                                      <div className="flex">
                                        <div className="relative w-40 h-24 flex-shrink-0">
                                          <Image
                                            src={getVideoThumbnail(video)}
                                            alt={video.title}
                                            fill
                                            className="object-cover"
                                          />
                                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                            <svg
                                              className="w-12 h-12 text-white"
                                              fill="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path d="M8 5v14l11-7z" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="p-4 flex-1">
                                          <h5 className="font-medium text-gray-800 mb-1">
                                            {video.title}
                                          </h5>
                                          <p className="text-sm text-gray-600 line-clamp-2">
                                            {video.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No videos available
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Course Documents */}
                          <div className="space-y-4">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() =>
                                setExpandedSection(
                                  expandedSection === "documents"
                                    ? null
                                    : "documents"
                                )
                              }
                            >
                              <h4 className="font-semibold text-gray-800 flex items-center">
                                <FaDownload className="mr-2 h-5 w-5 text-[#00965f]" />
                                Course Documents
                              </h4>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg
                                  className={`w-5 h-5 transform transition-transform ${
                                    expandedSection === "documents"
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                            {expandedSection === "documents" && (
                              <div className="space-y-3 mt-4">
                                {course.course?.docs?.length > 0 ? (
                                  course.course.docs.map((doc, dIndex) => (
                                    <div
                                      key={dIndex}
                                      className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                          {doc.title}
                                        </span>
                                        <button className="text-[#00965f] hover:text-[#008551] transition-colors">
                                          <FaDownload className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No documents available
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-5xl">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedVideo.description}
                      </p>
                    </div>
                    <button
                      onClick={closeVideoModal}
                      className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "45%" }}
                    >
                      <div className="absolute inset-0 bg-black rounded-xl overflow-hidden">
                        <div
                          id="youtube-player"
                          className="w-full h-full"
                        ></div>
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="mt-4 space-y-2">
                      {/* Progress Bar */}
                      <div
                        className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const pos = (e.clientX - rect.left) / rect.width;
                          seekTo(pos * duration);
                        }}
                      >
                        <div
                          className="bg-[#00965f] h-2 rounded-full transition-all duration-200"
                          style={{
                            width: `${(currentTime / duration) * 100}%`,
                          }}
                        ></div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={togglePlay}
                            className="text-gray-700 hover:text-[#00965f] transition-colors"
                          >
                            {isPlaying ? (
                              <svg
                                className="w-8 h-8"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-8 h-8"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>
                          <span className="text-sm text-gray-600">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        <button
                          onClick={toggleFullscreen}
                          className="text-gray-700 hover:text-[#00965f] transition-colors"
                        >
                          {isFullscreen ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 9V4.5M9 9H4.5M15 9H19.5M15 9V4.5M15 15v4.5M15 15H4.5M15 15h4.5M9 15v4.5"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "exams":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#164758]">
              Upcoming Exams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.myCourses?.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">
                    {course.course?.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Next Exam</p>
                      <p className="font-medium text-gray-800">Not Scheduled</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">
                        Last Exam Score
                      </p>
                      <p className="font-medium text-gray-800">-</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certificates":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#164758]">
              My Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentData.myCourses?.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">
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
                    <button className="w-full bg-[#00965f] text-white py-3 rounded-xl hover:bg-[#008551] transition-colors flex items-center justify-center space-x-2">
                      <FaDownload className="h-4 w-4" />
                      <span>Download Certificate</span>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-20">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#164758] mb-2">
                Welcome, {studentData.name}!
              </h1>
              <p className="text-gray-600">Here's your learning dashboard</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setActiveSection("courses")}
                className="inline-flex items-center px-4 py-2 bg-[#00965f] text-white rounded-xl hover:bg-[#008551] transition-colors"
              >
                <FaBook className="mr-2 h-4 w-4" />
                View Courses
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-4 sm:gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
