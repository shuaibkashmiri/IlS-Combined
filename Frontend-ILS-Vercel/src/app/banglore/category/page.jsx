"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getAllCourses } from "../../../redux/features/courseSlice";
import Link from "next/link";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const [categoryCourses, setCategoryCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses) {
      const category = searchParams.get("category");
      if (!category) {
        setCategoryCourses([]);
        setLoading(false);
        return;
      }

      const decodedCategory = decodeURIComponent(category);
      const filteredCourses = courses.filter(
        (course) =>
          course.category.toLowerCase() === decodedCategory.toLowerCase()
      );
      setCategoryCourses(filteredCourses);
      setLoading(false);
    }
  }, [courses, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00965f]"></div>
      </div>
    );
  }

  const categoryName = searchParams.get("category")
    ? decodeURIComponent(searchParams.get("category"))
    : "All";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {categoryName} Courses
        </h1>

        {categoryCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No courses found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  {course.price && (
                    <div className="absolute top-4 right-4 bg-[#00965f] text-white px-3 py-1 rounded-full text-sm font-medium">
                      ₹{course.price.$numberDecimal}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{course.enrolledStudents || 0} students</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{course.duration || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-gray-700">
                        {course.rating || "New"}
                      </span>
                    </div>
                    <Link
                      href={`/banglore/courses/${course._id}`}
                      className="bg-[#00965f] text-white px-4 py-2 rounded-md hover:bg-[#007a4d] transition-colors duration-300"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
