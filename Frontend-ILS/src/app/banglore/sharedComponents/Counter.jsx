import { useState, useEffect } from "react";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const Counter = ({ end, duration = 2000, type }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        const nextCount = Math.min(
          Math.floor((progress / duration) * end),
          end
        );
        setCount(nextCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-400 px-4 py-2 hover:border-[#00965f] transition-colors duration-300">
      {type === "students" ? (
        <FaUserGraduate className="text-[#00965f] text-xl" />
      ) : (
        <FaChalkboardTeacher className="text-[#00965f] text-xl" />
      )}
      <div className="flex flex-col">
        <span className="font-bold text-[#00965f] text-lg">{count}+</span>
        <span className="text-xs text-gray-600">
          {type === "students" ? "Students" : "Trainers"}
        </span>
      </div>
    </div>
  );
};

export default Counter;
