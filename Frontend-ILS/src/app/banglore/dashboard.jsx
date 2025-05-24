"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/features/userSlice";
import {
  getAllCourses,
  getSingleCourse,
} from "../../redux/features/courseSlice";
import { useRouter } from "next/navigation";

import {
  FaUserCircle,
  FaBookOpen,
  FaClipboardList,
  FaCog,
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import Authorized from "../../auth/auth";

const Dashboard = () => {
  Authorized();
  const [activeTab, setActiveTab] = useState("courses");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { courses } = useSelector((state) => state.courses);
  const router = useRouter();
  // console.log(useSelector((state)=>state));

  useEffect(() => {
    dispatch(getUserDetails());
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses.length > 0) {
      console.log("Fetched courses:", courses);
    }
  }, [courses]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab is selected
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#164758] p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">E-Learning</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#164758] text-white p-5 ${
          isMobileMenuOpen ? "absolute z-10 top-16 h-screen" : ""
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center hidden md:block">
          E-Learning
        </h2>
        <nav className="flex flex-col space-y-4">
          {[
            { id: "courses", icon: FaBookOpen, label: "My Courses" },
            { id: "profile", icon: FaUser, label: "Profile" },
            { id: "progress", icon: FaClipboardList, label: "Progress" },
            { id: "settings", icon: FaCog, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              className={`flex items-center p-3 rounded-lg ${
                activeTab === item.id ? "bg-[#00965f]" : "hover:bg-[#127c55]"
              }`}
              onClick={() => handleTabClick(item.id)}
            >
              <item.icon className="mr-3" /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold text-[#164758]">
            User Dashboard
          </h1>
          <FaUserCircle className="text-3xl md:text-4xl text-gray-700" />
        </div>

        <div className="mt-6">
          {activeTab === "profile" && <Profile user={user} />}
          {activeTab === "courses" && (
            <MyCourses
              user={user}
              loading={loading}
              courses={courses}
              router={router}
            />
          )}
          {activeTab === "progress" && <Progress />}
          {activeTab === "settings" && <Settings />}
        </div>
      </main>
    </div>
  );
};

const Profile = ({ user }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow border-l-4 border-[#00965f]">
      <h2 className="text-lg md:text-xl font-semibold text-[#164758] mb-6">
        Profile Details
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaUser className="text-[#00965f] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-medium">{user?.fullname || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaEnvelope className="text-[#00965f] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{user?.email || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendar className="text-[#00965f] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Joined On</p>
              <p className="text-lg font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4 lg:mt-0">
          <h3 className="font-semibold text-lg mb-4">Account Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Enrolled Courses</span>
              <span className="font-medium">
                {user?.enrolledCourses?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed Courses</span>
              <span className="font-medium">
                {user?.completedCourses?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = ({ user }) => {
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFullname(user?.fullname || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://ils-project.onrender.com/auth/api/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
          },
          body: JSON.stringify({ fullname, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("User details updated successfully!");
      } else {
        setMessage(data.message || "Failed to update user details.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow border-l-4 border-[#00965f]">
      <h2 className="text-lg md:text-xl font-semibold text-[#164758] mb-4">
        Settings
      </h2>
      {message && <p className="text-sm mb-2 text-[#164758]">{message}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#00965f] text-white px-4 py-2 rounded-lg hover:bg-[#007f4f] transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const MyCourses = ({ user, loading, courses, router }) => {
  const dispatch = useDispatch();

  if (loading)
    return (
      <p className="text-center text-lg text-[#164758]">Loading courses...</p>
    );

  // Filter courses to show only enrolled ones and sort by enrollment date
  const enrolledCourses = courses
    .filter((course) =>
      user?.enrolledCourses?.some(
        (enrolled) => enrolled.courseId === course._id
      )
    )
    .sort((a, b) => {
      // Find enrollment dates for both courses
      const aEnrollment = user.enrolledCourses.find(
        (enrolled) => enrolled.courseId === a._id
      );
      const bEnrollment = user.enrolledCourses.find(
        (enrolled) => enrolled.courseId === b._id
      );

      // Sort by enrollment date (most recent first)
      return (
        new Date(bEnrollment?.enrolledAt) - new Date(aEnrollment?.enrolledAt)
      );
    });

  const handleCourseClick = async (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Dispatch getSingleCourse action and wait for it to complete
      await dispatch(getSingleCourse(courseId)).unwrap();
      // Then navigate to the course page
      router.push(`/banglore/courses/${courseId}`);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#164758] to-[#aadecb] p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-5 border-b-2 border-white pb-2">
        My Enrolled Courses
      </h2>
      {enrolledCourses.length > 0 ? (
        <ul className="space-y-4">
          {enrolledCourses.map((course, index) => {
            // Find enrollment date for this course
            const enrollment = user.enrolledCourses.find(
              (enrolled) => enrolled.courseId === course._id
            );

            return (
              <li
                key={course._id}
                className={`p-5 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer 
                  ${index === 0 ? "border-2 border-[#00965f]" : ""}`} // Highlight the latest course
                onClick={(e) => handleCourseClick(course._id, e)}
              >
                <div className="flex gap-4">
                  {/* Course Thumbnail */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Course Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg md:text-xl font-semibold text-[#164758]">
                        {course.title}
                      </h3>
                      {/* Add enrollment date */}
                      <span className="text-xs text-gray-500">
                        Enrolled:{" "}
                        {new Date(enrollment?.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        👨‍🏫 {course.instructor_id?.fullname || "Instructor"}
                      </span>
                      <span>📚 {course.videos?.length || 0} videos</span>
                      <span>⏳ {course.duration} hours</span>
                    </div>

                    {/* Continue Learning Button */}
                    <button
                      className="mt-3 px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#164758] transition-colors duration-300 text-sm flex items-center gap-2"
                      onClick={(e) => handleCourseClick(course._id, e)}
                    >
                      Continue Learning
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-white text-lg mb-4">
            You haven't enrolled in any courses yet.
          </p>
          <button
            onClick={() => router.push("/banglore")}
            className="bg-white text-[#164758] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold"
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

const Progress = () => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow border-l-4 border-[#00965f]">
    <h2 className="text-lg md:text-xl font-semibold text-[#164758] mb-4">
      Progress
    </h2>
    <p>Your course completion rate is 75%.</p>
  </div>
);

export default Dashboard;
