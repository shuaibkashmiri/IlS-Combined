"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import { FaStar, FaUsers, FaClock, FaBriefcase, FaChartLine, FaGraduationCap, FaArrowRight } from "react-icons/fa";

import {
  getAllCourses,
  getSingleCourse,
} from "../../../redux/features/courseSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";
import AuthModal from "../sharedComponents/authModal";
import { motion } from "framer-motion";
import categoryData from "./category.json";

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.user);
  const [categoryCourses, setCategoryCourses] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses) {
      const category = searchParams.get("category");
      if (!category) {
        setCategoryCourses([]);
        setCategoryDetails(null);
        setLoading(false);
        return;
      }

      const decodedCategory = decodeURIComponent(category);

      // Filter courses based on category
      const filteredCourses = courses.filter(
        (course) => course.category.toLowerCase() === decodedCategory.toLowerCase()
      );
      setCategoryCourses(filteredCourses);

      // Find category details from category.json
      const categoryObj = categoryData.categories.find(
        (cat) => cat.name.toLowerCase() === decodedCategory.toLowerCase()
      );
      setCategoryDetails(categoryObj || null);

      setLoading(false);
    }
  }, [courses, searchParams]);

  const handleCourseClick = async (course) => {
    if (!user) {
      setSelectedCourse(course);
      setShowModal(true);
      return;
    }


    try {
      await dispatch(getSingleCourse(course._id)).unwrap();
      const isEnrolled = user.enrolledCourses?.some(
        (enrolledCourse) => enrolledCourse.courseId === course._id
      );

      if (isEnrolled) {
        router.push(`/banglore/courses/${course._id}`);
      } else {
        router.push("/banglore/demo-videos");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }

  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setSelectedCourse(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00965f]"></div>
      </div>
    );
  }

  const categoryName = searchParams.get("category")
    ? decodeURIComponent(searchParams.get("category"))
    : "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold text-[#164758] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#164758] to-[#00965f]">
            {categoryName} Courses
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Master the skills you need to excel in {categoryName}. Our expert-led courses will help you achieve your career goals.
          </p>
        </motion.div>

        {/* Category Details Card */}
        {categoryDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex-shrink-0 relative">
                <img
                  src={categoryDetails.image}
                  alt={categoryName}
                  className="w-full md:w-80 h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
              <div className="flex-1 space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">{categoryDetails.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBriefcase className="text-[#00965f] text-xl" />
                      <h4 className="text-lg font-semibold text-[#164758]">Career Paths</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoryDetails.job_roles.map((role, index) => (
                        <span key={index} className="bg-[#00965f]/10 text-[#00965f] px-3 py-1 rounded-full text-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <FaChartLine className="text-[#00965f] text-xl" />
                      <h4 className="text-lg font-semibold text-[#164758]">Course Level</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#00965f]/10 text-[#00965f] px-4 py-1 rounded-full text-sm font-medium">
                        {categoryDetails.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Cards Section */}
        {categoryCourses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No courses found in this category.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categoryCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative group">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-56 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {course.price && (
                    <div className="absolute top-4 right-4 bg-[#00965f] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300">
                      ₹{course.price.$numberDecimal}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#164758] mb-3 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-[#00965f]" />
                      <span>{course.enrolledStudents || 0} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#00965f]" />
                      <span>{course.duration || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      <span className="text-gray-700 font-medium">
                        {course.rating || "New"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCourseClick(course)}
                      className="bg-[#00965f] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#007a4d] transition-all duration-300 flex items-center gap-2 group"
                    >
                      View Course
                      <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        showModal={showModal}
        toggleModal={toggleModal}
        selectedCourse={selectedCourse}
        fromDemoClass={true}
        fromCategoryPage={true}
      />
    </div>
  );
};

export default CategoryPage;