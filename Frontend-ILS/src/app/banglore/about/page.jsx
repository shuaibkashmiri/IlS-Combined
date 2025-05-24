"use client";

import { FaGraduationCap, FaUsers, FaBook, FaChalkboardTeacher, FaRobot, FaLaptopCode, FaBrain } from "react-icons/fa";
import { motion } from "framer-motion";
import Head from 'next/head';
import Image from 'next/image';
import kid from "@/app/assets/kid.jpg"
import mission from "@/app/assets/mission.jpg"

const AboutUs = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ILS E-Learning",
    "description": "Empowering learners worldwide with quality education and innovative learning solutions",
    "url": "https://ils-elearning.com",
    "sameAs": [
      "https://facebook.com/ils-elearning",
      "https://twitter.com/ils-elearning",
      "https://linkedin.com/company/ils-elearning"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    }
  };

  return (
    <>
      <Head>
        <title>About ILS E-Learning - Pioneer in Skill Development</title>
        <meta name="description" content="ILS, a leader in Skills and Talent Development for 25 years, offers multi-disciplinary learning management and training delivery solutions." />
        <meta name="keywords" content="ILS E-Learning, skill development, corporate training, industrial training, robotics, data science, AI, STEM education" />
        <meta property="og:title" content="About ILS E-Learning - Pioneer in Skill Development" />
        <meta property="og:description" content="ILS, a leader in Skills and Talent Development for 25 years, offers multi-disciplinary learning management and training delivery solutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ils-elearning.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About ILS E-Learning" />
        <meta name="twitter:description" content="ILS, a leader in Skills and Talent Development for 25 years." />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-[#00965f] to-[#007a4d]" aria-label="Introduction">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div 
                  className="text-white"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Pioneer in Skill Development
                  </h1>
                  <p className="text-lg text-gray-100 mb-6">
                    Empowering learners with quality education and innovative solutions for 25 years
                  </p>
                  <motion.button 
                    className="px-6 py-2 bg-white text-[#00965f] rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative h-[300px] rounded-xl overflow-hidden"
                >
                  <Image
                    src={kid.src}
                    alt="Students learning online"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-gray-50" aria-label="Overview">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl font-bold text-[#00965f] mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed">
                  ILS, a leader in Skills and Talent Development, offers multi-disciplinary learning management and training delivery solutions to corporations, institutions, and individuals from last 25 years. It has become known, in particular, as a corporate training company and Industrial Training Company, with customized programs for both large and small enterprises.
                </p>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: FaRobot,
                    title: "Robotics & AI",
                    description: "Enterprise I.T automation and educational Robotics"
                  },
                  {
                    icon: FaLaptopCode,
                    title: "Digital Skills",
                    description: "Software engineering, Digital Marketing, and IT programs"
                  },
                  {
                    icon: FaBrain,
                    title: "Innovation",
                    description: "STEM, IoT & Artificial Intelligence education"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <feature.icon className="text-2xl text-[#00965f] mb-3" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-[#00965f] mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Stats Section */}
        <section className="py-16" aria-label="Mission and Impact">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative h-[300px] rounded-xl overflow-hidden"
                >
                  <Image
                    src={mission.src}
                    alt="Our mission"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-[#00965f] mb-6">Our Impact</h2>
                  <p className="text-gray-600 mb-8">
                    Interface technologies works closely with 2,00,000+ Students and Teachers daily to nurture innovation and creativity at K-12 level with unique custom-designed patented DIY kits, innovative pedagogy, and world-class content.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: FaUsers, number: "10K+", label: "Students" },
                      { icon: FaBook, number: "500+", label: "Courses" },
                      { icon: FaChalkboardTeacher, number: "100+", label: "Instructors" },
                      { icon: FaGraduationCap, number: "95%", label: "Success" }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <stat.icon className="text-xl text-[#00965f] mb-1" aria-hidden="true" />
                        <h3 className="text-xl font-bold text-[#00965f]">{stat.number}</h3>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutUs;
