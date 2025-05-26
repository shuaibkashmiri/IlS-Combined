import React from "react";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#164758] text-white p-12">
      {/* Newsletter Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Still You Need Our <span className="text-[#00965f]">Support</span>?
        </h2>
        <p className="text-gray-400 mb-6">
          Don't wait — make a smart & logical quote here. It's pretty easy.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email here"
            className="p-3 rounded-l-md w-80 text-black border border-[#00965f]"
          />
          <button className="bg-[#00965f] px-6 py-3 rounded-r-md text-white">
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">About us</h3>
          <p className="text-gray-400 text-sm">
            Corporate clients and leisure travelers have been relying on us for
            dependable, safe, and professional service in major cities across
            the world.
          </p>
          <div className="mt-4">
            <p className="text-[#00965f] font-bold">OPENING HOURS</p>
            <p className="text-gray-400 text-sm">Mon - Sat (8:00 - 6:00)</p>
            <p className="text-gray-400 text-sm">Sunday - Closed</p>
          </div>
        </div>

        {/* Useful Links  */}
        <div>
          <h3 className="text-xl font-bold mb-4">Useful Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link
                href="/banglore/aboutus"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/banglore/userreviews"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                User Reviews
              </Link>
            </li>
            <li>
              <a
                href="mailto:support@example.com"
                className="hover:text-[#00965f]"
              >
                Email
              </a>
            </li>
            <li>
              <Link
                href="/banglore/contact"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* //Courses  */}
        <div>
          <h3 className="text-xl font-bold mb-4">Course</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Ui Ux Design
              </Link>
            </li>
            <li>
              <Link
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Web Development
              </Link>
            </li>
            <li>
              <Link
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Business Strategy
              </Link>
            </li>
            <li>
              <Link
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Software Development
              </Link>
            </li>
            <li>
              <Link
                href="/banglore"
                className="hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Business English
              </Link>
            </li>
          </ul>
        </div>

        {/* Recent Posts */}

        <div>
          <h3 className="text-xl font-bold mb-4">Recent Post</h3>
          <ul className="space-y-4 text-gray-400">
            <li>
              <p className="text-sm">02 Apr 2024</p>
              <Link
                href="/banglore"
                className="font-bold text-white hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Best Your Business
              </Link>
            </li>
            <li>
              <p className="text-sm">02 Apr 2024</p>
              <Link
                href="/banglore"
                className="font-bold text-white hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Keep Your Business
              </Link>
            </li>
            <li>
              <p className="text-sm">02 Apr 2024</p>
              <Link
                href="/banglore"
                className="font-bold text-white hover:text-[#00965f]"
                onClick={scrollToTop}
              >
                Nice Your Business
              </Link>
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
