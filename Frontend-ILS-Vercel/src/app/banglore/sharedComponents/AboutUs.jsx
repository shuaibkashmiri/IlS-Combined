import React from "react";
import imageOne from "../../assets/image1.jpg";
import imageTwo from "../../assets/image2.jpg";
import imageThree from "../../assets/image3.png";
import valueOne from "../../assets/hero.jpg";
import valueTwo from "../../assets/image1.jpg";
import valueThree from "../../assets/image2.jpg";

const AboutUs = () => {
  return (
    <section id="about" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-primary">About Us</h1>
          <div className="grid gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">Our Story</h2>
                <p className="text-gray-700 leading-relaxed">
                  Founded with a vision to transform online education, our e-learning platform
                  brings together the best of technology and pedagogy. We're committed to making
                  quality education accessible to everyone, anywhere, anytime.
                </p>
              </div>
              <img
                src={imageOne}
                alt="ILS Education Center"
                className="w-full md:w-72 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Core Values Section */}
<div className="text-center mt-12">
  <h2 className="text-3xl font-semibold mb-6 text-secondary">Our Core Values</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      { image: valueOne, title: "Interactive Learning" },
      { image: valueTwo, title: "Expert Instruction" },
      { image: valueThree, title: "Flexible Learning" },
    ].map((item, index) => (
      <div
        key={index}
        className="bg-white relative group overflow-hidden rounded-lg shadow-md border border-gray-200 p-6 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={`${item.title} Icon`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-gray-400">?</span> // Fallback placeholder with gray color
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#164758]">{item.title}</h3>
        <p className="text-sm text-[#164758] text-center max-w-xs">
          Engaging content, expert guidance, and flexible access to empower learners everywhere.
        </p>
      </div>
    ))}
  </div>
</div>

            
            {/* Team Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-semibold mb-6 text-secondary text-center">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { image: imageThree, title: "Educational Experts", description: "Our team consists of experienced educators who create engaging and effective learning experiences." },
                  { image: imageTwo, title: "Technical Support", description: "Our dedicated technical team ensures a smooth learning experience with 24/7 support." },
                ].map((member, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                    <img
                      src={member.image}
                      alt={member.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-primary">{member.title}</h3>
                    <p className="text-gray-700 text-sm">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;