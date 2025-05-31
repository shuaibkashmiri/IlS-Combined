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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#00965f] to-[#164758] py-12 mb-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Category Image */}
            {categoryDetails && (
              <div className="w-full md:w-1/3">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={categoryDetails.image}
                    alt={categoryName}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
            )}

            {/* Category Info */}
            <div className="w-full md:w-2/3 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide uppercase">
                  {categoryName} Courses
                </h1>
                <p className="text-base text-white/90 mb-6">
                  {categoryDetails?.description}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-white flex items-center gap-2 border border-white/20">
                    <FaUsers className="text-white/80 text-sm" />
                    <span className="text-sm font-medium">
                      {categoryCourses.length} Courses
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-white flex items-center gap-2 border border-white/20">
                    <FaChartLine className="text-white/80 text-sm" />
                    <span className="text-sm font-medium">Career Growth</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Course Cards Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#164758] uppercase tracking-wide">
              Available Courses
            </h2>
            <div className="flex flex-wrap gap-3">
              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-xs shadow-sm uppercase tracking-wide">
                <option value="">Price Range</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000+">₹5,000+</option>
              </select>

              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-xs shadow-sm uppercase tracking-wide">
                <option value="">Duration</option>
                <option value="0-5">0-5 hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10+">10+ hours</option>
              </select>

              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-xs shadow-sm uppercase tracking-wide">
                <option value="">Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00965f] focus:border-transparent text-xs shadow-sm uppercase tracking-wide">
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
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                <div className="bg-[#00965f]/10 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FaGraduationCap className="text-5xl text-[#00965f]" />
                </div>
                <h3 className="text-2xl font-bold text-[#164758] mb-3 uppercase tracking-wide">
                  No Courses Found
                </h3>
                <p className="text-gray-600">
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
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
            >
              {categoryCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white rounded-md shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md border border-gray-100"
                >
                  {/* Course Image Section */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Price Tag */}
                    {course.price && (
                      <div className="absolute top-1.5 right-1.5 bg-[#00965f] text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wide z-10">
                        ₹{course.price.$numberDecimal}
                      </div>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 shadow-sm">
                      <FaStar className="text-yellow-400 text-[10px]" />
                      <span>{course.rating || "New"}</span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-2">
                    {/* Title and Description */}
                    <div className="mb-2">
                      <h3 className="text-xs font-bold text-[#164758] mb-1 uppercase tracking-wide group-hover:text-[#00965f] transition-colors duration-300">
                        {course.title}
                      </h3>
                      <p className="text-[10px] text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <div className="bg-gray-50 rounded px-1 py-0.5 flex items-center gap-1">
                        <div className="bg-[#00965f]/10 p-0.5 rounded">
                          <FaUsers className="text-[#00965f] text-[10px]" />
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-wide">
                            Students
                          </p>
                          <p className="text-[10px] font-semibold text-gray-800">
                            {typeof course.enrolledStudents === "number"
                              ? course.enrolledStudents
                              : course.enrolledStudents?.length || 0}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded px-1 py-0.5 flex items-center gap-1">
                        <div className="bg-[#00965f]/10 p-0.5 rounded">
                          <FaClock className="text-[#00965f] text-[10px]" />
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-wide">
                            Duration
                          </p>
                          <p className="text-[10px] font-semibold text-gray-800">
                            {course.duration || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleCourseClick(course)}
                      className="w-full bg-[#00965f] text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-[#007a4d] transition-all duration-300 flex items-center justify-center gap-1 group-hover:gap-1.5 shadow-sm hover:shadow-md uppercase tracking-wide"
                    >
                      View Course
                      <FaArrowRight className="transform group-hover:translate-x-0.5 transition-transform duration-300 text-[10px]" />
                    </button>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#00965f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
      <div className="mt-16 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <UserReviews />
        </div>
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
