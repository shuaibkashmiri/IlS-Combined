"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getInhouseStudentDetails,
  inhouseStudentLogout,
} from "@/redux/features/inhouseSlice";
import {
  FaChartLine,
  FaBook,
  FaCalendarAlt,
  FaCertificate,
  FaSignOutAlt,
  FaUser,
  FaArrowRight,
  FaGraduationCap,
  FaDownload,
  FaSitemap,
  FaFolderOpen,
  FaCreditCard,
  FaLayerGroup,
  FaInfoCircle,
  FaChartPie,
  FaMoneyBillWave,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaTimes,
  FaBars,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef } from "react";

// --- LOGO ---
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-[#00965f] rounded-full w-10 h-10 flex items-center justify-center">
      <span className="text-white text-xl font-bold">ILS</span>
    </div>
    <span className="text-2xl font-bold text-[#00965f] tracking-tight">
      Student Dashboard
    </span>
  </div>
);

// --- SIDEBAR ---
const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  const navItems = [
    { id: "dashboard", label: "Student Dashboard", icon: FaChartLine },
    { id: "courses", label: "My Courses", icon: FaBook },
    { id: "exams", label: "Exams", icon: FaCalendarAlt },
    { id: "certificates", label: "Certificates", icon: FaCertificate },
  ];
  return (
    <aside className="w-64 bg-gradient-to-b from-[#f8fafc] to-[#e6f9f2] border-r border-[#e6f9f2] flex flex-col min-h-full shadow-md">
      <div className="flex items-center justify-between h-20 border-b border-[#e6f9f2] px-6 bg-white/80">
        <Logo />
      </div>
      <nav className="flex-1 flex flex-col py-6 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-4 px-6 py-4 text-left text-base font-semibold rounded-xl transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-[#00965f] ${
              activeSection === item.id
                ? "bg-[#00965f] text-white shadow-lg"
                : "text-[#164758] hover:bg-[#e6f9f2] hover:text-[#00965f]"
            }`}
            aria-current={activeSection === item.id ? "page" : undefined}
          >
            {activeSection === item.id && (
              <span className="absolute left-0 top-0 h-full w-1 bg-[#164758] rounded-r-full"></span>
            )}
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 text-left text-base font-semibold text-red-600 hover:bg-red-50 rounded-xl w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Logout"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

// --- STAT CARD ---
const StatCard = ({ icon: Icon, title, value, color, gradient }) => (
  <div
    className={`p-6 rounded-2xl shadow-md border border-[#e6f9f2] flex items-center gap-4 bg-white`}
  >
    <div
      className={`p-4 rounded-full bg-gradient-to-br from-[#e6f9f2] to-white shadow flex items-center justify-center`}
    >
      <Icon
        className={`h-7 w-7 ${
          color === "green"
            ? "text-[#00965f]"
            : color === "blue"
            ? "text-[#164758]"
            : color === "purple"
            ? "text-purple-500"
            : color === "yellow"
            ? "text-yellow-500"
            : "text-gray-400"
        }`}
      />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-3xl font-bold text-[#164758] mt-1">{value}</h3>
    </div>
  </div>
);

// --- DASHBOARD HOME SECTION ---
const DashboardHomeSection = ({ studentData, setActiveSection }) => {
  if (!studentData) return null;
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaBook}
          title="Enrolled Courses"
          value={studentData.myCourses?.length || 0}
          color="blue"
        />
        <StatCard
          icon={FaChartLine}
          title="Overall Progress"
          value={`${studentData.overallProgress || 0}%`}
          color="green"
        />
        <StatCard
          icon={FaCalendarAlt}
          title="Next Class"
          value={studentData.nextClass || "TBA"}
          color="purple"
        />
        <StatCard
          icon={FaUser}
          title="Status"
          value={studentData.status || "Active"}
          color="yellow"
        />
      </div>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#164758]">Course Progress</h2>
          <button
            onClick={() => setActiveSection("courses")}
            className="flex items-center text-[#00965f] hover:text-white hover:bg-[#00965f] transition-colors font-semibold px-4 py-2 rounded-lg"
          >
            View All Courses <FaArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-[#e6f9f2] space-y-6">
          {studentData.myCourses?.map((course, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#164758]">
                  {course.course?.title}
                </h3>
                <span className="text-sm font-medium text-[#00965f]">
                  {Math.round((course.paidFee / course.finalPrice) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-[#e6f9f2] rounded-full h-2.5">
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
    </div>
  );
};

const VideoPlayerModal = ({ video, onClose }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const videoId = video?.videoId;

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer(videoId);
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          initializePlayer(videoId);
        };
      }
    };

    if (videoId) {
      loadYouTubeAPI();
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId, player]);

  const initializePlayer = (id) => {
    if (playerRef.current) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        videoId: id,
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
    }
  };

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
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

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    if (player) {
      const seekTime =
        (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
      player.seekTo(seekTime);
      setCurrentTime(seekTime);
    }
  };

  const toggleFullscreen = () => {
    const playerContainer = document.getElementById("player-container");
    if (!playerContainer) return;

    if (!isFullscreen) {
      if (playerContainer.requestFullscreen)
        playerContainer.requestFullscreen();
      else if (playerContainer.webkitRequestFullscreen)
        playerContainer.webkitRequestFullscreen();
      else if (playerContainer.msRequestFullscreen)
        playerContainer.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        )
      );
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

  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        id="player-container"
        className="relative w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="aspect-w-16 aspect-h-9">
          <div ref={playerRef} />
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-white opacity-70 hover:opacity-100 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay}>
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>
            <div className="text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div
              className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-[#00965f] rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <button onClick={toggleFullscreen}>
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExamsSection = ({ studentData }) => {
  if (!studentData) return null;
  // Build a set of passed exams for quick lookup
  const passedExamSet = new Set(
    (studentData.examDetails || [])
      .filter((ed) => ed.status === "passed")
      .map((ed) => `${ed.course}||${ed.examName}`)
  );
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Exams</h2>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">
          Upcoming Exams
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentData.myCourses?.length > 0 ? (
            studentData.myCourses
              .map((course, index) => {
                const upcomingExams = (course.course?.exams || []).filter(
                  (exam) =>
                    !passedExamSet.has(`${course.course?._id}||${exam.name}`)
                );
                if (upcomingExams.length === 0) return null;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 border hover:shadow-lg transition-shadow"
                  >
                    <h4 className="font-bold text-gray-800 mb-2">
                      {course.course?.title}
                    </h4>
                    <div className="space-y-4">
                      {upcomingExams.map((exam, examIdx) => (
                        <div
                          key={examIdx}
                          className="bg-white p-4 rounded-lg border"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-[#00965f]">
                              {exam.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                exam.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {exam.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {exam.date
                                ? new Date(exam.date).toLocaleDateString()
                                : "TBA"}
                            </div>
                            <div>
                              <span className="font-medium">Total Marks:</span>{" "}
                              {exam.totalMarks}
                            </div>
                            <div>
                              <span className="font-medium">
                                Passing Marks:
                              </span>{" "}
                              {exam.passingMarks}
                            </div>
                            <div>
                              <span className="font-medium">Description:</span>{" "}
                              {exam.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
              .filter(Boolean)
          ) : (
            <p className="text-gray-500 col-span-full">
              No exam information available.
            </p>
          )}
        </div>
      </div>
      {/* Student's Exam Details Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">
          My Exam Results
        </h3>
        {studentData.examDetails && studentData.examDetails.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Marks
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passing Marks
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {studentData.examDetails.map((exam, idx) => {
                  // Find course title by course ID
                  const courseObj = (studentData.myCourses || []).find(
                    (c) => c.course?._id === exam.course
                  );
                  const courseTitle = courseObj?.course?.title || exam.course;
                  return (
                    <tr key={exam._id || idx}>
                      <td className="px-4 py-2 whitespace-nowrap font-semibold text-gray-700">
                        {exam.examName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                        {courseTitle}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                        {exam.examDate
                          ? new Date(exam.examDate).toLocaleDateString()
                          : "TBA"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                        {exam.totalMarks}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                        {exam.passingMarks}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            exam.status === "passed"
                              ? "bg-green-100 text-green-800"
                              : exam.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                        {exam.marksObtained !== undefined
                          ? exam.marksObtained
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No exam results available yet.</p>
        )}
      </div>
    </div>
  );
};

const CertificatesSection = ({ studentData }) => {
  if (!studentData) return null;
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">My Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentData.myCourses?.length > 0 ? (
          studentData.myCourses.map((course, index) => {
            const isComplete =
              Math.round((course.paidFee / course.finalPrice) * 100) >= 100;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {course.course?.title}
                  </h3>
                  <FaGraduationCap className="h-8 w-8 text-[#00965f]" />
                </div>
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  {isComplete
                    ? "Congratulations! Your certificate is available for download."
                    : "Complete the course and payment to unlock your certificate."}
                </p>
                <button
                  disabled={!isComplete}
                  className="w-full bg-[#00965f] text-white py-3 rounded-lg hover:bg-[#007a4e] transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FaDownload className="h-4 w-4" />
                  <span>Download Certificate</span>
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-md border">
            <p className="text-gray-500">
              No certificate information available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
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

const CourseDetailTabs = ({
  course,
  activeInnerTab,
  setActiveInnerTab,
  handleVideoClick,
}) => {
  const courseDetailTabs = [
    { id: "overview", label: "Overview", icon: FaLayerGroup },
    { id: "curriculum", label: "Curriculum", icon: FaSitemap },
    { id: "resources", label: "Resources", icon: FaFolderOpen },
    { id: "payment", label: "Payment", icon: FaCreditCard },
  ];
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="border-t border-gray-200 bg-gray-50/50">
      <div className="p-4 sm:p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex flex-wrap gap-2">
            {courseDetailTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveInnerTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-4 font-semibold text-sm rounded-full transition-colors ${
                  activeInnerTab === tab.id
                    ? "bg-[#00965f] text-white shadow"
                    : "text-gray-600 hover:text-[#00965f] hover:bg-green-50"
                }`}
              >
                <tab.icon className="h-4 w-4" /> <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-1 sm:p-2">
          {activeInnerTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <h5 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <FaInfoCircle className="h-5 w-5 text-[#00965f]" /> Course
                  Details
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Category:
                    </span>
                    <span className="text-gray-500">
                      {course.course?.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Level:</span>
                    <span className="text-gray-500">
                      {course.course?.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Duration:
                    </span>
                    <span className="text-gray-500">
                      {course.course?.duration} months
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Instructor:
                    </span>
                    <span className="text-gray-500">
                      {course.course?.instructor_name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <h5 className="text-md font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <FaChartPie className="h-5 w-5 text-[#00965f]" /> Progress
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      Payment Progress:
                    </span>
                    <span className="font-bold text-white bg-[#00965f] px-3 py-1 rounded-full text-xs shadow-sm">
                      {Math.round((course.paidFee / course.finalPrice) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-[#00965f] h-2.5 rounded-full"
                      style={{
                        width: `${(course.paidFee / course.finalPrice) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeInnerTab === "curriculum" && (
            <div>
              {course.course?.semesters &&
              course.course.semesters.length > 0 ? (
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FaBook className="h-6 w-6 text-[#00965f]" />
                    <span>Course Structure</span>
                  </h4>
                  <div className="relative space-y-8 pl-4 border-l-2 border-gray-200">
                    {course.course.semesters.map((semester, semIndex) => (
                      <div key={semIndex} className="relative">
                        <div className="absolute -left-6 top-1 w-8 h-8 flex items-center justify-center bg-white border-2 border-[#00965f] rounded-full shadow-sm">
                          <FaBook className="h-4 w-4 text-[#00965f]" />
                        </div>
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer rounded-lg bg-white border shadow-sm"
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === `semester-${semIndex}`
                                ? null
                                : `semester-${semIndex}`
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-800">
                              {semester.name}
                            </span>
                            {semester.number && (
                              <span className="px-3 py-0.5 text-xs font-bold bg-green-100 text-[#00965f] rounded-full">
                                Semester {semester.number}
                              </span>
                            )}
                          </div>
                          <button className="text-gray-400 hover:text-[#00965f]">
                            <svg
                              className={`w-5 h-5 transform transition-transform ${
                                expandedSection === `semester-${semIndex}`
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
                        {expandedSection === `semester-${semIndex}` && (
                          <div className="mt-4 ml-4 pl-6 border-l-2 border-gray-200 space-y-4">
                            {semester.subjects.map((subject, subIndex) => (
                              <div
                                key={subIndex}
                                className="bg-white rounded-lg p-4 shadow-sm border"
                              >
                                <h5 className="font-bold text-gray-800">
                                  {subject.name}
                                </h5>
                                {subject.code && (
                                  <span className="text-xs text-gray-500">
                                    Code: {subject.code}
                                  </span>
                                )}
                                {subject.description && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    {subject.description}
                                  </p>
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
                <p className="text-sm text-gray-500">
                  No curriculum structure available.
                </p>
              )}
            </div>
          )}
          {activeInnerTab === "resources" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-5 border">
                <h4 className="font-bold text-md text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">
                  <FaBook className="h-5 w-5 text-[#00965f]" /> Course Videos
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {course.course?.videos?.length > 0 ? (
                    course.course.videos.map((video) => (
                      <div
                        key={video._id}
                        onClick={() => handleVideoClick(video)}
                        className="bg-gray-50 rounded-lg hover:bg-green-50 transition-all cursor-pointer overflow-hidden flex items-center gap-4 border group"
                      >
                        <div className="relative w-32 h-20 flex-shrink-0">
                          <Image
                            src={getVideoThumbnail(video)}
                            alt={video.title}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="py-2 pr-2 flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                            {video.title}
                          </h5>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-4 text-center">
                      No videos available.
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border">
                <h4 className="font-bold text-md text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">
                  <FaDownload className="h-5 w-5 text-[#00965f]" /> Course
                  Documents
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {course.course?.docs?.length > 0 ? (
                    course.course.docs.map((doc, dIndex) => (
                      <a
                        key={dIndex}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-50 p-3 rounded-lg hover:bg-green-50 transition-all flex items-center justify-between border group"
                      >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#00965f]">
                          {doc.title}
                        </span>
                        <FaDownload className="h-4 w-4 text-gray-400 group-hover:text-[#00965f]" />
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 p-4 text-center">
                      No documents available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeInnerTab === "payment" && (
            <div className="max-w-md mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h5 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMoneyBillWave className="h-5 w-5 text-[#00965f]" /> Payment
                  Details
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="font-semibold text-gray-600">
                      Course Fee:
                    </span>
                    <span className="text-gray-800">
                      ₹{course.course?.fee?.toLocaleString() ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="font-semibold text-gray-600">
                      Discount:
                    </span>
                    <span className="text-green-600">
                      {course.discount || "₹0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md font-bold">
                    <span className="font-semibold text-gray-700">
                      Final Price:
                    </span>
                    <span className="text-gray-900">
                      ₹{course.finalPrice?.toLocaleString() ?? "N/A"}
                    </span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                    <span className="font-semibold text-green-800">
                      Paid Amount:
                    </span>
                    <span className="font-bold text-green-800">
                      ₹{course.paidFee?.toLocaleString() ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <span className="font-semibold text-red-800">
                      Pending Amount:
                    </span>
                    <span className="font-bold text-red-800">
                      {course.course?.fee != null && course.paidFee != null
                        ? `₹${(
                            course.course.fee -
                            (course.paidFee + course.discount)
                          ).toLocaleString()}`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseItem = ({
  course,
  index,
  expandedCourse,
  setExpandedCourse,
  handleVideoClick,
}) => {
  const [activeInnerTab, setActiveInnerTab] = useState("overview");
  const isExpanded = expandedCourse === index;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
      <div
        className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 cursor-pointer"
        onClick={() => {
          setExpandedCourse(isExpanded ? null : index);
          if (!isExpanded) setActiveInnerTab("overview");
        }}
      >
        <div className="relative h-32 w-48 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
          <Image
            src={course.course?.thumbnail || "/default-video-thumbnail.jpg"}
            alt={course.course?.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
          <h3 className="font-bold text-xl text-gray-800">
            {course.course?.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2">
            {course.course?.description}
          </p>
          <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
            <div className="w-40 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#00965f] h-2.5 rounded-full"
                style={{
                  width: `${(course.paidFee / course.finalPrice) * 100}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {Math.round((course.paidFee / course.finalPrice) * 100)}% Complete
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <button className="text-[#00965f] hover:text-white hover:bg-[#00965f] border-2 border-[#00965f] rounded-full p-2 transition-all">
            <svg
              className={`w-6 h-6 transform transition-transform ${
                isExpanded ? "rotate-180" : ""
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
      {isExpanded && (
        <CourseDetailTabs
          course={course}
          activeInnerTab={activeInnerTab}
          setActiveInnerTab={setActiveInnerTab}
          handleVideoClick={handleVideoClick}
        />
      )}
    </div>
  );
};

const MyCoursesSection = ({ studentData, handleVideoClick }) => {
  const [expandedCourse, setExpandedCourse] = useState(null);

  if (!studentData) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
      <div className="grid grid-cols-1 gap-6">
        {studentData.myCourses?.map((course, index) => (
          <CourseItem
            key={index}
            course={course}
            index={index}
            expandedCourse={expandedCourse}
            setExpandedCourse={setExpandedCourse}
            handleVideoClick={handleVideoClick}
          />
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const InhouseStudentDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { studentDetails, loading, error } = useSelector(
    (state) => state.inhouse
  );
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const handleLogout = () => {
    dispatch(inhouseStudentLogout());
    toast.success("Logged out successfully");
    router.push("/inhouse/student/login");
  };

  const handleVideoClick = (video) => {
    const videoId = video.videoUrl.includes("youtube.com")
      ? video.videoUrl.split("v=")[1]?.split("&")[0]
      : video.videoUrl.split("youtu.be/")[1];
    setSelectedVideo({ ...video, videoId });
  };

  const studentData =
    studentDetails ||
    (mounted && JSON.parse(localStorage.getItem("inHouseStudent")));

  if (!mounted) return null;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00965f]"></div>
      </div>
    );
  }
  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">
          No student data available. Please login again.
        </p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardHomeSection
            studentData={studentData}
            setActiveSection={setActiveSection}
          />
        );
      case "courses":
        return (
          <MyCoursesSection
            studentData={studentData}
            handleVideoClick={handleVideoClick}
          />
        );
      case "exams":
        return <ExamsSection studentData={studentData} />;
      case "certificates":
        return <CertificatesSection studentData={studentData} />;
      default:
        return (
          <div className="p-8">
            Active Section: <span className="font-bold">{activeSection}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e6f9f2] min-h-screen">
      {/* Main dashboard area: sidebar + content */}
      <div className="flex min-h-screen pt-16">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleLogout={handleLogout}
        />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
            {renderSection()}
          </div>
        </main>
      </div>
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default InhouseStudentDashboard;
