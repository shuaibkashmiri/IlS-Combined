import React from "react";
import Slider from "react-slick";
import { FaStar, FaQuoteLeft, FaLinkedin } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 -mr-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#00965f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 -ml-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#00965f]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

const alumni = [
  {
    name: "Rahul Sharma",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    role: "SDE-2 @ Swiggy",
    batch: "2022",
    rating: 5,
    review:
      "The practical approach to learning and industry-relevant curriculum helped me crack interviews at top companies.",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Priya Patel",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    role: "Frontend Developer @ Razorpay",
    batch: "2022",
    rating: 5,
    review:
      "The mentors are industry experts who provided valuable insights and guided me throughout my learning journey.",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Amit Kumar",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    role: "Full Stack Developer @ CRED",
    batch: "2023",
    rating: 5,
    review:
      "The project-based learning approach and mock interviews were crucial in helping me secure my dream role.",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Neha Singh",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    role: "Backend Developer @ Meesho",
    batch: "2023",
    rating: 5,
    review:
      "From a non-CS background to a tech role, the structured curriculum and support made the transition smooth.",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Vikram Reddy",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    role: "Product Engineer @ Flipkart",
    batch: "2023",
    rating: 5,
    review:
      "The emphasis on both technical skills and soft skills preparation was instrumental in my placement.",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Ananya Gupta",
    image: "https://randomuser.me/api/portraits/women/13.jpg",
    role: "Software Engineer @ PhonePe",
    batch: "2023",
    rating: 5,
    review:
      "The live projects and real-world problem-solving approach gave me confidence in interviews.",
    linkedin: "https://linkedin.com",
  },
];

export default function AlumniSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Our alumni are working with India's top tech companies and making a
            difference in the industry
          </p>
        </div>

        <div className="relative px-8">
          <Slider {...settings} className="alumni-slider">
            {alumni.map((alum, index) => (
              <div key={index} className="p-3">
                <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-gray-100 hover:border-[#00965f]/30 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <img
                      src={alum.image}
                      alt={alum.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#00965f]/20"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{alum.name}</h3>
                      <p className="text-[#00965f] text-sm font-medium">
                        {alum.role}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Batch of {alum.batch}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      {[...Array(alum.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <div className="relative">
                      <FaQuoteLeft className="text-[#00965f]/20 text-4xl absolute -left-2 -top-2" />
                      <p className="text-gray-600 text-sm leading-relaxed pl-6">
                        {alum.review}
                      </p>
                    </div>
                  </div>

                  <a
                    href={alum.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#0077b5] hover:text-[#00965f] transition-colors text-sm font-medium"
                  >
                    <FaLinkedin className="mr-2" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style>
        {`
          .alumni-slider .slick-track {
            display: flex !important;
            padding: 1rem 0;
          }

          .alumni-slider .slick-slide {
            height: inherit !important;
          }

          .alumni-slider .slick-slide > div {
            height: 100%;
          }
        `}
      </style>
    </div>
  );
}
