// Testimonials.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import "aos/dist/aos.css";

// Custom Arrow Components for Slider
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-[#00965f] hover:bg-[#164758] rounded-full p-2 z-10`}
      style={{ ...style, display: "block", right: "10px" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-[#00965f] hover:bg-[#164758] rounded-full p-2 z-10`}
      style={{ ...style, display: "block", left: "10px" }}
      onClick={onClick}
    />
  );
};

const initialTestimonials = [
  {
    name: "Sarah Johnson",
    role: "Student",
    quote:
      "This platform transformed my learning experience. The courses are engaging and the instructors are top-notch!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Professional",
    quote:
      "I upskilled my career in just 3 months. The practical approach is unmatched!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Entrepreneur",
    quote:
      "The flexibility and quality of content helped me grow my business knowledge.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 4,
  },
  {
    name: "David Lee",
    role: "Developer",
    quote:
      "The coding courses are excellent. I built my first app thanks to this platform!",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 5,
  },
  {
    name: "Lisa Patel",
    role: "Marketing Specialist",
    quote:
      "The marketing modules are insightful and practical. Highly recommend!",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 4,
  },
  {
    name: "James Carter",
    role: "Data Analyst",
    quote:
      "The data science course was a game-changer for my career progression.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 5,
  },
  {
    name: "Aisha Khan",
    role: "Designer",
    quote:
      "The design tutorials are creative and well-structured. Loved every minute!",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 4,
  },
  {
    name: "Robert Kim",
    role: "Business Owner",
    quote:
      "This platform helped me understand finance better to grow my business.",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem("testimonials");
    return saved ? JSON.parse(saved) : initialTestimonials;
  });
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
    image: "https://randomuser.me/api/portraits/lego/1.jpg", // Placeholder image for user-submitted testimonials
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const openVideoModal = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideoUrl("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newTestimonial = {
      ...formData,
      videoUrl: null,
    };
    setTestimonials([...testimonials, newTestimonial]);
    setFormData({
      name: "",
      role: "",
      quote: "",
      rating: 5,
      image: "https://randomuser.me/api/portraits/lego/1.jpg",
    });
    alert("Thank you for your testimonial!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#164758]/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#164758] mb-4">
            What Our Learners Say
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how our e-learning platform has impacted lives and careers
          </p>
        </div>

        {/* Testimonials Slider */}
        <div
          className="relative bg-[#164758]/10 rounded-xl py-8 px-4 testimonials-section"
          data-aos="fade-up"
        >
          <div className="mb-4 text-right text-gray-600">
            {currentSlide + 1}/{testimonials.length}
          </div>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-2">
                <div className="relative bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#00965f] border-t-4 border-[#00965f]">
                  {/* Decorative Element */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#00965f] rounded-full opacity-20" />

                  {/* Rating Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-[#164758]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="sr-only">
                      {testimonial.rating} out of 5 stars
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 italic mb-6 leading-relaxed line-clamp-3">
                    "{testimonial.quote}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-[#00965f] transform transition-all duration-300 hover:scale-110"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#164758]">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <svg
                    className="absolute bottom-4 right-4 w-8 h-8 text-[#00965f] opacity-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.582.982-4.496 3.949-4.496 7.386v8.463h-5.483zM8.005 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.582.982-4.496 3.949-4.496 7.386v8.463h-5.5z" />
                  </svg>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-xl text-[#164758] mb-6">
            Ready to start your learning journey?
          </p>
          <button className="bg-gradient-to-r from-[#00965f] to-[#164758] text-white px-8 py-3 rounded-full font-semibold text-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto">
            Join Now
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Auto-Testimonial Section */}
        <div
          className="mt-16 max-w-3xl mx-auto bg-[#164758]/10 rounded-xl py-8 px-6"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-bold text-[#164758] text-center mb-6">
            Share Your Experience
          </h2>
          <p className="text-center text-gray-600 mb-8">
            We’d love to hear about your learning journey with ILS!
          </p>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00965f]"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-600 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00965f]"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="rating" className="block text-gray-600 mb-1">
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleFormChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00965f]"
                required
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="quote" className="block text-gray-600 mb-1">
                Your Feedback
              </label>
              <textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleFormChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00965f] resize-none h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00965f] text-white px-6 py-3 rounded-full font-semibold text-lg transform transition-all duration-300 hover:bg-[#164758] hover:scale-105"
            >
              Submit Testimonial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
