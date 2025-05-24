"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllCourses } from "../../redux/features/courseSlice";
import Loading from "./Loading";
import Image from "next/image";

const PopularCourses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  return (
    <section className="py-8 sm:py-16 bg-white text-center">
      <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-[#164758]">
        Popular <span className="text-[#00965f]">Courses</span>
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 max-w-7xl mx-auto px-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse"
            >
              {/* Skeleton for image */}
              <div className="w-full h-40 sm:h-48 bg-gray-200" />
              <div className="p-2 sm:p-4">
                {/* Skeleton for price */}
                <div className="h-6 sm:h-8 w-16 sm:w-24 bg-gray-200 rounded mb-1 sm:mb-2 mx-auto" />
                {/* Skeleton for title */}
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2 sm:mb-4" />
                {/* Skeleton for buttons */}
                <div className="flex justify-center space-x-1 sm:space-x-2 my-2 sm:my-4">
                  <div className="h-8 sm:h-10 w-16 sm:w-24 bg-gray-200 rounded" />
                  <div className="h-8 sm:h-10 w-16 sm:w-24 bg-gray-200 rounded" />
                </div>
                {/* Skeleton for footer info */}
                <div className="flex justify-between items-center mt-2 sm:mt-4">
                  <div className="h-3 sm:h-4 w-12 sm:w-20 bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-12 sm:w-20 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 max-w-7xl mx-auto px-4">
          {courses.slice(0, visibleCount).map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              <div className="w-full h-40 sm:h-48">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="text-lg sm:text-2xl font-bold text-[#164758]">
                  ₹{course.price.$numberDecimal}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                  {course.title}
                </p>
                <div className="flex justify-center space-x-1 sm:space-x-2 my-2 sm:my-4">
                  <button className="bg-[#00965f] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm">
                    Read More
                  </button>
                  <button className="bg-[#164758] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm">
                    Join Now
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 flex justify-between items-center mt-2 sm:mt-4">
                  <span>⏳ {course.duration}h</span>
                  <span>👥 {course.enrolledStudents?.length || 5}</span>
                </div>
              </div>
            </div>
            
          ))}
        </div>
        {/* {visibleCount < courses.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleCount(visibleCount + 3)}
              className="border-2 border-[#00965f] text-[#00965f] px-6 py-2 text-lg font-semibold hover:border-[#007a4d] hover:text-[#007a4d] transition"
            >
              Click here to see more
            </button>
          </div>
        )} */}
        </>
      )}
    </section>
  );
};

export default PopularCourses;
