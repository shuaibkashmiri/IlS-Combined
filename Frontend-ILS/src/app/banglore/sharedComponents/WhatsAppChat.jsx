import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppChat = () => {
  const phoneNumber = "919086441234"; // Format: country code + number without +
  const message = "Hello! I'm interested in learning more about your courses.";

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-[#25D366] p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-white text-2xl sm:text-3xl" />
      <span className="absolute right-full mr-3 bg-white px-2 py-1 rounded-lg text-sm font-medium text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </button>
  );
};

export default WhatsAppChat;
