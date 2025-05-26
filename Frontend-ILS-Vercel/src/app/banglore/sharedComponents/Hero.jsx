"use client";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FaGraduationCap,
  FaBook,
  FaRobot,
  FaGlobe,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

// Motivational messages for the speech bubble
const messages = [
  "Ready to learn? 🚀",
  "AI makes learning fun! 🤖",
  "Unlock your potential! 🔓",
  "Every day is a new lesson! 📚",
  "Dream big, learn bigger! 🌟",
];

// Course data
const courses = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description: "Learn the fundamentals of AI and ML with hands-on projects",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1470&auto=format&fit=crop",
    category: "Technology",
  },
  {
    id: 2,
    title: "Web Development",
    description: "Master modern web development with React and Next.js",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1470&auto=format&fit=crop",
    category: "Programming",
  },
  {
    id: 3,
    title: "Digital Marketing",
    description:
      "Learn to create and execute successful digital marketing campaigns",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
    category: "Marketing",
  },
  {
    id: 4,
    title: "Data Science",
    description: "Master data analysis and visualization techniques",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
    category: "Technology",
  },
  {
    id: 5,
    title: "UX/UI Design",
    description: "Create beautiful and functional user interfaces",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1464&auto=format&fit=crop",
    category: "Design",
  },
];

// Course Carousel Modal Component
/* Commented out 360° Course Carousel for future use
function CourseCarousel({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [radius, setRadius] = useState(300);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Update radius based on window width
  useEffect(() => {
    const updateRadius = () => {
      setRadius(window.innerWidth < 640 ? 150 : 300);
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  const handleMouseDown = (e) => {
    if (hoveredIndex !== null) return; // Don't start dragging if hovering over a card
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || hoveredIndex !== null) return;
    const diff = (e.pageX - startX) * 0.5;
    setRotateY((prev) => prev + diff);
    setStartX(e.pageX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to nearest card
    const cardAngle = 360 / courses.length;
    const targetRotation = Math.round(rotateY / cardAngle) * cardAngle;
    setRotateY(targetRotation);
    setCurrentIndex(Math.round((-targetRotation / 360) * courses.length) % courses.length);
  };

  const nextSlide = () => {
    const newRotation = rotateY - (360 / courses.length);
    setRotateY(newRotation);
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  const prevSlide = () => {
    const newRotation = rotateY + (360 / courses.length);
    setRotateY(newRotation);
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  // Calculate if a card is front-facing
  const isFrontFacing = (angle) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    return normalizedAngle > 270 || normalizedAngle < 90;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-[#164758] via-[#00965f] to-[#e0f7fa] z-50 flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#00965f]/10 backdrop-blur-sm" />
      
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] text-white/90 hover:text-white"
      >
        <FaTimes size={24} />
      </button>

      <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl font-bold text-white text-center z-[60]">
        360° Course View
      </h2>

      <div 
        className="relative w-full h-[500px] max-w-5xl mx-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setHoveredIndex(null);
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative w-[150px] h-[150px] transform-style-3d"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-300"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${rotateY}deg)`,
                transition: isDragging ? "none" : "transform 0.5s ease-out"
              }}
            >
              {courses.map((course, index) => {
                const angle = (index * 360) / courses.length;
                const isActive = isFrontFacing(angle - rotateY);

                return (
                  <motion.div
                    key={course.id}
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                      window.innerWidth < 640 ? 'w-[160px] h-[240px]' : 'w-[220px] h-[300px]'
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `
                        rotateY(${angle}deg) 
                        translateZ(${radius}px)
                        scale(${hoveredIndex === index ? 1.1 : 1})
                      `,
                      zIndex: hoveredIndex === index ? 50 : isActive ? 1 : 0,
                      pointerEvents: isActive ? 'auto' : 'none',
                      transition: 'transform 0.3s ease-out, scale 0.3s ease-out'
                    }}
                    onMouseEnter={() => isActive && setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div 
                      className={`relative w-full h-full bg-white rounded-lg overflow-hidden transform-style-3d transition-all duration-300 ${
                        hoveredIndex === index 
                          ? 'shadow-[0_0_25px_rgba(0,150,95,0.5)]'
                          : 'shadow-[0_0_12px_rgba(0,0,0,0.5)]'
                      }`}
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-90'
                      }`}>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <span className="text-xs font-semibold text-[#e0f7fa] mb-1 block">
                            {course.category}
                          </span>
                          <h3 className="text-base font-bold mb-1">{course.title}</h3>
                          <p className="text-gray-200 mb-3 text-xs line-clamp-2">
                            {course.description}
                          </p>
                          <button 
                            className={`bg-[#00965f] text-white px-4 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                              hoveredIndex === index 
                                ? 'bg-[#164758] transform scale-105' 
                                : 'hover:bg-[#164758]'
                            }`}
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#164758]/20 text-white p-3 rounded-full hover:bg-[#164758]/40 transition-colors z-[60]"
        >
          <FaArrowLeft size={16} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#164758]/20 text-white p-3 rounded-full hover:bg-[#164758]/40 transition-colors z-[60]"
        >
          <FaArrowRight size={16} />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-[60]">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const newRotation = -(index * (360 / courses.length));
                setRotateY(newRotation);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? "bg-[#00965f]" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 640px) {
          .perspective-1000 {
            perspective: 600px;
          }
        }
      `}</style>
    </motion.div>
  );
}
*/

// Modern AI/Robot Mascot SVG with Graduation Cap, interactive
function RobotMascot({ hovered, onClick, capTilt, svgSize, bubbleClass }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Rotate through messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#164758] px-4 py-2 rounded-2xl shadow-lg border border-[#00965f] cursor-pointer select-none text-sm font-semibold z-10 ${bubbleClass}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {messages[currentMessageIndex]}
        <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white border-l border-b border-[#00965f] rotate-45"></span>
      </motion.div>
      <motion.svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ y: 0 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="drop-shadow-2xl"
      >
        {/* Body */}
        <ellipse cx="130" cy="170" rx="60" ry="70" fill="#e0f7fa" />
        {/* Head */}
        <ellipse
          cx="130"
          cy="100"
          rx="55"
          ry="50"
          fill="#fff"
          stroke="#00965f"
          strokeWidth="4"
        />
        {/* Eyes */}
        <motion.ellipse
          cx="110"
          cy="100"
          rx="8"
          ry="12"
          fill={hovered ? "#ffe082" : "#00965f"}
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
          style={{ filter: hovered ? "drop-shadow(0 0 8px #ffe082)" : "none" }}
        />
        <motion.ellipse
          cx="150"
          cy="100"
          rx="8"
          ry="12"
          fill={hovered ? "#ffe082" : "#00965f"}
          style={{ filter: hovered ? "drop-shadow(0 0 8px #ffe082)" : "none" }}
        />
        {/* Smile */}
        <path
          d="M115 120 Q130 135 145 120"
          stroke="#00965f"
          strokeWidth="4"
          fill="none"
        />
        {/* Antenna */}
        <rect x="125" y="45" width="10" height="25" rx="5" fill="#00965f" />
        <circle
          cx="130"
          cy="40"
          r="8"
          fill="#ffe082"
          stroke="#00965f"
          strokeWidth="3"
        />
        {/* Graduation Cap */}
        <motion.g animate={{ rotate: capTilt ? -18 : 0 }} origin="130 64">
          {/* Cap Top */}
          <rect
            x="95"
            y="55"
            width="70"
            height="18"
            rx="3"
            fill="#22223b"
            transform="rotate(-10 130 64)"
          />
          {/* Cap Base */}
          <rect x="120" y="70" width="20" height="10" rx="2" fill="#00965f" />
          {/* Tassel String */}
          <rect x="158" y="65" width="3" height="18" rx="1.5" fill="#ffe082" />
          {/* Tassel Ball */}
          <circle cx="159.5" cy="85" r="4" fill="#ffe082" />
        </motion.g>
        {/* Left Arm (waving) */}
        <motion.rect
          x="45"
          y="150"
          width="18"
          height="60"
          rx="9"
          fill="#00965f"
          initial={{ rotate: -20, originX: 54, originY: 150 }}
          animate={{ rotate: hovered ? [-20, -70, -20] : [-20, -40, -20] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        {/* Right Arm */}
        <rect x="197" y="150" width="18" height="60" rx="9" fill="#00965f" />
        {/* Legs */}
        <rect x="105" y="230" width="14" height="30" rx="7" fill="#00965f" />
        <rect x="141" y="230" width="14" height="30" rx="7" fill="#00965f" />
      </motion.svg>
    </motion.div>
  );
}

// Typewriter effect for subtext
function Typewriter({ text, speed = 40 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayedText}</span>;
}

export default function HeroSlider() {
  const [robotHovered, setRobotHovered] = useState(false);
  const [capTilt, setCapTilt] = useState(false);
  // const [isCarouselOpen, setIsCarouselOpen] = useState(false); // Commented out carousel state
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;
    setParallax({ x, y });
  };

  const handleRobotClick = () => {
    // setIsCarouselOpen(true); // Commented out carousel opening
    console.log("Robot clicked - carousel feature coming soon!");
  };

  return (
    <>
      <section
        className="relative w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-items-normal bg-gradient-to-br from-[#164758] via-[#00965f] to-[#e0f7fa] overflow-hidden px-1 sm:px-2"
        onMouseMove={handleMouseMove}
      >
        {/* Floating icons with parallax */}
        <FaGraduationCap
          className="text-white/80 text-4xl md:text-5xl absolute top-16 left-10 animate-float-slow"
          style={{
            transform: `translate(${parallax.x * 20}px, ${parallax.y * 10}px)`,
          }}
        />
        <FaBook
          className="text-[#ffe082] text-3xl md:text-4xl absolute bottom-24 left-24 animate-float"
          style={{
            transform: `translate(${parallax.x * -15}px, ${parallax.y * 12}px)`,
          }}
        />
        <FaRobot
          className="text-[#164758] text-4xl md:text-5xl absolute top-24 right-24 animate-float"
          style={{
            transform: `translate(${parallax.x * 18}px, ${parallax.y * -10}px)`,
          }}
        />
        <FaGlobe
          className="text-[#00965f] text-3xl md:text-4xl absolute bottom-16 right-10 animate-float-slow"
          style={{
            transform: `translate(${parallax.x * -10}px, ${parallax.y * -8}px)`,
          }}
        />

        {/* Decorative blurred circles */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute w-96 h-96 bg-[#00965f] rounded-full blur-3xl top-0 left-0 opacity-40"></div>
          <div className="absolute w-80 h-80 bg-[#164758] rounded-full blur-2xl bottom-0 right-0 opacity-30"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-4xl py-6 md:py-8 gap-2 md:gap-4">
          {/* Left: Text */}
          <motion.div
            className="flex-1 min-w-[70vw] pl-1 md:pl-2"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl pl-8 sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2 sm:mb-3 max-w-[700px] leading-tight">
              Empowering <span className="text-[#ffe082]">Global Learners</span>{" "}
              <br />
              with <span className="text-[#00965f]">AI</span> &{" "}
              <span className="text-[#ffe082]">3D</span> Education
            </h1>
            <p className="text-xs pl-8 sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 min-h-[20px] sm:min-h-[28px] w-full sm:w-[450px] md:w-[600px] lg:w-[700px] md:whitespace-nowrap">
              <Typewriter
                text="Turn knowledge into career success with interactive, modern, and immersive online courses."
                speed={30}
              />
            </p>
          </motion.div>

          {/* Right: Robot Mascot */}
          <motion.div
            className="flex-1 flex items-center justify-center md:justify-end w-full pr-1 md:pr-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="w-[220px] h-[220px] bg-white/10 rounded-2xl shadow-2xl flex items-center justify-center"
              onMouseEnter={() => {
                setRobotHovered(true);
                setCapTilt(true);
              }}
              onMouseLeave={() => {
                setRobotHovered(false);
                setCapTilt(false);
              }}
            >
              <RobotMascot
                hovered={robotHovered}
                onClick={handleRobotClick}
                capTilt={capTilt}
                svgSize={200}
                bubbleClass="text-xs px-1.5 py-0.5 rounded"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Carousel Modal - Commented out */}
      {/* <CourseCarousel 
        isOpen={isCarouselOpen} 
        onClose={() => setIsCarouselOpen(false)} 
      /> */}

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
