import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const companies = [
  {
    name: "Microsoft",
    logo: "https://ilssrinagar.com/img/inspire-small.png",
  },

  {
    name: "Google",
    logo: "https://ilssrinagar.com/img/client/client-1.png",
  },
  {
    name: "Swiggy",
    logo: "https://ilssrinagar.com/img/client/client-3.png",
  },
  {
    name: "Razorpay",
    logo: "https://ilssrinagar.com/img/client/client-6.png",
  },
  {
    name: "PhonePe",
    logo: "https://ilssrinagar.com/img/client/client-5.png",
  },
];

export default function CompanySlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleImageError = (e, companyName) => {
    e.target.onerror = null;
    e.target.src = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="80">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#343a40" text-anchor="middle" dominant-baseline="middle">
          ${companyName}
        </text>
      </svg>
    `)}`;
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <Slider {...settings} className="company-slider">
          {companies.map((company, index) => (
            <div key={index} className="px-4">
              <div className="h-16 flex items-center justify-center">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-full max-w-[120px] object-contain transition-all duration-300"
                  onError={(e) => handleImageError(e, company.name)}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style>
        {`
          .company-slider .slick-track {
            display: flex !important;
            align-items: center;
          }
          .company-slider .slick-slide {
            height: inherit !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .company-slider .slick-slide > div {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
}
