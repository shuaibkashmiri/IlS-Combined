import React from "react";

const AboutUs = () => {
  return (
    <section
      id="about"
      className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen"
    >
      <div className="container mx-auto px-4 sm:px-8">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 leading-tight">
              About <span className="text-green-600">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-xl">
              Founded with a vision to transform online education, our
              e-learning platform brings together the best of technology and
              pedagogy. We're committed to making quality education accessible
              to everyone, anywhere, anytime.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-2 md:p-4 w-72 h-72 flex items-center justify-center border-4 border-green-100">
              <img
                src="/image1.jpg"
                alt="ILS Education Center"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4 text-primary">
            Our Core Values
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            We believe in empowering learners through engaging content, expert
            guidance, and flexible access.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/hero.jpg",
                title: "Interactive Learning",
                description:
                  "Engaging content and interactive tools to enhance your learning experience.",
              },
              {
                image: "/image1.jpg",
                title: "Expert Instruction",
                description:
                  "Learn from experienced educators and industry professionals.",
              },
              {
                image: "/image2.jpg",
                title: "Flexible Learning",
                description:
                  "Study at your own pace with 24/7 access to course materials.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl border-t-4 border-green-400/60 p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-100 shadow mb-4 group-hover:border-green-400 transition-all duration-300">
                  <img
                    src={item.image}
                    alt={`${item.title} Icon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-green-700 group-hover:text-green-900 transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-8">
          <div className="max-w-3xl mb-18 mt-0 mx-auto">
            <h2 className="text-4xl font-bold text-primary text-center mb-2 mt-2">
              Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-6">
              Meet the passionate people behind our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {[
              {
                image: "/image3.jpg",
                title: "Educational Experts",
                description:
                  "Our team consists of experienced educators who create engaging and effective learning experiences.",
              },
              {
                image: "/image2.jpg",
                title: "Technical Support",
                description:
                  "Our dedicated technical team ensures a smooth learning experience with 24/7 support.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="relative bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 pt-16 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-green-200/60 hover:bg-white/90 group"
                style={{ minHeight: "340px" }}
              >
                {/* Profile Image Overlap */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-4 border-green-200 shadow-lg overflow-hidden bg-white">
                  <img
                    src={member.image}
                    alt={member.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-16 flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-2 text-green-700 text-center group-hover:text-green-900 transition-all duration-300">
                    {member.title}
                  </h3>
                  <p className="text-gray-600 text-center text-base mb-4">
                    {member.description}
                  </p>
                  {/* Social Icons Placeholder */}
                  <div className="flex gap-4 mt-2">
                    <a
                      href="#"
                      className="text-green-400 hover:text-green-600 transition"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-green-400 hover:text-green-600 transition"
                      aria-label="Instagram"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
