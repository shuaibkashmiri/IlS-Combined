import React from "react";


const HorizontalRule = ({ width = "w-full", className = "" }) => {
  return (
    <div className={`flex items-center justify-center mb-0.5 ${className}`}>
      <div className={`flex items-center ${width}`}>
        {/* Left line */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-gray-300">
         
        </div>

        {/* Center dot */}
        <div className="flex-shrink-0 mx-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary transform rotate-45"></div>
        </div>

        {/* Right line */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-gray-300 via-gray-200 to-transparent"></div>
      </div>
    </div>
  );
};

// Variant with multiple dots
export const HorizontalRuleWithDots = ({
  width = "w-full",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center mb-0.5 ${className}`}>
      <div className={`flex items-center ${width}`}>
        {/* Left line */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-gray-300"></div>

        {/* Dots */}
        <div className="flex-shrink-0 mx-3 flex items-center space-x-1.5">
          <div className="w-1 h-1 rounded-full bg-primary opacity-40"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <div className="w-1 h-1 rounded-full bg-primary opacity-40"></div>
        </div>

        {/* Right line */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-gray-300 via-gray-200 to-transparent"></div>
      </div>
    </div>
  );
};

// Variant with text
export const HorizontalRuleWithText = ({
  text,
  width = "w-full",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center mb-0.5 ${className}`}>
      <div className={`flex items-center ${width}`}>
        {/* Left line */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-gray-300"></div>

        {/* Center text */}
        <div className="flex-shrink-0 mx-3 px-3 py-0.5 bg-white">
          <span className="text-xs font-medium text-gray-500">{text}</span>
        </div>

        {/* Right line */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-gray-300 via-gray-200 to-transparent"></div>
      </div>
    </div>
  );
};

export default HorizontalRule;
