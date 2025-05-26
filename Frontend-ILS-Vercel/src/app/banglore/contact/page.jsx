"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import Head from 'next/head';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Contact ILS E-Learning - Get in Touch</title>
        <meta name="description" content="Contact ILS E-Learning for inquiries about our courses, corporate training, or any other questions. We're here to help you with your learning journey." />
        <meta name="keywords" content="contact ILS, ILS E-Learning contact, get in touch, support, inquiry" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-[#00965f] to-[#007a4d]" aria-label="Contact Header">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h1>
                <p className="text-lg text-gray-100">
                  Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Information & Form Section */}
        <section className="py-16" aria-label="Contact Information">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-[#00965f] mb-6">Contact Information</h2>
                    <p className="text-gray-600 mb-8">
                      Feel free to reach out to us through any of the following channels. We're here to assist you with your learning journey.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        icon: FaPhone,
                        title: "Phone",
                        content: "+91 1234567890",
                        link: "tel:+911234567890"
                      },
                      {
                        icon: FaEnvelope,
                        title: "Email",
                        content: "info@ils-elearning.com",
                        link: "mailto:info@ils-elearning.com"
                      },
                      {
                        icon: FaMapMarkerAlt,
                        title: "Address",
                        content: "123 Education Street, Bangalore, Karnataka, India",
                        link: "https://maps.google.com"
                      },
                      {
                        icon: FaClock,
                        title: "Working Hours",
                        content: "Monday - Friday: 9:00 AM - 6:00 PM",
                        link: null
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-[#00965f]/10 rounded-full flex items-center justify-center">
                          <item.icon className="text-xl text-[#00965f]" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                          {item.link ? (
                            <a
                              href={item.link}
                              className="text-gray-600 hover:text-[#00965f] transition-colors"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-gray-600">{item.content}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-[#00965f] mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00965f] focus:border-transparent"
                        required
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full bg-[#00965f] text-white py-3 rounded-lg font-semibold hover:bg-[#007a4d] transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-50" aria-label="Location Map">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.598130985754!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNCJF!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="ILS E-Learning Location"
                ></iframe>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactUs;
