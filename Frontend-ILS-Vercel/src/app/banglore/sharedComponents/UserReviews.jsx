import React from "react";
import { FaStar, FaQuoteLeft, FaQuoteRight, FaUser } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UserReviews = ({ reviews = defaultReviews }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.nextElementSibling.style.display = "flex";
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-9">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            What Our Students Say
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Trusted by thousands of students across India
          </p>
        </div>

        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index} className="px-3">
              <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow relative">
                {/* Quote Icon */}
                <FaQuoteLeft className="absolute top-4 left-4 text-gray-200 text-xl" />
                <FaQuoteRight className="absolute bottom-4 right-4 text-gray-200 text-xl" />

                {/* Review Content */}
                <div className="mb-4 min-h-[150px] text-gray-600 text-sm leading-relaxed px-5">
                  "{review.content}"
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Updated Reviewer Info with fallback icon */}
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0 relative w-10 h-10">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      onError={handleImageError}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#00965f]"
                    />
                    <div className="hidden w-10 h-10 rounded-full border-2 border-[#00965f] bg-gray-100 items-center justify-center">
                      <FaUser className="text-gray-400 text-lg" />
                    </div>
                  </div>
                  <div className="ml-3 text-center">
                    <div className="font-medium text-gray-800 text-sm">
                      {review.name}
                    </div>
                    <div className="text-gray-500 text-xs">{review.course}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Default reviews if none are provided
const defaultReviews = [
  {
    content:
      "The course content was comprehensive and well-structured. The instructor's teaching style made complex concepts easy to understand.",
    rating: 5,
    name: "Mahira Khan",
    course: "Web Development",
    avatar:
      "https://img.freepik.com/premium-photo/young-smiling-woman-wearing-hijab_875337-1467.jpg",
  },
  {
    content:
      "Excellent platform for learning. The interactive sessions and practical assignments helped me gain real-world skills.",
    rating: 4,
    name: "Shahmeer Bhat",
    course: "Digital Marketing",
    avatar:
      "https://as2.ftcdn.net/v2/jpg/04/22/82/39/1000_F_422823992_ZtyrE96o6wGTJcyZolZ6pLRUGHBRCH9c.jpg",
  },
  {
    content:
      "The flexibility of online learning combined with quality content made this course perfect for my busy schedule.",
    rating: 5,
    name: "Zeenat Khan",
    course: "Data Science",
    avatar:
      "https://img.freepik.com/premium-photo/beautiful-asian-muslim-girl-wearing-hijab_665569-3286.jpg",
  },
  {
    content:
      "The course provided a deep dive into the subject matter, with plenty of practical examples. The instructor was engaging and encouraged active participation.",
    rating: 5,
    name: "Deeba Mir",
    course: "Web Development",
    avatar:
      "https://th.bing.com/th/id/OIP.Cfls8r1SzMrtqr_sPQj37AAAAA?rs=1&pid=ImgDetMain",
  },

  {
    content:
      "An excellent course that delves deeply into the subject matter. The instructor kept the sessions lively and encouraged us to participate actively.",
    rating: 5,
    name: "Ayeeza wani",
    course: "Web Development",
    avatar: "https://www.istockphoto.com/photos/hijab-portrait",
  },
  {
    content:
      "This course offered a detailed examination of the topic, with the instructor doing a fantastic job of keeping us engaged.",
    rating: 5,
    name: "Faheem Dar",
    course: "Web Development",
    avatar: "https://stock.adobe.com/search?k=indian+man+professional",
  },
];

export default UserReviews;
