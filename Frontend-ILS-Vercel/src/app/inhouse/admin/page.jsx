"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOfflineCourses,
  fetchOfflineStudents,
  addOfflineCourse,
  addOfflineStudent,
  createVideo,
  getVideos,
  giveDiscount,
  payFee,
  addExam,
} from "../../../redux/features/inhouseSlice";
import {
  FaBook,
  FaUsers,
  FaSignOutAlt,
  FaChartLine,
  FaCalendarAlt,
  FaGraduationCap,
  FaFilter,
  FaPlus,
  FaTimes,
  FaBars,
  FaVideo,
  FaFileAlt,
  FaUpload,
  FaSpinner,
  FaPlay,
  FaTrash,
  FaEdit,
  FaEye,
  FaTag,
  FaMoneyBill,
} from "react-icons/fa";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { logoutUser } from "../../../redux/features/userSlice";

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00965f]"></div>
  </div>
);

// Courses Component
const CoursesSection = ({
  offlineCourses,
  offlineStudents,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  formData,
  setFormData,
  handleInputChange,
  handleFileChange,
  activeSection,
  setActiveSection,
  courseType,
  setCourseType,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };

  const getEnrolledStudents = (courseId) => {
    return (
      offlineStudents?.filter((student) =>
        student.myCourses?.some((course) => course.course?._id === courseId)
      ) || []
    );
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setImageError("");
    }
  };

  const removeThumbnail = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, thumbnail: null }));
    setImageError("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#164758]">Courses</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2"
        >
          <FaPlus className="h-5 w-5" />
          Add New Course
        </button>
      </div>

      {/* Courses List Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <FaBook className="h-6 w-6 text-[#00965f]" />
          <h3 className="text-xl font-semibold text-gray-800">
            Available Courses
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {Array.isArray(offlineCourses) && offlineCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 font-medium text-gray-600">Title</th>
                    <th className="pb-3 font-medium text-gray-600">Category</th>
                    <th className="pb-3 font-medium text-gray-600">Duration</th>
                    <th className="pb-3 font-medium text-gray-600">Fee</th>
                    <th className="pb-3 font-medium text-gray-600">Level</th>
                    <th className="pb-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offlineCourses.map((course) => (
                    <tr
                      key={course?._id || Math.random()}
                      className="border-b border-gray-100"
                    >
                      <td className="py-4">{course?.title || "-"}</td>
                      <td className="py-4">{course?.category || "-"}</td>
                      <td className="py-4">{course?.duration || "-"} months</td>
                      <td className="py-4">
                        ₹{course?.fee?.toLocaleString() || "-"}
                      </td>
                      <td className="py-4">{course?.level || "-"}</td>
                      <td className="py-4">
                        <button
                          onClick={() => handleViewDetails(course)}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaBook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No courses available yet</p>
              <p className="text-sm text-gray-400">
                Start by adding your first course
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Course Details Modal */}
      {isDetailsModalOpen && selectedCourse && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Course Details
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Course Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Course Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium">{selectedCourse.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{selectedCourse.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">
                      {selectedCourse.duration} months
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-medium">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fee</p>
                    <p className="font-medium">
                      ₹{selectedCourse.fee?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="font-medium">
                      {selectedCourse.instructor_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{selectedCourse.description}</p>
                </div>
              </div>

              {/* Course Statistics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Course Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold text-[#00965f]">
                      {selectedCourse.enrolledStudents?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#00965f]">
                      ₹
                      {getEnrolledStudents(selectedCourse._id)
                        .reduce((total, student) => {
                          const courseData = student.myCourses?.find(
                            (c) => c.course?._id === selectedCourse._id
                          );
                          return total + (courseData?.paidFee || 0);
                        }, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Average Progress</p>
                    <p className="text-2xl font-bold text-[#00965f]">
                      {Math.round(
                        getEnrolledStudents(selectedCourse._id).reduce(
                          (total, student) => {
                            const courseData = student.myCourses?.find(
                              (c) => c.course?._id === selectedCourse._id
                            );
                            return (
                              total +
                              ((courseData?.paidFee / courseData?.finalPrice) *
                                100 || 0)
                            );
                          },
                          0
                        ) /
                          (getEnrolledStudents(selectedCourse._id).length || 1)
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* Enrolled Students */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Enrolled Students
                </h3>
                {getEnrolledStudents(selectedCourse._id).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="pb-3 font-medium text-gray-600">
                            Name
                          </th>
                          <th className="pb-3 font-medium text-gray-600">
                            Email
                          </th>
                          <th className="pb-3 font-medium text-gray-600">
                            Paid Fee
                          </th>
                          <th className="pb-3 font-medium text-gray-600">
                            Progress
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getEnrolledStudents(selectedCourse._id).map(
                          (student) => {
                            const courseData = student.myCourses?.find(
                              (c) => c.course?._id === selectedCourse._id
                            );
                            return (
                              <tr
                                key={student._id}
                                className="border-b border-gray-100"
                              >
                                <td className="py-4">{student.name}</td>
                                <td className="py-4">{student.email}</td>
                                <td className="py-4">
                                  ₹{courseData?.paidFee?.toLocaleString()}
                                </td>
                                <td className="py-4">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                      className="bg-[#00965f] h-2.5 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${
                                          (courseData?.paidFee /
                                            courseData?.finalPrice) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaUsers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No students enrolled yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Course
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Navigation Buttons for sections within the modal */}
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveSection("basic")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSection === "basic"
                        ? "bg-[#00965f] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Basic Info
                  </button>
                  {courseType === "Long Term" && (
                    <button
                      type="button"
                      onClick={() => setActiveSection("semesters")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeSection === "semesters"
                          ? "bg-[#00965f] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Semesters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveSection("thumbnail")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSection === "thumbnail"
                        ? "bg-[#00965f] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Thumbnail
                  </button>
                </div>

                {/* Course Type Toggle */}
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-700">
                    Course Type
                  </label>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setCourseType("Short Term")}
                      className={`flex-1 px-4 py-2.5 text-center font-medium transition-colors ${
                        courseType === "Short Term"
                          ? "bg-[#00965f] text-white"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Short Term
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseType("Long Term")}
                      className={`flex-1 px-4 py-2.5 text-center font-medium transition-colors ${
                        courseType === "Long Term"
                          ? "bg-[#00965f] text-white"
                          : "text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      Long Term
                    </button>
                  </div>
                </div>

                {/* Basic Info Section */}
                {activeSection === "basic" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Course Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Duration (months)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Fee
                        </label>
                        <input
                          type="number"
                          name="fee"
                          value={formData.fee}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Level
                        </label>
                        <select
                          name="level"
                          value={formData.level}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Instructor Name
                      </label>
                      <input
                        type="text"
                        name="instructor_name"
                        value={formData.instructor_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Semesters Section */}
                {activeSection === "semesters" && courseType === "Long Term" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Semesters
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            semesters: [
                              ...prev.semesters,
                              {
                                name: "",
                                number: "",
                                subjects: [
                                  {
                                    name: "",
                                    code: "",
                                    description: "",
                                    exams: [
                                      {
                                        name: "",
                                        date: "",
                                        totalMarks: "",
                                        passingMarks: "",
                                        description: "",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          }));
                        }}
                        className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2"
                      >
                        <FaPlus className="h-4 w-4" />
                        Add Semester
                      </button>
                    </div>

                    {formData.semesters.map((semester, semesterIndex) => (
                      <div
                        key={semesterIndex}
                        className="bg-gray-50 p-6 rounded-lg space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-semibold text-gray-700">
                            Semester {semesterIndex + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                semesters: prev.semesters.filter(
                                  (_, index) => index !== semesterIndex
                                ),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Semester Name
                            </label>
                            <input
                              type="text"
                              value={semester.name}
                              onChange={(e) => {
                                const newSemesters = [...formData.semesters];
                                newSemesters[semesterIndex].name =
                                  e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  semesters: newSemesters,
                                }));
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                              placeholder="e.g., First Semester"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Semester Number
                            </label>
                            <input
                              type="number"
                              value={semester.number}
                              onChange={(e) => {
                                const newSemesters = [...formData.semesters];
                                newSemesters[semesterIndex].number =
                                  e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  semesters: newSemesters,
                                }));
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                              placeholder="e.g., 1"
                            />
                          </div>
                        </div>

                        {/* Subjects Section */}
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="text-md font-semibold text-gray-700">
                              Subjects
                            </h5>
                            <button
                              type="button"
                              onClick={() => {
                                const newSemesters = [...formData.semesters];
                                newSemesters[semesterIndex].subjects.push({
                                  name: "",
                                  code: "",
                                  description: "",
                                  exams: [
                                    {
                                      name: "",
                                      date: "",
                                      totalMarks: "",
                                      passingMarks: "",
                                      description: "",
                                    },
                                  ],
                                });
                                setFormData((prev) => ({
                                  ...prev,
                                  semesters: newSemesters,
                                }));
                              }}
                              className="px-3 py-1.5 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2 text-sm"
                            >
                              <FaPlus className="h-3 w-3" />
                              Add Subject
                            </button>
                          </div>

                          {semester.subjects.map((subject, subjectIndex) => (
                            <div
                              key={subjectIndex}
                              className="bg-white p-4 rounded-lg space-y-4 mb-4"
                            >
                              <div className="flex justify-between items-center">
                                <h6 className="text-sm font-semibold text-gray-700">
                                  Subject {subjectIndex + 1}
                                </h6>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSemesters = [
                                      ...formData.semesters,
                                    ];
                                    newSemesters[
                                      semesterIndex
                                    ].subjects = newSemesters[
                                      semesterIndex
                                    ].subjects.filter(
                                      (_, index) => index !== subjectIndex
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      semesters: newSemesters,
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block mb-2 font-medium text-gray-700">
                                    Subject Name
                                  </label>
                                  <input
                                    type="text"
                                    value={subject.name}
                                    onChange={(e) => {
                                      const newSemesters = [
                                        ...formData.semesters,
                                      ];
                                      newSemesters[semesterIndex].subjects[
                                        subjectIndex
                                      ].name = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        semesters: newSemesters,
                                      }));
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                    placeholder="e.g., Mathematics"
                                  />
                                </div>
                                <div>
                                  <label className="block mb-2 font-medium text-gray-700">
                                    Subject Code
                                  </label>
                                  <input
                                    type="text"
                                    value={subject.code}
                                    onChange={(e) => {
                                      const newSemesters = [
                                        ...formData.semesters,
                                      ];
                                      newSemesters[semesterIndex].subjects[
                                        subjectIndex
                                      ].code = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        semesters: newSemesters,
                                      }));
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                    placeholder="e.g., MATH101"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                  Subject Description
                                </label>
                                <textarea
                                  value={subject.description}
                                  onChange={(e) => {
                                    const newSemesters = [
                                      ...formData.semesters,
                                    ];
                                    newSemesters[semesterIndex].subjects[
                                      subjectIndex
                                    ].description = e.target.value;
                                    setFormData((prev) => ({
                                      ...prev,
                                      semesters: newSemesters,
                                    }));
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                  rows="3"
                                  placeholder="Enter subject description"
                                />
                              </div>

                              {/* Exams Section */}
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h6 className="text-sm font-semibold text-gray-700">
                                    Exams
                                  </h6>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSemesters = [
                                        ...formData.semesters,
                                      ];
                                      newSemesters[semesterIndex].subjects[
                                        subjectIndex
                                      ].exams.push({
                                        name: "",
                                        date: "",
                                        totalMarks: "",
                                        passingMarks: "",
                                        description: "",
                                      });
                                      setFormData((prev) => ({
                                        ...prev,
                                        semesters: newSemesters,
                                      }));
                                    }}
                                    className="px-3 py-1.5 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2 text-sm"
                                  >
                                    <FaPlus className="h-3 w-3" />
                                    Add Exam
                                  </button>
                                </div>

                                {subject.exams.map((exam, examIndex) => (
                                  <div
                                    key={examIndex}
                                    className="bg-gray-50 p-4 rounded-lg space-y-4 mb-4"
                                  >
                                    <div className="flex justify-between items-center">
                                      <h6 className="text-sm font-semibold text-gray-700">
                                        Exam {examIndex + 1}
                                      </h6>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newSemesters = [
                                            ...formData.semesters,
                                          ];
                                          newSemesters[semesterIndex].subjects[
                                            subjectIndex
                                          ].exams = newSemesters[
                                            semesterIndex
                                          ].subjects[subjectIndex].exams.filter(
                                            (_, index) => index !== examIndex
                                          );
                                          setFormData((prev) => ({
                                            ...prev,
                                            semesters: newSemesters,
                                          }));
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <FaTrash className="h-3 w-3" />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block mb-2 font-medium text-gray-700">
                                          Exam Name
                                        </label>
                                        <input
                                          type="text"
                                          value={exam.name}
                                          onChange={(e) => {
                                            const newSemesters = [
                                              ...formData.semesters,
                                            ];
                                            newSemesters[
                                              semesterIndex
                                            ].subjects[subjectIndex].exams[
                                              examIndex
                                            ].name = e.target.value;
                                            setFormData((prev) => ({
                                              ...prev,
                                              semesters: newSemesters,
                                            }));
                                          }}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                          placeholder="e.g., Mid Term"
                                        />
                                      </div>
                                      <div>
                                        <label className="block mb-2 font-medium text-gray-700">
                                          Exam Date
                                        </label>
                                        <input
                                          type="date"
                                          value={exam.date}
                                          onChange={(e) => {
                                            const newSemesters = [
                                              ...formData.semesters,
                                            ];
                                            newSemesters[
                                              semesterIndex
                                            ].subjects[subjectIndex].exams[
                                              examIndex
                                            ].date = e.target.value;
                                            setFormData((prev) => ({
                                              ...prev,
                                              semesters: newSemesters,
                                            }));
                                          }}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                        />
                                      </div>
                                      <div>
                                        <label className="block mb-2 font-medium text-gray-700">
                                          Total Marks
                                        </label>
                                        <input
                                          type="number"
                                          value={exam.totalMarks}
                                          onChange={(e) => {
                                            const newSemesters = [
                                              ...formData.semesters,
                                            ];
                                            newSemesters[
                                              semesterIndex
                                            ].subjects[subjectIndex].exams[
                                              examIndex
                                            ].totalMarks = e.target.value;
                                            setFormData((prev) => ({
                                              ...prev,
                                              semesters: newSemesters,
                                            }));
                                          }}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                          placeholder="e.g., 100"
                                        />
                                      </div>
                                      <div>
                                        <label className="block mb-2 font-medium text-gray-700">
                                          Passing Marks
                                        </label>
                                        <input
                                          type="number"
                                          value={exam.passingMarks}
                                          onChange={(e) => {
                                            const newSemesters = [
                                              ...formData.semesters,
                                            ];
                                            newSemesters[
                                              semesterIndex
                                            ].subjects[subjectIndex].exams[
                                              examIndex
                                            ].passingMarks = e.target.value;
                                            setFormData((prev) => ({
                                              ...prev,
                                              semesters: newSemesters,
                                            }));
                                          }}
                                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                          placeholder="e.g., 40"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block mb-2 font-medium text-gray-700">
                                        Exam Description
                                      </label>
                                      <textarea
                                        value={exam.description}
                                        onChange={(e) => {
                                          const newSemesters = [
                                            ...formData.semesters,
                                          ];
                                          newSemesters[semesterIndex].subjects[
                                            subjectIndex
                                          ].exams[examIndex].description =
                                            e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            semesters: newSemesters,
                                          }));
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                        rows="2"
                                        placeholder="Enter exam description"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Thumbnail Section */}
                {activeSection === "thumbnail" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Course Thumbnail
                      </label>
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative inline-block">
                              <img
                                src={imagePreview}
                                alt="Course thumbnail preview"
                                className="w-48 h-48 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setFormData((prev) => ({
                                    ...prev,
                                    thumbnail: null,
                                  }));
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="thumbnail-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#00965f] hover:text-[#007f4f] focus-within:outline-none"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="thumbnail-upload"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleThumbnailChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </>
                          )}
                          {imageError && (
                            <p className="text-sm text-red-500 mt-2">
                              {imageError}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors"
                  >
                    Add Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Students Component
const StudentsSection = ({
  offlineStudents,
  offlineCourses,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  formData,
  setFormData,
  handleInputChange,
  dispatch,
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  // Discount modal state
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [discountStudent, setDiscountStudent] = useState(null);
  const [discountCourse, setDiscountCourse] = useState(null);
  // Pay Fee modal state
  const [isPayFeeModalOpen, setIsPayFeeModalOpen] = useState(false);
  const [payFeeAmount, setPayFeeAmount] = useState("");
  const [payFeeLoading, setPayFeeLoading] = useState(false);
  const [payFeeError, setPayFeeError] = useState("");
  const [payFeeStudent, setPayFeeStudent] = useState(null);
  const [payFeeCourse, setPayFeeCourse] = useState(null);
  // Add this state at the top of StudentsSection
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    handleInputChange(e);

    // Find selected course details
    const course = offlineCourses.find((c) => c._id === courseId);
    if (course) {
      setSelectedCourseDetails(course);
      // Calculate registration fee (10% of course fee)
      const regFee = Math.round(course.fee * 0.1);
      // Update form data with course fee and registration fee
      setFormData((prev) => ({
        ...prev,
        myCourses: {
          ...prev.myCourses,
          finalPrice: course.fee,
          regFee: regFee,
          course: courseId,
        },
      }));
    } else {
      setSelectedCourseDetails(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");

    if (file) {
      // Check file size (convert to KB)
      const fileSizeKB = file.size / 1024;

      if (fileSizeKB > 150) {
        setImageError("Image size should be less than 150KB");
        e.target.value = null;
        setImagePreview(null);
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload an image file");
        e.target.value = null;
        setImagePreview(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Update form data
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }));
    setImageError("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#164758]">
            Students Enrolled
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2"
        >
          <FaPlus className="h-5 w-5" />
          Add New Student
        </button>
      </div>

      {/* Students List Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="h-6 w-6 text-[#00965f]" />
          <h3 className="text-xl font-semibold text-gray-800">
            Enrolled Students
          </h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {Array.isArray(offlineStudents) && offlineStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 font-medium text-gray-600">Name</th>
                    <th className="pb-3 font-medium text-gray-600">Email</th>
                    <th className="pb-3 font-medium text-gray-600">Phone</th>
                    <th className="pb-3 font-medium text-gray-600">Course</th>
                    <th className="pb-3 font-medium text-gray-600">Status</th>
                    <th className="pb-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offlineStudents.map((student) => (
                    <tr
                      key={student?._id || Math.random()}
                      className="border-b border-gray-100"
                    >
                      <td className="py-4">{student?.name || "-"}</td>
                      <td className="py-4">{student?.email || "-"}</td>
                      <td className="py-4">{student?.phone || "-"}</td>
                      <td className="py-4">
                        {student?.myCourses?.[0]?.course?.title || "-"}
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1.5 text-sm rounded-full bg-green-50 text-green-600 font-medium">
                          {student?.status || "Active"}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="p-2 text-gray-500 hover:text-[#00965f] transition-colors"
                          title="View Details"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDiscountStudent(student);
                            setDiscountCourse(student?.myCourses?.[0]?.course);
                            setDiscountAmount(
                              student?.myCourses?.[0]?.discount || ""
                            );
                            setDiscountError("");
                            setIsDiscountModalOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-yellow-600 transition-colors ml-2"
                          title="Give Discount"
                        >
                          <FaTag className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setPayFeeStudent(student);
                            setPayFeeCourse(student?.myCourses?.[0]?.course);
                            setPayFeeAmount("");
                            setPayFeeError("");
                            setIsPayFeeModalOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-green-600 transition-colors ml-2"
                          title="Pay Fee"
                        >
                          <FaMoneyBill className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUsers className="h-12 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                No students enrolled yet
              </p>
              <p className="text-gray-400">
                Start by adding your first student
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Student Details Modal */}
      {isDetailsModalOpen && selectedStudent && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Student Details
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h3>
                <div className="flex items-start gap-6">
                  {/* Profile Image */}
                  {selectedStudent.profileImage ? (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={selectedStudent.profileImage}
                        alt={selectedStudent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <FaUsers className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Parent/Guardian Name
                      </p>
                      <p className="font-medium">
                        {selectedStudent.parentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Alternative Phone</p>
                      <p className="font-medium">
                        {selectedStudent.alternativePhone || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium capitalize">
                        {selectedStudent.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {new Date(selectedStudent.dob).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium capitalize">
                        {selectedStudent.status}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{selectedStudent.address}</p>
                </div>
              </div>

              {/* Academic Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Academic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-medium">
                      {selectedStudent.academicDetails?.qualification}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Institution</p>
                    <p className="font-medium">
                      {selectedStudent.academicDetails?.institution}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">
                      {selectedStudent.academicDetails?.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Percentage</p>
                    <p className="font-medium">
                      {selectedStudent.academicDetails?.percentage}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Course Details
                </h3>
                {selectedStudent.myCourses?.map((course, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Course Title</p>
                        <p className="font-medium">{course.course?.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium">{course.course?.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">
                          {course.course?.duration} months
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Level</p>
                        <p className="font-medium">{course.course?.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Final Price</p>
                        <p className="font-medium">
                          ₹{course.finalPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Paid Fee</p>
                        <p className="font-medium">
                          ₹{course.paidFee?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pending Fee</p>
                        <p className="font-medium text-red-600">
                          ₹
                          {(
                            (course.finalPrice || 0) -
                            ((course.paidFee || 0) + (course.discount || 0))
                          )?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Installments</p>
                        <p className="font-medium">{course.installments}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Paid Installments
                        </p>
                        <p className="font-medium">
                          {course.paidInstallments || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-[#00965f] h-2.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (course.paidFee / course.finalPrice) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Discount</p>
                        <p className="font-medium text-green-700">
                          ₹{course.discount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enrollment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Enrollment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Enrollment Date</p>
                    <p className="font-medium">
                      {new Date(
                        selectedStudent.enrollmentDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                    <p className="font-medium">
                      {selectedStudent.overallProgress}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Student
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setImagePreview(null);
                  setImageError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Personal Information
                  </h3>

                  {/* Photo Upload Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Photo
                      </label>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <label className="flex-1">
                              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-center gap-2">
                                  <FaPlus className="h-5 w-5 text-gray-500" />
                                  <span className="text-gray-600">
                                    Upload Photo
                                  </span>
                                </div>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {imageError && (
                            <p className="mt-2 text-sm text-red-600">
                              {imageError}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-gray-500">
                            Image should be less than 150KB
                          </p>
                        </div>
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <FaTimes className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Alternative Phone
                      </label>
                      <input
                        type="tel"
                        name="alternativePhone"
                        value={formData.alternativePhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Academic Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Academic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="academicDetails.qualification"
                        value={formData.academicDetails.qualification}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Institution
                      </label>
                      <input
                        type="text"
                        name="academicDetails.institution"
                        value={formData.academicDetails.institution}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Year
                      </label>
                      <input
                        type="text"
                        name="academicDetails.year"
                        value={formData.academicDetails.year}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Percentage
                      </label>
                      <input
                        type="number"
                        name="academicDetails.percentage"
                        value={formData.academicDetails.percentage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Course Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Course Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Select Course
                      </label>
                      <select
                        name="myCourses.course"
                        value={formData.myCourses.course}
                        onChange={handleCourseChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      >
                        <option value="">Select a course</option>
                        {offlineCourses?.map((course) => (
                          <option key={course?._id} value={course?._id}>
                            {course?.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Registration Fee
                      </label>
                      <input
                        type="number"
                        name="myCourses.regFee"
                        value={formData.myCourses.regFee}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Course Fee Details */}
                  {selectedCourseDetails && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <h4 className="font-medium text-gray-800">
                        Course Fee Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Course Fee</p>
                          <p className="font-medium">
                            ₹{selectedCourseDetails.fee?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">
                            {selectedCourseDetails.duration} months
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Level</p>
                          <p className="font-medium">
                            {selectedCourseDetails.level}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-medium">
                          {selectedCourseDetails.description}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Paid Fee
                      </label>
                      <input
                        type="number"
                        name="myCourses.paidFee"
                        value={formData.myCourses.paidFee}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Number of Installments
                      </label>
                      <input
                        type="number"
                        name="myCourses.installments"
                        value={formData.myCourses.installments}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Final Price
                      </label>
                      <input
                        type="number"
                        name="myCourses.finalPrice"
                        value={
                          selectedCourseDetails
                            ? selectedCourseDetails.fee || 0
                            : 0
                        }
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  {/* Pending Fee Calculation */}
                  <div className="mt-2">
                    <label className="block mb-1 font-medium text-gray-700">
                      Pending Fee
                    </label>
                    <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                      ₹
                      {(() => {
                        const finalPrice = selectedCourseDetails
                          ? selectedCourseDetails.fee || 0
                          : 0;
                        const paidFee = Number(formData.myCourses.paidFee) || 0;
                        const regFee = Number(formData.myCourses.regFee) || 0;
                        const pending = finalPrice - (paidFee + regFee);
                        return pending > 0 ? pending.toLocaleString() : 0;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {isDiscountModalOpen && discountStudent && discountCourse && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Give Discount
              </h2>
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="mb-4">
                <p className="mb-1 text-gray-700">
                  <span className="font-semibold">{discountStudent.name}</span>{" "}
                  —{" "}
                  <span className="font-semibold">{discountCourse.title}</span>
                </p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
                  <div>
                    Course Fee:{" "}
                    <span className="font-semibold">
                      ₹
                      {discountStudent?.myCourses?.[0]?.finalPrice?.toLocaleString() ||
                        0}
                    </span>
                  </div>
                  <div>
                    Paid Fee:{" "}
                    <span className="font-semibold">
                      ₹
                      {discountStudent?.myCourses?.[0]?.paidFee?.toLocaleString() ||
                        0}
                    </span>
                  </div>
                  <div>
                    Pending Fee:{" "}
                    <span className="font-semibold text-red-600">
                      ₹
                      {(
                        (discountStudent?.myCourses?.[0]?.finalPrice || 0) -
                        ((discountStudent?.myCourses?.[0]?.paidFee || 0) +
                          (discountStudent?.myCourses?.[0]?.discount || 0))
                      )?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Current Discount:{" "}
                    <span className="font-semibold text-green-700">
                      ₹{discountStudent?.myCourses?.[0]?.discount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setDiscountLoading(true);
                  setDiscountError("");
                  try {
                    await dispatch(
                      giveDiscount({
                        studentId: discountStudent._id,
                        courseId: discountCourse._id,
                        discountAmount: Number(discountAmount),
                      })
                    ).unwrap();
                    // Show toast
                    toast.success("Discount applied successfully!");
                    // Refresh students list
                    await dispatch(fetchOfflineStudents());
                    setIsDiscountModalOpen(false);
                    setDiscountLoading(false);
                  } catch (err) {
                    setDiscountError(err?.error || "Failed to apply discount");
                    setDiscountLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <label className="block mb-2 font-medium text-gray-700">
                  Discount Amount
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                  required
                />
                {discountError && (
                  <p className="text-sm text-red-500">{discountError}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors disabled:opacity-50"
                    disabled={discountLoading}
                  >
                    {discountLoading ? "Applying..." : "Apply Discount"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pay Fee Modal */}
      {isPayFeeModalOpen && payFeeStudent && payFeeCourse && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Pay Fee</h2>
              <button
                onClick={() => setIsPayFeeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="mb-4">
                <p className="mb-1 text-gray-700">
                  <span className="font-semibold">{payFeeStudent.name}</span> —{" "}
                  <span className="font-semibold">{payFeeCourse.title}</span>
                </p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
                  <div>
                    Course Fee:{" "}
                    <span className="font-semibold">
                      ₹
                      {payFeeStudent?.myCourses?.[0]?.finalPrice?.toLocaleString() ||
                        0}
                    </span>
                  </div>
                  <div>
                    Paid Fee:{" "}
                    <span className="font-semibold">
                      ₹
                      {payFeeStudent?.myCourses?.[0]?.paidFee?.toLocaleString() ||
                        0}
                    </span>
                  </div>
                  <div>
                    Pending Fee:{" "}
                    <span className="font-semibold text-red-600">
                      ₹
                      {(
                        (payFeeStudent?.myCourses?.[0]?.finalPrice || 0) -
                        ((payFeeStudent?.myCourses?.[0]?.paidFee || 0) +
                          (payFeeStudent?.myCourses?.[0]?.discount || 0))
                      )?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Discount:{" "}
                    <span className="font-semibold text-green-700">
                      ₹{payFeeStudent?.myCourses?.[0]?.discount || 0}
                    </span>
                  </div>
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPayFeeLoading(true);
                  setPayFeeError("");
                  try {
                    await dispatch(
                      payFee({
                        studentId: payFeeStudent._id,
                        courseId: payFeeCourse._id,
                        amountPaid: Number(payFeeAmount),
                      })
                    ).unwrap();
                    toast.success("Fee payment processed successfully!");
                    await dispatch(fetchOfflineStudents());
                    setIsPayFeeModalOpen(false);
                    setPayFeeLoading(false);
                  } catch (err) {
                    setPayFeeError(
                      err?.error || "Failed to process fee payment"
                    );
                    setPayFeeLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <label className="block mb-2 font-medium text-gray-700">
                  Amount to Pay
                </label>
                <input
                  type="number"
                  min="1"
                  value={payFeeAmount}
                  onChange={(e) => setPayFeeAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                  required
                />
                {payFeeError && (
                  <p className="text-sm text-red-500">{payFeeError}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors disabled:opacity-50"
                    disabled={payFeeLoading}
                  >
                    {payFeeLoading ? "Processing..." : "Pay Fee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Student added successfully!
            </h2>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Exams Component
const ExamsSection = ({ offlineCourses, dispatch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    totalMarks: "",
    passingMarks: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [localCourses, setLocalCourses] = useState(offlineCourses);

  useEffect(() => {
    setLocalCourses(offlineCourses);
  }, [offlineCourses]);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
    setSelectedSemester("");
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const course = localCourses.find((c) => c._id === selectedCourseId);
      const payload = {
        courseId: selectedCourseId,
        name: formData.name,
        date: formData.date,
        totalMarks: formData.totalMarks,
        passingMarks: formData.passingMarks,
        description: formData.description,
      };
      let newExam = {
        name: formData.name,
        date: formData.date,
        totalMarks: formData.totalMarks,
        passingMarks: formData.passingMarks,
        description: formData.description,
      };
      if (course && course.semesters && course.semesters.length > 0) {
        const semester = course.semesters.find(
          (s) => s.number == selectedSemester || s.name === selectedSemester
        );
        if (semester) {
          payload.semesterNumber = semester.number;
          payload.semesterName = semester.name;
        }
      }
      await dispatch(addExam(payload)).unwrap();
      setLocalCourses((prevCourses) => {
        return prevCourses.map((c) => {
          if (c._id !== selectedCourseId) return c;
          if (c.semesters && c.semesters.length > 0 && selectedSemester) {
            return {
              ...c,
              semesters: c.semesters.map((s) => {
                if (
                  s.number == selectedSemester ||
                  s.name === selectedSemester
                ) {
                  return {
                    ...s,
                    exams: [...(s.exams || []), newExam],
                  };
                }
                return s;
              }),
            };
          } else {
            return {
              ...c,
              exams: [...(c.exams || []), newExam],
            };
          }
        });
      });
      setSuccess("Exam added successfully");
      setIsModalOpen(false);
      setFormData({
        name: "",
        date: "",
        totalMarks: "",
        passingMarks: "",
        description: "",
      });
      setSelectedCourseId("");
      setSelectedSemester("");
    } catch (err) {
      setError(err?.message || "Failed to add exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-[#164758] flex items-center gap-3 tracking-tight">
          <FaCalendarAlt className="h-8 w-8 text-[#00965f]" /> Exams
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#00965f] to-[#007f4f] text-white rounded-xl shadow-lg hover:scale-105 hover:from-[#007f4f] transition-all flex items-center gap-3 text-lg font-semibold"
        >
          <FaPlus className="h-6 w-6" /> Add Exam
        </button>
      </div>
      {/* Table format for Courses and Exams */}
      <div className="space-y-10">
        {localCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-[#00965f]/10 text-[#00965f] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {course.category}
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {course.level}
              </span>
            </div>
            <h2
              className="text-xl font-bold text-gray-800 mb-1 truncate"
              title={course.title}
            >
              {course.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    {course.semesters && course.semesters.length > 0 && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Semester
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Exam Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Marks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Passing Marks
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {course.semesters && course.semesters.length > 0 ? (
                    course.semesters.flatMap((semester) =>
                      (semester.exams && semester.exams.length > 0
                        ? semester.exams
                        : [null]
                      ).map((exam, idx) => (
                        <tr
                          key={semester.name + idx}
                          className="hover:bg-[#f8fafc] transition-colors"
                        >
                          <td className="px-4 py-3 align-top">
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {semester.name || semester.number}
                            </span>
                          </td>
                          {exam ? (
                            <>
                              <td className="px-4 py-3 font-medium text-gray-800">
                                {exam.name}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {exam.date
                                  ? new Date(exam.date).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {exam.totalMarks}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {exam.passingMarks}
                              </td>
                              <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                                {exam.description}
                              </td>
                            </>
                          ) : (
                            <td
                              className="px-4 py-3 text-gray-400 italic"
                              colSpan={5}
                            >
                              No exams for this semester.
                            </td>
                          )}
                        </tr>
                      ))
                    )
                  ) : course.exams && course.exams.length > 0 ? (
                    course.exams.map((exam, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {exam.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {exam.date
                            ? new Date(exam.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {exam.totalMarks}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {exam.passingMarks}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {exam.description}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-4 py-3 text-gray-400 italic"
                        colSpan={
                          course.semesters && course.semesters.length > 0
                            ? 6
                            : 5
                        }
                      >
                        No exams for this course.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      {/* Add Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Add Exam</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Select Course
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={handleCourseChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                    required
                  >
                    <option value="">Select a course</option>
                    {offlineCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* If course has semesters, show semester select */}
                {selectedCourseId &&
                  offlineCourses.find((c) => c._id === selectedCourseId)
                    ?.semesters?.length > 0 && (
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Select Semester
                      </label>
                      <select
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      >
                        <option value="">Select a semester</option>
                        {offlineCourses
                          .find((c) => c._id === selectedCourseId)
                          .semesters.map((semester) => (
                            <option
                              key={semester.number || semester.name}
                              value={semester.number || semester.name}
                            >
                              {semester.name || semester.number}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Exam Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      name="totalMarks"
                      value={formData.totalMarks}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Passing Marks
                    </label>
                    <input
                      type="number"
                      name="passingMarks"
                      value={formData.passingMarks}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Exam"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component with dynamic import and SSR disabled
const InhouseAdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    offlineCourses = [],
    offlineStudents = [],
    error,
    message,
    videoLoading,
    videoError,
    videos,
    getVideosLoading,
    getVideosError,
  } = useSelector((state) => state.inhouse);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [installmentPeriod, setInstallmentPeriod] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [courseType, setCourseType] = useState("Short Term");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    fee: "",
    level: "Beginner",
    instructor_name: "",
    semesters: [
      {
        name: "",
        number: "",
        subjects: [
          {
            name: "",
            code: "",
            description: "",
            exams: [
              {
                name: "",
                date: "",
                totalMarks: "",
                passingMarks: "",
                description: "",
              },
            ],
          },
        ],
      },
    ],
  });
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    parentName: "",
    email: "",
    password: "",
    phone: "",
    alternativePhone: "",
    address: "",
    myCourses: {
      course: "",
      finalPrice: 0,
      paidFee: "",
      installments: 0,
      discount: 0,
    },
    academicDetails: {
      qualification: "",
      institution: "",
      year: "",
      percentage: 0,
    },
    profileImage: "",
    dob: "",
    gender: "",
    status: "active",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    description: "",
    course: "",
    videoFile: null,
    thumbnailFile: null,
    videoUrl: "", // Add videoUrl field
    uploadType: "file", // Add uploadType field to track which option is selected
  });
  const [documentFormData, setDocumentFormData] = useState({
    title: "",
    description: "",
    course: "",
    documentFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path) => {
    const tab = path.split("/").pop();
    setActiveTab(tab === "inhouseadmin" ? "dashboard" : tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchOfflineCourses()),
          dispatch(fetchOfflineStudents()),
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

  useEffect(() => {
    if (activeTab === "videos") {
      dispatch(getVideos());
    }
  }, [activeTab, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setStudentFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setStudentFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "semesters") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add course type
      formDataToSend.append("courseType", courseType);

      const response = await dispatch(
        addOfflineCourse(formDataToSend)
      ).unwrap();
      if (response.success) {
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          duration: "",
          category: "",
          fee: "",
          level: "Beginner",
          instructor_name: "",
          semesters: [
            {
              name: "",
              number: "",
              subjects: [
                {
                  name: "",
                  code: "",
                  description: "",
                  exams: [
                    {
                      name: "",
                      date: "",
                      totalMarks: "",
                      passingMarks: "",
                      description: "",
                    },
                  ],
                },
              ],
            },
          ],
        });
        setCourseType("Short Term");
        setActiveSection("basic");
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add registration fee to paid fee before sending
      const updatedStudentFormData = { ...studentFormData };
      if (
        updatedStudentFormData.myCourses &&
        typeof updatedStudentFormData.myCourses.paidFee === "number" &&
        typeof updatedStudentFormData.myCourses.regFee === "number"
      ) {
        updatedStudentFormData.myCourses.paidFee =
          updatedStudentFormData.myCourses.paidFee +
          updatedStudentFormData.myCourses.regFee;
      }
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(updatedStudentFormData).forEach((key) => {
        if (key === "myCourses" || key === "academicDetails") {
          formDataToSend.append(
            key,
            JSON.stringify(updatedStudentFormData[key])
          );
        } else if (key === "profileImage" && updatedStudentFormData[key]) {
          // Append the file with the correct field name for multer
          formDataToSend.append("profileImage", updatedStudentFormData[key]);
        } else {
          formDataToSend.append(key, updatedStudentFormData[key]);
        }
      });

      const response = await dispatch(
        addOfflineStudent(formDataToSend)
      ).unwrap();

      // Close modal and reset form
      setIsModalOpen(false);
      setStudentFormData({
        name: "",
        parentName: "",
        email: "",
        password: "",
        phone: "",
        alternativePhone: "",
        address: "",
        myCourses: {
          course: "",
          finalPrice: 0,
          paidFee: "",
          installments: 0,
          discount: 0,
        },
        academicDetails: {
          qualification: "",
          institution: "",
          year: "",
          percentage: 0,
        },
        profileImage: "",
        dob: "",
        gender: "",
        status: "active",
      });

      // Reset image preview and error
      if (setImagePreview) {
        setImagePreview(null);
      }
      if (setImageError) {
        setImageError("");
      }

      // Show success message
      toast.success("Student added successfully!");

      // Refresh the students list
      dispatch(fetchOfflineStudents());
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error.message || "Failed to add student");
    }
  };

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentInputChange = (e) => {
    const { name, value } = e.target;
    setDocumentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFormData((prev) => ({
        ...prev,
        thumbnailFile: file,
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  // Clean up preview URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setIsVideoModalOpen(false);

    try {
      const formData = new FormData();
      formData.append("title", videoFormData.title);
      formData.append("description", videoFormData.description);
      formData.append("course", videoFormData.course);

      if (videoFormData.uploadType === "file" && videoFormData.videoFile) {
        formData.append("video", videoFormData.videoFile);
      } else if (videoFormData.uploadType === "url" && videoFormData.videoUrl) {
        formData.append("videoUrl", videoFormData.videoUrl);
      }

      if (videoFormData.thumbnailFile) {
        formData.append("thumbnail", videoFormData.thumbnailFile);
      }

      const result = await dispatch(createVideo(formData)).unwrap();

      if (result.success) {
        toast.success("Video uploaded successfully");
        setVideoFormData({
          title: "",
          description: "",
          course: "",
          videoFile: null,
          thumbnailFile: null,
          videoUrl: "",
          uploadType: "file",
        });
        setThumbnailPreview(null);
        setUploadProgress(0);
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload video");
      setUploadProgress(0);
    }
  };

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    // Handle document upload logic here
    setIsDocumentModalOpen(false);
    setDocumentFormData({
      title: "",
      description: "",
      course: "",
      documentFile: null,
    });
  };

  const formatVideoUrl = (url) => {
    if (!url) return null;

    // Handle YouTube URLs
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";

      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      } else if (url.includes("youtu.be")) {
        videoId = url.split("/").pop();
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Handle Vimeo URLs
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Return original URL for other video sources
    return url;
  };

  const handlePlayVideo = (video) => {
    console.log("Original URL:", video.videoUrl);
    const formattedUrl = formatVideoUrl(video.videoUrl);
    console.log("Formatted URL:", formattedUrl);
    setSelectedVideo({ ...video, formattedUrl });
    setIsVideoPlayerOpen(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    router.push("/inhouse/admin/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-20 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden"
      >
        {isMobileMenuOpen ? (
          <FaTimes className="h-6 w-6 text-gray-600" />
        ) : (
          <FaBars className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-72 bg-white border-r border-gray-200 flex flex-col py-8 px-4 min-h-screen fixed shadow-lg mt-16 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="mb-10 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#164758]">In-House Admin</h2>
        </div>
        <nav>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "dashboard"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaBook className="h-5 w-5" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("courses");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "courses"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaBook className="h-5 w-5" />
                Courses
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("students");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "students"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUsers className="h-5 w-5" />
                Students Enrolled
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("videos");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "videos"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaVideo className="h-5 w-5" />
                Videos
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("documents");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "documents"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaFileAlt className="h-5 w-5" />
                Documents
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("analytics");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "analytics"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaChartLine className="h-5 w-5" />
                Analytics
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("exams");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 w-full ${
                  activeTab === "exams"
                    ? "bg-[#00965f]/10 text-[#00965f] shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaCalendarAlt className="h-5 w-5" />
                Exams
              </button>
            </li>
          </ul>
        </nav>
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
          >
            <FaSignOutAlt className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 ml-0 md:ml-72 mt-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <>
                  <header className="mb-6 md:mb-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-[#164758] mb-2 md:mb-3">
                      Welcome back!
                    </h1>
                    <p className="text-base md:text-lg text-gray-600">
                      Here's what's happening with your courses today.
                    </p>
                  </header>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 shadow-sm">
                      {error}
                    </div>
                  )}

                  {/* Filters */}
                  <div className="mb-6 md:mb-8 flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 flex-1">
                      <FaFilter className="text-[#00965f]" />
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00965f] focus:border-transparent bg-gray-50"
                      >
                        <option value="all">All Courses</option>
                        {offlineCourses?.map((course) => (
                          <option key={course?._id} value={course?._id}>
                            {course?.title || "Untitled Course"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <FaFilter className="text-[#00965f]" />
                      <select
                        value={installmentPeriod}
                        onChange={(e) => setInstallmentPeriod(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00965f] focus:border-transparent bg-gray-50"
                      >
                        <option value="all">All Time</option>
                        <option value="monthly">This Month</option>
                        <option value="yearly">This Year</option>
                      </select>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Students
                          </p>
                          <h3 className="text-3xl font-bold text-gray-900 mt-2">
                            {offlineStudents?.length || 0}
                          </h3>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                          <FaGraduationCap className="h-7 w-7 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Pending Fee
                          </p>
                          <h3 className="text-3xl font-bold text-gray-900 mt-2">
                            ₹
                            {(() => {
                              const allCourses =
                                offlineStudents?.flatMap(
                                  (student) => student.myCourses || []
                                ) || [];
                              const totalFinalPrice = allCourses.reduce(
                                (sum, course) => sum + (course.finalPrice || 0),
                                0
                              );
                              const totalPaidAndDiscount = allCourses.reduce(
                                (sum, course) =>
                                  sum +
                                  (course.paidFee || 0) +
                                  (course.discount || 0),
                                0
                              );
                              return (
                                totalFinalPrice - totalPaidAndDiscount
                              ).toLocaleString();
                            })()}
                          </h3>
                        </div>
                        <div className="bg-[#00965f]/10 p-4 rounded-xl">
                          <FaChartLine className="h-7 w-7 text-[#00965f]" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Installments
                          </p>
                          <h3 className="text-3xl font-bold text-gray-900 mt-2">
                            {offlineStudents
                              ?.flatMap((student) => student.myCourses || [])
                              .reduce(
                                (total, course) =>
                                  total + (course.installments || 0),
                                0
                              )}
                          </h3>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl">
                          <FaCalendarAlt className="h-7 w-7 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Paid Installments
                          </p>
                          <h3 className="text-3xl font-bold text-gray-900 mt-2">
                            {offlineStudents
                              ?.flatMap((student) => student.myCourses || [])
                              .reduce(
                                (total, course) =>
                                  total + (course.paidInstallments || 0),
                                0
                              )}
                          </h3>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl">
                          <FaChartLine className="h-7 w-7 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* My Courses Section */}
                  <section className="mb-8 md:mb-12">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <FaBook className="h-6 w-6 md:h-7 md:w-7 text-[#00965f]" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        My Courses
                      </h3>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
                      {!offlineCourses || offlineCourses.length === 0 ? (
                        <div className="text-center py-12">
                          <FaBook className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg mb-2">
                            No courses available yet
                          </p>
                          <p className="text-gray-400">
                            Get started by adding your first course
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {offlineCourses.map((course) => (
                            <div
                              key={course?._id}
                              className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
                            >
                              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                {course?.title || "Untitled Course"}
                              </h4>
                              <p className="text-gray-600">
                                {course?.description ||
                                  "No description available"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Students Enrolled Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <FaUsers className="h-6 w-6 md:h-7 md:w-7 text-[#00965f]" />
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        Students Enrolled
                      </h3>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 overflow-x-auto">
                      {!offlineStudents || offlineStudents.length === 0 ? (
                        <div className="text-center py-12">
                          <FaUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg mb-2">
                            No students enrolled yet
                          </p>
                          <p className="text-gray-400">
                            Start by adding your first student
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b border-gray-200">
                                <th className="pb-4 font-semibold text-gray-600">
                                  Name
                                </th>
                                <th className="pb-4 font-semibold text-gray-600">
                                  Course
                                </th>
                                <th className="pb-4 font-semibold text-gray-600">
                                  Status
                                </th>
                                <th className="pb-4 font-semibold text-gray-600">
                                  Progress
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {offlineStudents.map((student) => (
                                <tr
                                  key={student?._id}
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="py-4 font-medium">
                                    {student?.name || "-"}
                                  </td>
                                  <td className="py-4">
                                    {student?.myCourses?.[0]?.course?.title ||
                                      "-"}
                                  </td>
                                  <td className="py-4">
                                    <span className="px-3 py-1.5 text-sm rounded-full bg-green-50 text-green-600 font-medium">
                                      {student?.status || "Active"}
                                    </span>
                                  </td>
                                  <td className="py-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-[#00965f] h-2.5 rounded-full transition-all duration-300"
                                        style={{
                                          width: `${
                                            (parseFloat(
                                              student?.myCourses?.[0]
                                                ?.paidFee || 0
                                            ) /
                                              parseFloat(
                                                student?.myCourses?.[0]
                                                  ?.finalPrice || 1
                                              )) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
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

              {activeTab === "courses" && (
                <CoursesSection
                  offlineCourses={offlineCourses}
                  offlineStudents={offlineStudents}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  handleSubmit={handleSubmit}
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  handleFileChange={() => {}}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  courseType={courseType}
                  setCourseType={setCourseType}
                />
              )}

              {activeTab === "students" && (
                <StudentsSection
                  offlineStudents={offlineStudents}
                  offlineCourses={offlineCourses}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  handleSubmit={handleStudentSubmit}
                  formData={studentFormData}
                  setFormData={setStudentFormData}
                  handleInputChange={handleStudentInputChange}
                  dispatch={dispatch}
                />
              )}

              {activeTab === "videos" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-[#164758]">
                        Videos
                      </h1>
                      <p className="text-gray-600">Manage your course videos</p>
                    </div>
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2"
                    >
                      <FaPlus className="h-5 w-5" />
                      Add Video
                    </button>
                  </div>

                  {getVideosLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <FaSpinner className="h-8 w-8 text-[#00965f] animate-spin" />
                    </div>
                  ) : getVideosError ? (
                    <div className="text-center py-12">
                      <p className="text-red-500 mb-2">{getVideosError}</p>
                      <button
                        onClick={() => dispatch(getVideos())}
                        className="text-[#00965f] hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : videos.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="text-center py-12">
                        <FaVideo className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">
                          No videos available yet
                        </p>
                        <p className="text-gray-400">
                          Start by adding your first video
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Thumbnail
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Title
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Description
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Course
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Upload Date
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {videos.map((video) => (
                              <tr key={video._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                                    <Image
                                      src={video.thumbnail}
                                      alt={video.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {video.title}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {video.description}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-600">
                                    {video.course?.title}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-600">
                                    {new Date(
                                      video.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handlePlayVideo(video)}
                                      className="p-2 text-gray-500 hover:text-[#00965f] transition-colors"
                                      title="Play Video"
                                    >
                                      <FaPlay className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Handle edit video
                                      }}
                                      className="p-2 text-gray-500 hover:text-[#00965f] transition-colors"
                                      title="Edit Video"
                                    >
                                      <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Handle delete video
                                      }}
                                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                      title="Delete Video"
                                    >
                                      <FaTrash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {isVideoModalOpen && (
                    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Add New Video
                          </h2>
                          <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="p-6">
                          <form
                            onSubmit={handleVideoSubmit}
                            className="space-y-6"
                          >
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={videoFormData.title}
                                onChange={handleVideoInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={videoFormData.description}
                                onChange={handleVideoInputChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Course
                              </label>
                              <select
                                name="course"
                                value={videoFormData.course}
                                onChange={handleVideoInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                required
                              >
                                <option value="">Select a course</option>
                                {offlineCourses?.map((course) => (
                                  <option key={course?._id} value={course?._id}>
                                    {course?.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Upload Type
                              </label>
                              <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="uploadType"
                                    value="file"
                                    checked={
                                      videoFormData.uploadType === "file"
                                    }
                                    onChange={(e) =>
                                      setVideoFormData((prev) => ({
                                        ...prev,
                                        uploadType: e.target.value,
                                      }))
                                    }
                                    className="text-[#00965f] focus:ring-[#00965f]"
                                  />
                                  <span>Upload Video File</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="uploadType"
                                    value="url"
                                    checked={videoFormData.uploadType === "url"}
                                    onChange={(e) =>
                                      setVideoFormData((prev) => ({
                                        ...prev,
                                        uploadType: e.target.value,
                                      }))
                                    }
                                    className="text-[#00965f] focus:ring-[#00965f]"
                                  />
                                  <span>Video URL</span>
                                </label>
                              </div>

                              {videoFormData.uploadType === "file" ? (
                                <div>
                                  <label className="block mb-2 font-medium text-gray-700">
                                    Video File
                                  </label>
                                  <div className="flex items-center gap-4">
                                    <label className="flex-1">
                                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-center gap-2">
                                          <FaUpload className="h-5 w-5 text-gray-500" />
                                          <span className="text-gray-600">
                                            Upload Video
                                          </span>
                                        </div>
                                      </div>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) =>
                                          setVideoFormData((prev) => ({
                                            ...prev,
                                            videoFile: e.target.files[0],
                                          }))
                                        }
                                        className="hidden"
                                        required={
                                          videoFormData.uploadType === "file"
                                        }
                                      />
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <label className="block mb-2 font-medium text-gray-700">
                                    Video URL
                                  </label>
                                  <input
                                    type="url"
                                    name="videoUrl"
                                    value={videoFormData.videoUrl}
                                    onChange={handleVideoInputChange}
                                    placeholder="Enter video URL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                    required={
                                      videoFormData.uploadType === "url"
                                    }
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Thumbnail
                              </label>
                              <div className="flex items-center gap-4">
                                <label className="flex-1">
                                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-center gap-2">
                                      <FaUpload className="h-5 w-5 text-gray-500" />
                                      <span className="text-gray-600">
                                        Upload Thumbnail
                                      </span>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                    required
                                  />
                                </label>
                              </div>
                              {thumbnailPreview && (
                                <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                  <Image
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setThumbnailPreview(null);
                                      setVideoFormData((prev) => ({
                                        ...prev,
                                        thumbnailFile: null,
                                      }));
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <FaTimes className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                disabled={videoLoading}
                                className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {videoLoading ? "Uploading..." : "Upload Video"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "documents" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-[#164758]">
                        Documents
                      </h1>
                      <p className="text-gray-600">
                        Manage your course documents
                      </p>
                    </div>
                    <button
                      onClick={() => setIsDocumentModalOpen(true)}
                      className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2"
                    >
                      <FaPlus className="h-5 w-5" />
                      Add Document
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="text-center py-12">
                      <FaFileAlt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">
                        No documents available yet
                      </p>
                      <p className="text-gray-400">
                        Start by adding your first document
                      </p>
                    </div>
                  </div>

                  {isDocumentModalOpen && (
                    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Add New Document
                          </h2>
                          <button
                            onClick={() => setIsDocumentModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="p-6">
                          <form
                            onSubmit={handleDocumentSubmit}
                            className="space-y-6"
                          >
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={documentFormData.title}
                                onChange={handleDocumentInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={documentFormData.description}
                                onChange={handleDocumentInputChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Course
                              </label>
                              <select
                                name="course"
                                value={documentFormData.course}
                                onChange={handleDocumentInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                                required
                              >
                                <option value="">Select a course</option>
                                {offlineCourses?.map((course) => (
                                  <option key={course?._id} value={course?._id}>
                                    {course?.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">
                                Document File
                              </label>
                              <div className="flex items-center gap-4">
                                <label className="flex-1">
                                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-center gap-2">
                                      <FaUpload className="h-5 w-5 text-gray-500" />
                                      <span className="text-gray-600">
                                        Upload Document
                                      </span>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) =>
                                      setDocumentFormData((prev) => ({
                                        ...prev,
                                        documentFile: e.target.files[0],
                                      }))
                                    }
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="px-6 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors"
                              >
                                Upload Document
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="text-center py-12">
                  <FaChartLine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    Analytics Coming Soon
                  </p>
                  <p className="text-gray-400">
                    We're working on bringing you detailed analytics
                  </p>
                </div>
              )}

              {activeTab === "exams" && (
                <ExamsSection
                  offlineCourses={offlineCourses}
                  dispatch={dispatch}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Upload Progress Indicator */}
      {videoLoading && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaSpinner className="h-5 w-5 text-[#00965f] animate-spin" />
              <span className="font-medium text-gray-700">
                Uploading Video...
              </span>
            </div>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00965f] h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {isVideoPlayerOpen && selectedVideo && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedVideo.title}
              </h2>
              <button
                onClick={() => {
                  setIsVideoPlayerOpen(false);
                  setSelectedVideo(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                {selectedVideo.formattedUrl ? (
                  <iframe
                    src={selectedVideo.formattedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white">Video URL not available</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedVideo.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Course: {selectedVideo.course?.title}</span>
                  <span>
                    Uploaded:{" "}
                    {new Date(selectedVideo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component with dynamic import and SSR disabled
export default dynamic(() => Promise.resolve(InhouseAdminDashboard), {
  ssr: false,
});
