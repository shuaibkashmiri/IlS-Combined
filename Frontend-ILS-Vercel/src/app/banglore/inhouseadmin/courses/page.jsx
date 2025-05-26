"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addOfflineCourse, fetchOfflineCourses } from "../../../../redux/features/inhouseSlice";
import { FaPlus, FaBook, FaGraduationCap, FaCalendarAlt, FaFileAlt, FaArrowLeft, FaTimes } from "react-icons/fa";
import Link from "next/link";

// Create a loading component (can be reused)
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/banglore/inhouseadmin" className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#164758]">Courses</h1>
        </div>
      </div>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-[#00965f] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading courses data...</p>
        </div>
      </div>
    </div>
  </div>
);

// Main component for Courses Page
export default function OfflineCoursesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, message, offlineCourses = [] } = useSelector((state) => state.inhouse);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("basic"); // basic, semesters, thumbnail for modal
  const [courseType, setCourseType] = useState("Short Term"); // "Short Term" or "Long Term"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "", // This will now store duration in months
    category: "",
    fee: "",
    level: "Beginner",
    instructor_name: "",
    semesters: [{ name: "", number: "", subjects: [{ name: "", code: "", description: "", exams: [{ name: "", date: "", totalMarks: "", passingMarks: "", description: "" }] }] }],
  });
  const [thumbnail, setThumbnail] = useState(null);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch offline courses when the component mounts or modal is closed after adding a course
  useEffect(() => {
    if (mounted) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await dispatch(fetchOfflineCourses());
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [dispatch, mounted, isModalOpen]); // Depend on isModalOpen to refetch after closing modal

  const handleInputChange = (e, semesterIndex, subjectIndex, examIndex) => {
    const { name, value } = e.target;

    if (semesterIndex !== undefined && subjectIndex !== undefined && examIndex !== undefined) {
      const updatedSemesters = [...formData.semesters];
      updatedSemesters[semesterIndex].subjects[subjectIndex].exams[examIndex][name] = value;
      setFormData({ ...formData, semesters: updatedSemesters });
    } else if (semesterIndex !== undefined && subjectIndex !== undefined) {
      const updatedSemesters = [...formData.semesters];
      updatedSemesters[semesterIndex].subjects[subjectIndex][name] = value;
      setFormData({ ...formData, semesters: updatedSemesters });
    } else if (semesterIndex !== undefined) {
      const updatedSemesters = [...formData.semesters];
      updatedSemesters[semesterIndex][name] = value;
      setFormData({ ...formData, semesters: updatedSemesters });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSemester = () => {
    setFormData({
      ...formData,
      semesters: [...formData.semesters, { name: "", number: "", subjects: [{ name: "", code: "", description: "", exams: [{ name: "", date: "", totalMarks: "", passingMarks: "", description: "" }] }] }],
    });
  };

  const addSubject = (semesterIndex) => {
    const updatedSemesters = [...formData.semesters];
    updatedSemesters[semesterIndex].subjects.push({ name: "", code: "", description: "", exams: [{ name: "", date: "", totalMarks: "", passingMarks: "", description: "" }] });
    setFormData({ ...formData, semesters: updatedSemesters });
  };

  const addExam = (semesterIndex, subjectIndex) => {
    const updatedSemesters = [...formData.semesters];
    updatedSemesters[semesterIndex].subjects[subjectIndex].exams.push({ name: "", date: "", totalMarks: "", passingMarks: "", description: "" });
    setFormData({ ...formData, semesters: updatedSemesters });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("duration", formData.duration);
    data.append("category", formData.category);
    data.append("fee", formData.fee);
    data.append("level", formData.level);
    data.append("instructor_name", formData.instructor_name);
    data.append("semesters", JSON.stringify(formData.semesters));
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    const resultAction = await dispatch(addOfflineCourse(data));

    if (addOfflineCourse.fulfilled.match(resultAction)) {
      // Clear form and close modal on success
      setFormData({
        title: "",
        description: "",
        duration: "",
        category: "",
        fee: "",
        level: "Beginner",
        instructor_name: "",
        semesters: [{ name: "", number: "", subjects: [{ name: "", code: "", description: "", exams: [{ name: "", date: "", totalMarks: "", passingMarks: "", description: "" }] }] }],
      });
      setThumbnail(null);
      setActiveSection("basic"); // Reset to basic section
      setIsModalOpen(false);
    }
  };

  // Show loading state if not mounted or loading
  if (!mounted || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/banglore/inhouseadmin" className="text-gray-600 hover:text-gray-900">
              <FaArrowLeft className="h-5 w-5" />
            </Link>
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

        {message && !message.includes("student") && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {message}
          </div>
        )}
        {error && !error.includes("student") && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Courses List Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <FaBook className="h-6 w-6 text-[#00965f]" />
            <h3 className="text-xl font-semibold text-gray-800">Available Courses</h3>
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
                    </tr>
                  </thead>
                  <tbody>
                    {offlineCourses.map((course) => (
                      <tr key={course?._id || Math.random()} className="border-b border-gray-100">
                        <td className="py-4">{course?.title || '-'}</td>
                        <td className="py-4">{course?.category || '-'}</td>
                        <td className="py-4">{course?.duration || '-'} months</td>
                        <td className="py-4">{course?.fee || '-'}</td>
                        <td className="py-4">{course?.level || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No courses available yet</p>
                <p className="text-sm text-gray-400">Start by adding your first course</p>
              </div>
            )}
          </div>
        </section>

        {/* Add Course Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Add New Course</h2>
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === "basic" ? "bg-[#00965f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      Basic Info
                    </button>
                    {courseType === "Long Term" && (
                      <button
                        type="button"
                        onClick={() => setActiveSection("semesters")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === "semesters" ? "bg-[#00965f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        Semesters
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveSection("thumbnail")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === "thumbnail" ? "bg-[#00965f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      Thumbnail
                    </button>
                  </div>

                  {/* Course Type Toggle - Moved to Top */}
                  <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Course Type</label>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setCourseType("Short Term")}
                        className={`flex-1 px-4 py-2.5 text-center font-medium transition-colors ${
                          courseType === "Short Term" ? "bg-[#00965f] text-white" : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        Short Term
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseType("Long Term")}
                        className={`flex-1 px-4 py-2.5 text-center font-medium transition-colors ${
                          courseType === "Long Term" ? "bg-[#00965f] text-white" : "text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        Long Term
                      </button>
                    </div>
                  </div>

                  {/* Basic Information Section */}
                  {activeSection === "basic" && (
                    <div className="space-y-6">
                       <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaBook className="h-5 w-5 text-[#00965f]" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Course Title</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Category</label>
                          <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Duration (months)</label>
                          <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Fee</label>
                          <input
                            type="number"
                            name="fee"
                            value={formData.fee}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Level</label>
                          <select
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block mb-2 font-medium text-gray-700">Instructor Name</label>
                          <input
                            type="text"
                            name="instructor_name"
                            value={formData.instructor_name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all min-h-[120px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Semesters Section */}
                  {activeSection === "semesters" && courseType === "Long Term" && (
                    <div className="space-y-6">
                       <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaBook className="h-5 w-5 text-[#00965f]" />
                        Semesters
                      </h3>
                      {formData.semesters.map((semester, semesterIndex) => (
                        <div key={semesterIndex} className="bg-gray-50 rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-800">Semester {semesterIndex + 1}</h4>
                            {/* Add remove semester button if needed */}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">Semester Name</label>
                              <input
                                type="text"
                                name="name"
                                value={semester.name}
                                onChange={(e) => handleInputChange(e, semesterIndex)}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 font-medium text-gray-700">Semester Number</label>
                              <input
                                type="number"
                                name="number"
                                value={semester.number}
                                onChange={(e) => handleInputChange(e, semesterIndex)}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          {/* Subjects */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                                <FaGraduationCap className="h-4 w-4 text-[#00965f]" />
                                Subjects
                              </h5>
                              <button
                                type="button"
                                onClick={() => addSubject(semesterIndex)}
                                className="flex items-center gap-2 bg-[#00965f] text-white px-4 py-2 rounded-lg hover:bg-[#007f4f] transition-colors font-medium text-sm"
                              >
                                <FaPlus className="h-4 w-4" /> Add Subject
                              </button>
                            </div>

                            {semester.subjects.map((subject, subjectIndex) => (
                              <div key={subjectIndex} className="bg-white rounded-lg p-4 space-y-4 border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block mb-2 font-medium text-gray-700">Subject Name</label>
                                    <input
                                      type="text"
                                      name="name"
                                      value={subject.name}
                                      onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex)}
                                      className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-2 font-medium text-gray-700">Subject Code</label>
                                    <input
                                      type="text"
                                      name="code"
                                      value={subject.code}
                                      onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex)}
                                      className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block mb-2 font-medium text-gray-700">Subject Description</label>
                                  <textarea
                                    name="description"
                                    value={subject.description}
                                    onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex)}
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all min-h-[80px]"
                                  />
                                </div>

                                {/* Exams */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h6 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                      <FaCalendarAlt className="h-4 w-4 text-[#00965f]" />
                                      Exams
                                    </h6>
                                    <button
                                      type="button"
                                      onClick={() => addExam(semesterIndex, subjectIndex)}
                                      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                    >
                                      <FaPlus className="h-3 w-3" /> Add Exam
                                    </button>
                                  </div>

                                  {subject.exams.map((exam, examIndex) => (
                                    <div key={examIndex} className="bg-gray-100 rounded-lg p-4 space-y-4 border border-gray-200">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block mb-2 font-medium text-gray-700">Exam Name</label>
                                          <input
                                            type="text"
                                            name="name"
                                            value={exam.name}
                                            onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex, examIndex)}
                                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label className="block mb-2 font-medium text-gray-700">Exam Date</label>
                                          <input
                                            type="date"
                                            name="date"
                                            value={exam.date}
                                            onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex, examIndex)}
                                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                          />
                                        </div>
                                        <div>
                                          <label className="block mb-2 font-medium text-gray-700">Total Marks</label>
                                          <input
                                            type="number"
                                            name="totalMarks"
                                            value={exam.totalMarks}
                                            onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex, examIndex)}
                                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                          />
                                        </div>
                                        <div>
                                          <label className="block mb-2 font-medium text-gray-700">Passing Marks</label>
                                          <input
                                            type="number"
                                            name="passingMarks"
                                            value={exam.passingMarks}
                                            onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex, examIndex)}
                                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block mb-2 font-medium text-gray-700">Exam Description</label>
                                        <textarea
                                          name="description"
                                          value={exam.description}
                                          onChange={(e) => handleInputChange(e, semesterIndex, subjectIndex, examIndex)}
                                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all min-h-[60px]"
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

                      <button
                        type="button"
                        onClick={addSemester}
                        className="w-full flex items-center justify-center gap-2 bg-[#00965f] text-white px-5 py-3 rounded-lg hover:bg-[#007f4f] transition-colors font-medium"
                      >
                        <FaPlus className="h-5 w-5" /> Add New Semester
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Section */}
                  {activeSection === "thumbnail" && (
                    <div className="space-y-6">
                       <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaFileAlt className="h-5 w-5 text-[#00965f]" />
                        Course Thumbnail
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="max-w-md mx-auto">
                          <label className="block mb-2 font-medium text-gray-700">Upload Thumbnail</label>
                          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#00965f] hover:text-[#007f4f] focus-within:outline-none">
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    required
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Action Buttons */}
                  <div className="flex justify-end gap-4 mt-6">
                     <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setActiveSection("basic"); // Reset to basic section on close
                        // Potentially reset form data here too if not handled by successful submit
                      }}
                      className="px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                     {activeSection !== "thumbnail" ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (activeSection === "basic") {
                            if (courseType === "Long Term") {
                              setActiveSection("semesters");
                            } else {
                              setActiveSection("thumbnail");
                            }
                          } else if (activeSection === "semesters") {
                            setActiveSection("thumbnail");
                          }
                        }}
                        className="px-6 py-2.5 rounded-lg font-medium bg-[#00965f] text-white hover:bg-[#007f4f] transition-colors"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg font-medium bg-[#00965f] text-white hover:bg-[#007f4f] transition-colors"
                        disabled={loading}
                      >
                        {loading ? "Adding Course..." : "Add Course"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}