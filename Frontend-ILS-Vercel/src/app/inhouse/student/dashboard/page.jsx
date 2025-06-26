"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getInhouseStudentDetails,
  inhouseStudentLogout,
} from "@/redux/features/inhouseSlice";
import {
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaGraduationCap,
  FaCertificate,
  FaDownload,
  FaArrowRight,
  FaInfoCircle,
  FaTag,
  FaChartPie,
  FaTrophy,
  FaListOl,
  FaCheckCircle,
  FaRupeeSign,
  FaPercent,
  FaReceipt,
  FaWallet,
  FaClock,
  FaMoneyBillWave,
  FaHourglassHalf,
  FaSignOutAlt,
  FaSitemap,
  FaFolderOpen,
  FaCreditCard,
  FaLayerGroup,
} from "react-icons/fa";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

const InhouseStudentDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
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
  const [activeInnerTab, setActiveInnerTab] = useState("overview");

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

  const handleLogout = () => {
    dispatch(inhouseStudentLogout());
    toast.success("Logged out successfully");
    router.push("/inhouse/student/login");
  };

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
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-blue-100">
                <div className="flex items-start justify-between">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaBook className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">
                      Enrolled Courses
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {studentData.myCourses?.length || 0}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-green-100">
                <div className="flex items-start justify-between">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaChartLine className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">
                      Overall Progress
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {studentData.overallProgress || 0}%
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-purple-100">
                <div className="flex items-start justify-between">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaCalendarAlt className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">
                      Next Class
                    </p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {studentData.nextClass || "TBA"}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-yellow-100">
                <div className="flex items-start justify-between">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FaUser className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                      {studentData.status || "Active"}
                    </h3>
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
          <div className="space-y-8">
            <h2 className="text-3xl font-extrabold text-[#164758] mb-6">My Courses</h2>
            <div className="grid grid-cols-1 gap-8">
              {studentData.myCourses?.map((course, index) => {
                const courseDetailTabs = [
                  { id: "overview", label: "Overview", icon: FaLayerGroup },
                  { id: "curriculum", label: "Curriculum", icon: FaSitemap },
                  { id: "resources", label: "Resources", icon: FaFolderOpen },
                  { id: "payment", label: "Payment", icon: FaCreditCard },
                ];
                return (
                <div
                  key={index}
                    className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col gap-6 items-center hover:shadow-3xl transition-all"
                >
                  {/* Collapsed View */}
                  <div
                      className="flex flex-col md:flex-row items-center md:items-stretch gap-6 p-8 cursor-pointer group-hover:bg-[#f8fafc] transition"
                      onClick={() => {
                        setExpandedCourse(expandedCourse === index ? null : index);
                        if (expandedCourse !== index) setActiveInnerTab("overview");
                      }}
                    >
                      <div className="relative h-28 w-44 flex-shrink-0 rounded-2xl overflow-hidden shadow">
                          <Image
                          src={course.course?.thumbnail || "/default-video-thumbnail.jpg"}
                            alt={course.course?.title}
                            fill
                          className="object-cover"
                          />
                        </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <h3 className="font-bold text-2xl text-[#164758] mb-1 flex items-center gap-2">
                            {course.course?.title}
                          </h3>
                        <p className="text-gray-500 text-base line-clamp-2 mb-2">
                            {course.course?.description}
                          </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <FaChartLine className="text-[#00965f] h-5 w-5" />
                            <span className="text-sm font-semibold text-gray-700">
                              {Math.round((course.paidFee / course.finalPrice) * 100)}% Complete
                          </span>
                          </div>
                          <div className="w-32 bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-[#00965f] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(course.paidFee / course.finalPrice) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                            Paid: ₹{course.paidFee?.toLocaleString()}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold">
                            Total: ₹{course.finalPrice?.toLocaleString()}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${course.paidFee >= course.finalPrice ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-700'}`}>
                            {course.paidFee >= course.finalPrice ? 'Fully Paid' : 'Partially Paid'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center">
                        <button className="text-[#00965f] hover:text-[#008551] bg-[#e6f9f2] rounded-full p-3 shadow transition-all">
                          <svg
                            className={`w-6 h-6 transform transition-transform ${expandedCourse === index ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                    </div>
                  </div>

                    {/* Expanded View with Tabs */}
                  {expandedCourse === index && (
                      <div className="border-t border-gray-100 bg-[#f8fafc]">
                        <div className="p-4 sm:p-8">
                          {/* Inner Tabs Navigation */}
                          <div className="border-b border-gray-200 mb-6">
                            <nav className="flex flex-wrap gap-2">
                              {courseDetailTabs.map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveInnerTab(tab.id)}
                                  className={`flex items-center gap-2 py-3 px-5 font-semibold text-base rounded-full transition-colors ${
                                    activeInnerTab === tab.id
                                      ? "bg-[#00965f] text-white shadow"
                                      : "text-gray-500 hover:text-[#00965f] hover:bg-[#e6f9f2]"
                                  }`}
                                >
                                  <tab.icon className="h-5 w-5" />
                                  <span>{tab.label}</span>
                                </button>
                              ))}
                            </nav>
                              </div>

                          {/* Inner Tab Content */}
                          <div className="p-2 sm:p-4">
                            {activeInnerTab === "overview" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                  <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4 border border-gray-100">
                                    <h5 className="text-lg font-bold text-[#164758] flex items-center gap-2">
                                  <FaInfoCircle className="h-5 w-5 text-[#00965f]" /> Course Details
                                </h5>
                                <div className="space-y-3 text-base">
                                  <div className="flex items-center gap-2">
                                    <FaTag className="text-[#00965f] h-4 w-4" />
                                    <span className="font-bold text-gray-900">Category:</span>
                                    <span className="text-gray-500 ml-auto">{course.course?.category}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FaChartLine className="text-[#00965f] h-4 w-4" />
                                    <span className="font-bold text-gray-900">Level:</span>
                                    <span className="text-gray-500 ml-auto">{course.course?.level}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FaClock className="text-[#00965f] h-4 w-4" />
                                    <span className="font-bold text-gray-900">Duration:</span>
                                    <span className="text-gray-500 ml-auto">{course.course?.duration} months</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FaUser className="text-[#00965f] h-4 w-4" />
                                    <span className="font-bold text-gray-900">Instructor:</span>
                                    <span className="text-gray-500 ml-auto">{course.course?.instructor_name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                                <div className="space-y-4">
                                  <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4 border border-gray-100">
                                    <h5 className="text-lg font-bold text-[#164758] flex items-center gap-2">
                                <FaChartPie className="h-5 w-5 text-[#00965f]" /> Progress
                              </h5>
                              <div className="space-y-3 text-base">
                                <div className="flex items-center gap-2">
                                  <FaTrophy className="text-[#00965f] h-4 w-4" />
                                  <span className="font-bold text-gray-900">Payment Progress:</span>
                                  <span className="font-bold text-white bg-[#00965f] px-4 py-1 rounded-full text-sm ml-auto shadow">{Math.round((course.paidFee / course.finalPrice) * 100)}% Complete</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                                  <div
                                    className="bg-[#00965f] h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${(course.paidFee / course.finalPrice) * 100}%` }}
                                  ></div>
                                </div>
                                </div>
                                </div>
                              </div>
                            </div>
                            )}
                            {activeInnerTab === "curriculum" && (
                              <div>
                                {course.course?.semesters && course.course.semesters.length > 0 ? (
                                  <div className="mt-4">
                            <h4 className="text-2xl font-extrabold text-[#164758] mb-8 flex items-center gap-3">
                              <FaBook className="h-7 w-7 text-[#00965f]" />
                              <span>Course Structure</span>
                            </h4>
                            <div className="relative space-y-10 pl-4">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e6f9f2] to-[#00965f]/20 rounded-full" style={{zIndex:0}}></div>
                              {course.course.semesters.map((semester, semIndex) => (
                                <div
                                  key={semIndex}
                                  className="relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all p-0"
                                  style={{zIndex:1}}
                                >
                                  <div className="absolute -left-5 top-8 w-8 h-8 flex items-center justify-center bg-white border-4 border-[#00965f] rounded-full shadow" style={{zIndex:2}}>
                                    <FaBook className="h-5 w-5 text-[#00965f]" />
                                  </div>
                                  <div
                                    className="flex items-center justify-between p-6 cursor-pointer rounded-t-2xl bg-gradient-to-r from-[#e6f9f2] to-white"
                                    onClick={() => setExpandedSection(expandedSection === `semester-${semIndex}` ? null : `semester-${semIndex}`)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl font-bold text-[#164758] flex items-center gap-2">
                                        <FaBook className="h-5 w-5 text-[#00965f]" />
                                        {semester.name}
                                      </span>
                                      {semester.number && (
                                        <span className="px-4 py-1 text-xs font-bold bg-[#e6f9f2] text-[#00965f] rounded-full ml-2">Semester {semester.number}</span>
                                      )}
                                    </div>
                                    <button className="text-gray-400 hover:text-[#00965f] transition-colors">
                                      <svg
                                        className={`w-6 h-6 transform transition-transform ${expandedSection === `semester-${semIndex}` ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                  </div>
                                  {expandedSection === `semester-${semIndex}` && (
                                    <div className="border-t border-gray-100 p-6 space-y-6 bg-[#f8fafc] rounded-b-2xl">
                                      {semester.subjects.map((subject, subIndex) => (
                                        <div key={subIndex} className="bg-white rounded-xl p-6 shadow flex flex-col gap-2 border border-gray-100">
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <FaBook className="h-4 w-4 text-[#00965f]" />
                                              <h5 className="font-bold text-gray-800 text-base">{subject.name}</h5>
                                              {subject.code && (
                                                <span className="text-xs text-gray-500 ml-2">Code: {subject.code}</span>
                                              )}
                                            </div>
                                            <button
                                              className="text-gray-400 hover:text-[#00965f] transition-colors"
                                              onClick={() => setExpandedSection(expandedSection === `subject-${semIndex}-${subIndex}` ? null : `subject-${semIndex}-${subIndex}`)}
                                            >
                                              <svg
                                                className={`w-5 h-5 transform transition-transform ${expandedSection === `subject-${semIndex}-${subIndex}` ? "rotate-180" : ""}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                              </svg>
                                            </button>
                                          </div>
                                          {expandedSection === `subject-${semIndex}-${subIndex}` && (
                                            <div className="mt-2 space-y-3">
                                              {subject.description && (
                                                <p className="text-sm text-gray-600 pl-6 border-l-4 border-[#e6f9f2]">{subject.description}</p>
                                              )}
                                              {subject.exams && subject.exams.length > 0 && (
                                                <div className="mt-3">
                                                  <h6 className="text-sm font-bold text-[#164758] mb-2 flex items-center gap-2">
                                                    <FaTrophy className="h-4 w-4 text-[#00965f]" />Exams
                                                  </h6>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {subject.exams.map((exam, examIndex) => (
                                                      <div key={examIndex} className="relative bg-gradient-to-br from-[#e6f9f2] to-[#f8fafc] rounded-xl p-6 border border-gray-100 shadow-lg flex flex-col gap-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                          <div className="flex items-center gap-2">
                                                            <FaCertificate className="h-5 w-5 text-[#00965f]" />
                                                            <span className="font-bold text-lg text-[#164758]">{exam.name}</span>
                                                          </div>
                                                          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm border ${exam.status === "Passed" ? "bg-green-100 text-green-800 border-green-200" : exam.status === "Failed" ? "bg-red-100 text-red-800 border-red-200" : exam.status === "Reappeared" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-gray-100 text-gray-800 border-gray-200"}`}>{exam.status}</span>
                                                        </div>
                                                        {exam.date && (
                                                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                            <FaCalendarAlt className="h-4 w-4 text-[#00965f]" />
                                                            <span>Date: {new Date(exam.date).toLocaleDateString()}</span>
                                                          </div>
                                                        )}
                                                        <div className="flex gap-6 text-sm mt-1">
                                                          <div className="flex items-center gap-1">
                                                            <FaListOl className="h-4 w-4 text-[#00965f]" />
                                                            <span className="text-gray-500">Total Marks:</span>
                                                            <span className="font-bold text-gray-700 ml-1">{exam.totalMarks}</span>
                                                          </div>
                                                          <div className="flex items-center gap-1">
                                                            <FaCheckCircle className="h-4 w-4 text-[#00965f]" />
                                                            <span className="text-gray-500">Passing Marks:</span>
                                                            <span className="font-bold text-gray-700 ml-1">{exam.passingMarks}</span>
                                                          </div>
                                                        </div>
                                                        {exam.description && (
                                                          <p className="mt-2 text-xs text-gray-600 pl-6 border-l-4 border-[#e6f9f2]">{exam.description}</p>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                                ) : (
                                  <p className="text-sm text-gray-400">No curriculum structure available.</p>
                        )}
                    </div>
                  )}
                            {activeInnerTab === "resources" && (
                              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                  <h4 className="font-bold text-lg text-[#164758] flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
                                    <FaBook className="h-6 w-6 text-[#00965f]" /> Course Videos
                                  </h4>
                                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {course.course?.videos?.length > 0 ? (
                                      course.course.videos.map((video) => (
                                        <div
                                          key={video._id}
                                          onClick={() => handleVideoClick(video)}
                                          className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden flex items-center gap-4 border border-gray-100 group"
                                        >
                                          <div className="relative w-40 h-24 flex-shrink-0">
                                            <Image
                                              src={getVideoThumbnail(video)}
                                              alt={video.title}
                                              fill
                                              className="object-cover rounded-l-xl group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                      </svg>
                  </div>
                      </div>
                                          <div className="p-4 flex-1">
                                            <h5 className="font-semibold text-gray-800 mb-1 line-clamp-1">{video.title}</h5>
                                            <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                    </div>
                      </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-400 p-4 text-center">No videos available.</p>
                                    )}
                        </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                  <h4 className="font-bold text-lg text-[#164758] flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
                                    <FaDownload className="h-6 w-6 text-[#00965f]" /> Course Documents
                                  </h4>
                                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {course.course?.docs?.length > 0 ? (
                                      course.course.docs.map((doc, dIndex) => (
                                        <a
                                          key={dIndex}
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-lg transition-all flex items-center justify-between border border-gray-100 cursor-pointer group"
                                        >
                                          <span className="text-sm font-medium text-gray-700 group-hover:text-[#00965f] transition-colors">{doc.title}</span>
                                          <button className="text-[#00965f] hover:text-[#008551] transition-colors">
                                            <FaDownload className="h-5 w-5" />
                                          </button>
                                        </a>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-400 p-4 text-center">No documents available.</p>
                                    )}
                      </div>
                    </div>
                  </div>
                            )}
                            {activeInnerTab === "payment" && (
                              <div className="max-w-2xl mx-auto">
                                <div className="bg-white p-7 rounded-2xl shadow flex flex-col gap-4 border border-gray-100">
                                  <h5 className="text-lg font-bold text-[#164758] mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="h-5 w-5 text-[#00965f]" /> Course Fee & Payment
                                  </h5>
                                  <div className="space-y-3 text-base">
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                      <FaMoneyBillWave className="text-gray-400 h-4 w-4" />
                                      <span className="font-semibold text-gray-700">Course Fee:</span>
                                      <span className="text-gray-600 ml-auto">₹{course.course?.fee?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                      <FaPercent className="text-gray-400 h-4 w-4" />
                                      <span className="font-semibold text-gray-700">Discount:</span>
                                      <span className="text-green-600 ml-auto">{course.course?.fee && course.finalPrice ? `-₹${(course.course.fee - course.finalPrice).toLocaleString()}` : "₹0"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg font-bold">
                                      <FaReceipt className="text-gray-400 h-4 w-4" />
                                      <span className="font-semibold text-gray-700">Final Price:</span>
                                      <span className="text-gray-800 ml-auto">₹{course.finalPrice?.toLocaleString()}</span>
                                    </div>
                                    <hr />
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                      <FaWallet className="text-green-600 h-4 w-4" />
                                      <span className="font-semibold text-green-800">Paid Amount:</span>
                                      <span className="text-green-800 font-bold ml-auto">₹{course.paidFee?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                                      <FaHourglassHalf className="text-red-600 h-4 w-4" />
                                      <span className="font-semibold text-red-800">Pending Amount:</span>
                                      <span className="text-red-800 font-bold ml-auto">₹{(course.finalPrice - course.paidFee)?.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                </div>
              </div>
            )}
                  </div>
                );
              })}
            </div>
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f7ef]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 shadow-lg flex flex-col z-40 sticky top-0 self-start" style={{height: 'auto', minHeight: '100vh'}}>
        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <span className="text-2xl font-extrabold text-[#00965f] tracking-tight">ILS Dashboard</span>
            </div>
        <nav className="flex-1 flex flex-col py-6 gap-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: FaChartLine },
            { id: "courses", label: "My Courses", icon: FaBook },
            { id: "exams", label: "Exams", icon: FaCalendarAlt },
            { id: "certificates", label: "Certificates", icon: FaCertificate },
          ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-3 px-8 py-3 text-lg font-semibold rounded-l-full transition-all ${
                      activeSection === tab.id
                  ? "bg-[#e6f9f2] text-[#00965f] shadow"
                  : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
              <tab.icon className="h-6 w-6" />
                    <span>{tab.label}</span>
                  </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-8 py-3 text-lg font-semibold text-red-500 hover:bg-red-50 rounded-l-full mt-auto transition-all"
          >
            <FaSignOutAlt className="h-6 w-6" />
            <span>Logout</span>
          </button>
            </nav>
          </div>
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12 mt-20">
        {/* Content Section */}
        <div className="transition-all duration-300">
            {activeSection === "dashboard" && (
              <div>
                {/* The rest of the dashboard content remains unchanged */}
                {renderSection && typeof renderSection === 'function' ? renderSection() : null}
              </div>
            )}
            {activeSection !== "dashboard" && renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InhouseStudentDashboard;
