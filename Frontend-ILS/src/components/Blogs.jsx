import React, { useState, useEffect } from "react";

const Blog = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const posts = [
    {
      title:
        "The Rise of Artificial Intelligence: Opportunities and Challenges",
      description:
        "In recent years, artificial intelligence (AI) has emerged as one of the most transformative technologies of our time. From self-driving cars to smart assistants and advanced data analytics.From virtual assistants to autonomous vehicles, AI is transforming industries and reshaping the way we interact with the world. In this blog post, we'll explore the opportunities AI presents,..",
      url: "/blog/post-1",
      imageUrl:
        "https://1.bp.blogspot.com/-Yc58l-Lfm2A/XxyXbG8GzeI/AAAAAAAAyfg/phnv3PqnmyMlGaIITglFwTrWXTr7OODywCNcBGAsYHQ/s1600/cyber_05989.jpg",
    },
    {
      title:
        "The Rise of Quantum Computing: What It Means for the Future of IT",
      description:
        "In the realm of technology, few advancements hold as much transformative potential as quantum computing. As we stand on the brink of a new era in computing,it's essential to understand what quantum computing is, how it differs from classical computing,...",
      url: "/blog/post-2",
      imageUrl:
        "https://cdn.pixabay.com/photo/2023/03/10/12/28/ai-generated-7842202_1280.jpg",
    },
    {
      title:
        "Exploring the Expansive Potential of Blockchain Technology: Beyond Cryptocurrency",
      description:
        " When most people hear the term blockchain they immediately think of cryptocurrencies like Bitcoin and Ethereum. While blockchain technology is indeed the backbone of these digital currencies, its potential extends far beyond the realm of finance....",
      url: "/blog/post-3",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/08/12/13/31/icon-4401251_1280.jpg",
    },
    {
      title: "Augmented Reality (AR) and Virtual Reality (VR): Beyond Gaming",
      description:
        "When we think of Augmented Reality (AR) and Virtual Reality (VR), gaming often comes to mind as the primary application. However, these immersive technologies are making significant strides in various industries, offering innovative solutions and transforming the way we interact with the world....",
      url: "/blog/post-4",
      imageUrl:
        "https://miro.medium.com/v2/resize:fit:840/1*qDKPmZsRdpkfOCvn5pxqfw.png",
    },
    {
      title:
        "The Internet of Things (IoT): Connecting the World Like Never Before",
      description:
        "In an increasingly interconnected world, the Internet of Things (IoT) stands out as a revolutionary force, transforming how we live, work, and interact with our environment. By connecting everyday objects to the internet, IoT enables seamless communication and data exchange,....",
      url: "/blog/post-5",
      imageUrl:
        "https://cdn.pixabay.com/photo/2022/07/02/10/46/connection-7297043_1280.jpg",
    },
    {
      title:
        "The Future of Work: How IT Technologies Are Shaping Remote and Hybrid Work Environments",
      description:
        "The landscape of work is undergoing a profound transformation, driven by rapid advancements in IT technologies. As organizations adapt to new realities, remote and hybrid work environments have emerged as the new norm, offering flexibility and reshaping traditional workplace dynamics.....",
      url: "/blog/post-6",
      imageUrl:
        "https://cdn.pixabay.com/photo/2021/03/19/12/13/man-6107416_1280.png",
    },
  ];

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + posts.length) % posts.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  // Simplified getDisplayedPosts function
  const getDisplayedPosts = () => {
    if (isMobile) {
      return [posts[currentIndex]];
    } else if (window.innerWidth < 1024) {
      return [
        posts[currentIndex % posts.length],
        posts[(currentIndex + 1) % posts.length],
      ];
    } else {
      return [
        posts[currentIndex % posts.length],
        posts[(currentIndex + 1) % posts.length],
        posts[(currentIndex + 2) % posts.length],
      ];
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // minimum swipe distance
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const displayedPosts = getDisplayedPosts();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#164758] mb-2">
            Published Blogs
          </h1>
          <p className="text-lg sm:text-xl text-[#00965f]">
            Stay updated with our latest articles
          </p>
        </header>

        <div className="relative group">
          {/* Force single column on mobile */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {displayedPosts.map((post, index) => (
              <div
                key={index}
                className="transition-transform duration-300 ease-in-out transform p-3 sm:p-5"
              >
                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:border-[#00965f] transition-all duration-300 ease-in-out relative group h-[400px] sm:h-[450px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url(${post.imageUrl})`,
                      opacity: 0.8,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#164758]/90 to-transparent"></div>
                  </div>

                  <div className="p-4 sm:p-6 relative z-10 h-full flex flex-col justify-end">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                        <a href={post.url} className="text-white">
                          {post.title}
                        </a>
                      </h2>
                      <p className="text-sm sm:text-md text-gray-100 mb-4 line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-[#00965f] text-white py-2 px-4 rounded-md transition-colors duration-300 text-sm sm:text-base font-medium">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 bg-[#164758]/80 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 bg-[#164758]/80 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            →
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-6">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 mx-1.5 sm:mx-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-[#00965f] w-5 sm:w-6"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
