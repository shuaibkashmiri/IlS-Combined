import React, { useState, useEffect, useRef } from "react";
import {
  BsArrowRight,
  BsArrowLeft,
  BsClock,
  BsStars,
  BsPlayCircle,
  BsBookmark,
  BsBookmarkFill,
} from "react-icons/bs";

const cardWidth = 180;
const cardHeight = 220;
const radius = 320;
const autoRotateInterval = 3000;

export default function ThreeSixtyCarousel({ courses, onWatchDemo }) {
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState({});
  const numCards = courses.length;
  const autoRotateRef = useRef();

  useEffect(() => {
    if (!isHovered) {
      autoRotateRef.current = setInterval(() => {
        setAngle((prev) => prev - 360 / numCards);
        setActiveIndex((prev) => (prev + 1) % numCards);
      }, autoRotateInterval);
    }
    return () => clearInterval(autoRotateRef.current);
  }, [numCards, isHovered]);

  const rotate = (dir) => {
    // First update the active index
    setActiveIndex((prev) => {
      const newIndex = prev + dir;
      if (newIndex < 0) return numCards - 1;
      if (newIndex >= numCards) return 0;
      return newIndex;
    });

    // Then update the angle
    setAngle((prev) => prev + dir * (360 / numCards));

    clearInterval(autoRotateRef.current);
    if (!isHovered) {
      autoRotateRef.current = setInterval(() => {
        setAngle((prev) => prev - 360 / numCards);
        setActiveIndex((prev) => (prev + 1) % numCards);
      }, autoRotateInterval);
    }
  };

  const toggleBookmark = (courseId, e) => {
    e.stopPropagation();
    setBookmarked((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  return (
    <div
      className="relative flex flex-col items-center select-none mr-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative mx-auto"
        style={{
          width: cardWidth * 2.2,
          height: cardHeight * 1.3,
          perspective: 1500,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) rotateY(${angle}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 1s cubic-bezier(.77,0,.18,1)",
            width: "100%",
            height: "100%",
          }}
        >
          {courses.map((course, idx) => {
            const theta = (360 / numCards) * idx;
            const isActive = idx === activeIndex;
            const opacity = isActive ? 1 : 0.25;
            const scale = isActive ? 1.1 : 0.7;

            return (
              <div
                key={course.title}
                className="absolute flex flex-col items-center justify-center transition-all duration-300"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  left: `calc(50% - ${cardWidth / 2}px)`,
                  top: `calc(50% - ${cardHeight / 2}px)`,
                  transform: `rotateY(${theta}deg) translateZ(${radius}px) scale(${scale})`,
                  opacity,
                  transition:
                    "transform 1s cubic-bezier(.77,0,.18,1), opacity 0.3s ease",
                }}
              >
                <div className="w-full h-full relative group">
                  {/* Card Background */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-all duration-300 overflow-hidden"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, #0f172a, #1e293b)"
                        : "linear-gradient(135deg, #1e293b, #334155)",
                      boxShadow: isActive
                        ? "0 20px 40px rgba(0,0,0,0.2), 0 0 20px rgba(16,185,129,0.2)"
                        : "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        background: isActive
                          ? "radial-gradient(circle at top right, rgba(16,185,129,0.2), transparent 70%)"
                          : "radial-gradient(circle at top right, rgba(16,185,129,0.1), transparent 70%)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
                        <div className="h-1 w-4 bg-emerald-500/50 rounded-full"></div>
                      </div>
                      <button
                        onClick={(e) => toggleBookmark(course.id, e)}
                        className={`p-1 rounded-lg transition-all duration-300
                          ${
                            isActive
                              ? "text-emerald-500 hover:bg-emerald-500/10"
                              : "text-gray-400 hover:text-emerald-500"
                          }`}
                      >
                        {bookmarked[course.id] ? (
                          <BsBookmarkFill />
                        ) : (
                          <BsBookmark />
                        )}
                      </button>
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1">
                      <h3
                        className={`text-base font-bold mb-1 ${
                          isActive ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {course.title}
                      </h3>
                      <p
                        className={`text-xs mb-2 line-clamp-2 ${
                          isActive ? "text-gray-300" : "text-gray-400"
                        }`}
                      >
                        {course.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className={`flex flex-col items-center justify-center p-1.5 rounded-xl
                          ${
                            isActive
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-gray-700/50"
                          }`}
                        >
                          <BsClock
                            className={`text-base mb-0.5 ${
                              isActive ? "text-emerald-400" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-[10px] ${
                              isActive ? "text-emerald-400" : "text-gray-400"
                            }`}
                          >
                            {course.duration}
                          </span>
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center p-1.5 rounded-xl
                          ${
                            isActive
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-gray-700/50"
                          }`}
                        >
                          <BsStars
                            className={`text-base mb-0.5 ${
                              isActive ? "text-emerald-400" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-[10px] ${
                              isActive ? "text-emerald-400" : "text-gray-400"
                            }`}
                          >
                            {course.level}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`w-full py-1.5 rounded-xl text-xs font-medium transition-all duration-300
                          ${
                            isActive
                              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onWatchDemo(course);
                        }}
                      >
                        <span className="flex items-center justify-center gap-1">
                          <BsPlayCircle className="text-sm" />
                          Watch Demo
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg p-3 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:scale-110"
          style={{ marginLeft: -40 }}
          onClick={() => rotate(-1)}
        >
          <BsArrowLeft size={24} />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg p-3 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:scale-110"
          style={{ marginRight: -40 }}
          onClick={() => rotate(1)}
        >
          <BsArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
