import React from "react";
import imageOne from "/src/assets/hero.jpg";
import imageTwo from "/src/assets/image1.jpg";
import imageThree from "/src/assets/image3.jpg";
import { FaGraduationCap, FaUserTie, FaClock } from "react-icons/fa";

export const metadata = {
  title: "About Us - ILS Learning",
  description: "Learn more about ILS Learning and our mission to provide quality education",
  keywords: "about us, mission, vision, education, training"
};

const AboutUs = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#164758] to-[#00965f] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Transforming Education Through Innovation
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                Empowering students with quality education and cutting-edge
                learning technologies
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Our Story Section */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative">
                <img
                  src={imageOne}
                  alt="About ILS"
                  className="rounded-lg shadow-lg w-full h-[300px] object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-[#00965f] text-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-2xl font-bold">10+</p>
                  <p className="text-sm">Years of Excellence</p>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Our Story</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Founded with a vision to transform online education, our
                  e-learning platform brings together the best of technology and
                  pedagogy. We are committed to making quality education
                  accessible to everyone, anywhere, anytime.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#00965f]">500+</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#00965f]">30+</p>
                    <p className="text-xs text-gray-600">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#00965f]">15+</p>
                    <p className="text-xs text-gray-600">Instructors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-[#00965f]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FaGraduationCap className="text-[#00965f] text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Interactive Learning
                </h3>
                <p className="text-sm text-gray-600">
                  Engaging content and interactive exercises that make learning
                  enjoyable and effective.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-[#00965f]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FaUserTie className="text-[#00965f] text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Expert Instruction
                </h3>
                <p className="text-sm text-gray-600">
                  Learn from industry professionals and certified educators who
                  are passionate about teaching.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="bg-[#00965f]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FaClock className="text-[#00965f] text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Flexible Learning
                </h3>
                <p className="text-sm text-gray-600">
                  Study at your own pace with 24/7 access to courses and
                  learning materials.
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Our Team
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Educational Experts",
                    description:
                      "Our team consists of experienced educators and instructional designers.",
                    image: imageTwo,
                  },
                  {
                    title: "Technical Support",
                    description:
                      "24/7 platform support and continuous improvements to our learning tools.",
                    image: imageThree,
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={member.image}
                      alt={member.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-semibold text-lg">
                        {member.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {member.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-[#164758] to-[#00965f] rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-white/80 text-sm mb-6">
                Join our community of learners and take the first step towards
                your goals.
              </p>
              <button className="bg-white text-[#00965f] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
