"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden shadow-lg">
      <div className="absolute top-1/4 left-10 z-10 text-white">
        <h1 className="text-4xl font-bold">
          Welcome to Our E-Learning Platform
        </h1>
        <p className="mt-4 text-lg">
          Learn, Grow, and Succeed with our interactive courses
        </p>
        <button className="mt-6 bg-[#00965f] text-white py-3 px-6 rounded-lg text-lg hover:opacity-90">
          Enroll Now
        </button>
      </div>
      <motion.div
        className="flex"
        initial={{ x: 0 }}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-[500px] object-cover shrink-0"
          />
        ))}
      </motion.div>

      <button
        onClick={prevSlide}
        className="absolute top-2/3 left-4 transform -translate-y-1/2 bg-white p-5 rounded-full shadow-md hover:bg-gray-200 opacity-30"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-2/3 right-4 transform -translate-y-1/2 bg-white p-5 rounded-full shadow-md hover:bg-gray-200 opacity-30"
      >
        &#8594;
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
