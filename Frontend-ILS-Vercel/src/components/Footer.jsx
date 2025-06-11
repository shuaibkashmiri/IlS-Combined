"use client";

import React from "react";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#164758] text-white p-12" id="contact">
      {/* Newsletter Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Still You Need Our <span className="text-[#00965f]">Support</span>?
        </h2>
        <p className="text-gray-400 mb-6">
          Don't wait — make a smart & logical quote here. It's pretty easy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Contact Information (Replaces About Us) */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#00965f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 6h20v12H2z" />
                <path d="M2 6l10 7 10-7" />
              </svg>
              <a
                href="mailto:student@ilssrinagar.com"
                className="hover:text-[#00965f]"
              >
                student@ilssrinagar.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#00965f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 17c0 2-4 4-8 4s-8-2-8-4V7c0-2 4-4 8-4s8 2 8 4v10z" />
                <path d="M8 7h8" />
              </svg>
              <a href="tel:+918899229684" className="hover:text-[#00965f]">
                (+91) 8899229684 / 9086441234
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#00965f]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
                <circle cx="12" cy="9" r="2" />
              </svg>
              <span>Regal Lane, Srinagar</span>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <button
                onClick={() => scrollToSection("aboutus")}
                className="hover:text-[#00965f]"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("corevalues")}
                className="hover:text-[#00965f]"
              >
                Core Values
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("ourteam")}
                className="hover:text-[#00965f]"
              >
                Our Team
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("footer")}
                className="hover:text-[#00965f]"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h3 className="text-xl font-bold mb-4">Course</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Ui Ux Design
              </a>
            </li>
            <li>
              <a
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Web Development
              </a>
            </li>
            <li>
              <a
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Business Strategy
              </a>
            </li>
            <li>
              <a
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Software Development
              </a>
            </li>
            <li>
              <a
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Business English
              </a>
            </li>
          </ul>
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Post</h3>
          <ul className="space-y-4 text-gray-400">
            <li>
              <p className="text-sm">02 Apr 2024</p>
              <a
                href="/banglore"
                className="font-bold text-white hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Best Your Business
              </a>
            </li>
            <li>
              <p className="text-sm">02 Apr 2024</p>
              <a
                href="/banglore"
                className="font-bold text-white hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Keep Your Business
              </a>
            </li>
            <li>
              <p className="text-sm">02 Apr 2024</p>
              <a
                href="/banglore"
                className="font-bold text-white hover:text-[#00965f]"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Nice Your Business
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
        <p>
          Copyright © {new Date().getFullYear()} by{" "}
          <span className="text-[#00965f] font-bold">ILS</span>. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
