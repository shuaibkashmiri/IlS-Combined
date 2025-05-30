"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import {
  FaStar,
  FaUsers,
  FaClock,
  FaBriefcase,
  FaChartLine,
  FaGraduationCap,
  FaArrowRight,
} from "react-icons/fa";

import {
  getAllCourses,
  getSingleCourse,
} from "../../../redux/features/courseSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthModal from "../sharedComponents/authModal";
import { motion } from "framer-motion";
import categoryData from "./category.json";
import UserReviews from "../sharedComponents/UserReviews";

const CategoryPageContent = () => {
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

      // Defensive check for categories array
      const categories = Array.isArray(categoryData?.categories)
        ? categoryData.categories
        : [];

      // Filter courses based on category
      const filteredCourses = courses.filter(
        (course) =>
          course.category.toLowerCase() === decodedCategory.toLowerCase()
      );
      setCategoryCourses(filteredCourses);

      // Find category details from category.json
      const categoryObj = categories.find(
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
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00965f]"></div>
          <p className="text-gray-600 font-medium">
            Loading amazing courses...
          </p>
        </div>
      </div>
    );
  }

  const categoryName = searchParams.get("category")
    ? decodeURIComponent(searchParams.get("category"))
    : "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-8 pb-0">
      <div className="container mx-auto px-4">
        {/* Hero Section with Parallax Effect */}

        {/* Category Details Card with Glass Effect */}
        {categoryDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6 transform hover:scale-[1.02] transition-all duration-300 border border-white/20">
              <div className="flex-shrink-0 relative group">
                <img
                  src={categoryDetails.image}
                  alt={categoryName}
                  className="w-full md:w-64 h-40 object-cover rounded-xl shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  {categoryDetails.description}
                </p>
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#00965f]/10 p-2 rounded-lg">
                      <FaBriefcase className="text-[#00965f] text-xl" />
                    </div>
                    <h4 className="text-lg font-semibold text-[#164758]">
                      Career Paths
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(categoryDetails?.job_roles) &&
                      categoryDetails.job_roles.map((role, index) => (
                        <span
                          key={index}
                          className="bg-[#00965f]/10 text-[#00965f] px-3 py-1.5 rounded-full text-sm font-medium hover:bg-[#00965f]/20 transition-colors duration-300"
                        >
                          {role}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Cards Section with Enhanced Design */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#164758]">
              Available Courses
            </h2>
            <div className="flex flex-wrap gap-3">
              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-sm">
                <option value="">Price Range</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000+">₹5,000+</option>
              </select>

              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-sm">
                <option value="">Duration</option>
                <option value="0-5">0-5 hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10+">10+ hours</option>
              </select>

              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-sm">
                <option value="">Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-sm">
                <option value="">Sort By</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {categoryCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20">
                <div className="bg-[#00965f]/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FaGraduationCap className="text-6xl text-[#00965f]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#164758] mb-4">
                  No Courses Found
                </h3>
                <p className="text-gray-600 text-lg">
                  We couldn't find any courses in this category yet. Check back
                  soon for new additions!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {categoryCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/80 h-half backdrop-blur-lg rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 max-w-[280px] mx-auto w-full mb-4"
                >
                  <div className="relative group h-1/2">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {course.price && (
                      <div className="absolute top-1.5 right-1.5 bg-[#00965f] text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300">
                        ₹{course.price.$numberDecimal}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[#164758] mb-1 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <div className="bg-[#00965f]/10 p-0.5 rounded">
                          <FaUsers className="text-[#00965f] text-xs" />
                        </div>
                        <span className="font-medium">
                          {course.enrolledStudents || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="bg-[#00965f]/10 p-0.5 rounded">
                          <FaClock className="text-[#00965f] text-xs" />
                        </div>
                        <span className="font-medium">
                          {course.duration || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="bg-yellow-100 p-0.5 rounded">
                          <FaStar className="text-yellow-400 text-xs" />
                        </div>
                        <span className="text-gray-700 font-medium text-xs">
                          {course.rating || "New"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCourseClick(course)}
                        className="bg-[#00965f] text-white px-3 py-1 rounded-md font-semibold hover:bg-[#007a4d] transition-all duration-300 flex items-center gap-1 group shadow-sm hover:shadow-md text-xs"
                      >
                        View
                        <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        showModal={showModal}
        toggleModal={toggleModal}
        selectedCourse={selectedCourse}
        fromDemoClass={true}
        fromCategoryPage={true}
      />

      {/* User Reviews Section */}
      <div className="mt-16">
        <UserReviews />
      </div>
    </div>
  );
};

const CategoryPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00965f]"></div>
            <p className="text-gray-600 font-medium">
              Loading amazing courses...
            </p>
          </div>
        </div>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
};

export default CategoryPage;
