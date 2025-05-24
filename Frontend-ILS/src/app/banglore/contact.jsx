import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <div className="font-sans min-h-screen bg-gray-50">
        {/* Hero Section - Reduced padding and size */}
        <div className="bg-gradient-to-r from-[#164758] to-[#00965f] text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Get in Touch
              </h1>
              <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section - Adjusted spacing */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {/* Phone Card */}
              <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="bg-[#00965f]/10 p-2 rounded">
                    <FaPhone className="h-4 w-4 text-[#00965f]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      Call Us
                    </h3>
                    <p className="text-gray-600 text-xs">+(91) 8899229684</p>
                    <p className="text-gray-600 text-xs">+(91) 9086441234</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="bg-[#00965f]/10 p-2 rounded">
                    <FaEnvelope className="h-4 w-4 text-[#00965f]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      Email Us
                    </h3>
                    <p className="text-gray-600 text-xs">
                      student@ilssrinagar.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="bg-[#00965f]/10 p-2 rounded">
                    <FaMapMarkerAlt className="h-4 w-4 text-[#00965f]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      Visit Us
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Regal Lane, Srinagar
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-medium text-gray-900 text-sm mb-3">
                  Connect With Us
                </h3>
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="bg-[#00965f]/10 p-2 rounded hover:bg-[#00965f] group transition-colors"
                  >
                    <FaWhatsapp className="h-4 w-4 text-[#00965f] group-hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-[#00965f]/10 p-2 rounded hover:bg-[#00965f] group transition-colors"
                  >
                    <FaFacebook className="h-4 w-4 text-[#00965f] group-hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-[#00965f]/10 p-2 rounded hover:bg-[#00965f] group transition-colors"
                  >
                    <FaInstagram className="h-4 w-4 text-[#00965f] group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-1 focus:ring-[#00965f] focus:border-transparent transition-all outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-1 focus:ring-[#00965f] focus:border-transparent transition-all outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-1 focus:ring-[#00965f] focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-1 focus:ring-[#00965f] focus:border-transparent transition-all outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows="3"
                      className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:ring-1 focus:ring-[#00965f] focus:border-transparent transition-all outline-none resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00965f] text-white py-2 rounded text-sm font-medium hover:bg-[#164758] transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
