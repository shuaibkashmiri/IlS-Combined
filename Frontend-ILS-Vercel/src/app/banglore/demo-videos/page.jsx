"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getSingleCourse } from "../../../redux/features/courseSlice";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import Loading from "../sharedComponents/Loading";
import Authorized from "../../../auth/auth";
import RazorpayCard from "../sharedComponents/RazorpayCard";
import { toast } from "sonner";
import UserReviews from "../sharedComponents/UserReviews";

const DemoVideos = () => {
  Authorized();
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedCourse, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.user);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const paymentSectionRef = useRef(null);

  // Check if user is enrolled in this course
  const isEnrolled = user?.enrolledCourses?.some(
    (course) => course.courseId === selectedCourse?.course?._id
  );

  useEffect(() => {
    if (!selectedCourse) {
      const storedCourse = sessionStorage.getItem("selectedCourse");
      if (storedCourse) {
        const parsedCourse = JSON.parse(storedCourse);
        dispatch(getSingleCourse(parsedCourse.course._id))
          .unwrap()
          .catch((error) => {
            setFetchError(error.message);
            setTimeout(() => router.push("/banglore"), 3000);
          });
      } else {
        router.push("/banglore");
      }
    }
  }, [selectedCourse, dispatch, router]);

  useEffect(() => {
    if (selectedCourse?.course?.videos?.length > 0) {
      const firstVideo = selectedCourse.course.videos[0];
      const embedUrl = getYouTubeEmbedUrl(firstVideo.videoUrl);
      setSelectedVideo({
        ...firstVideo,
        videoUrl: embedUrl,
        thumbnail: firstVideo.thumbnail || selectedCourse.course.thumbnail,
      });
      setSelectedTitle(firstVideo.title);
    }
  }, [selectedCourse]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      // Handle both full URLs and video IDs
      let videoId;
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        if (url.includes("v=")) {
          videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
          videoId = url.split("youtu.be/")[1].split("?")[0];
        }
      } else {
        // Assume the url is already a video ID
        videoId = url;
      }

      if (!videoId) throw new Error("Invalid YouTube URL or ID");

      // Return a simpler embed URL
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      return url;
    }
  };

  const handleVideoSelect = (video, index) => {
    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
    setSelectedVideo({
      ...video,
      videoUrl: embedUrl,
      thumbnail: video.thumbnail || selectedCourse.course.thumbnail,
    });
    setCurrentVideoIndex(index);
  };

  const handlePrevious = () => {
    if (currentVideoIndex > 0) {
      const prevVideo = selectedCourse.course.videos[currentVideoIndex - 1];
      handleVideoSelect(prevVideo, currentVideoIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentVideoIndex < selectedCourse.course.videos.length - 1) {
      const nextVideo = selectedCourse.course.videos[currentVideoIndex + 1];
      handleVideoSelect(nextVideo, currentVideoIndex + 1);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      toast.success("Payment successful! Enrolling you in the course...");
      // The enrollment is now handled in the payment verification
      // Just navigate to the dashboard
      router.push(`/banglore/dashboard`);
      // Optionally refresh user data here if needed
      // You can dispatch an action to update the user's enrolled courses
    } catch (error) {
      console.error("Error handling payment success:", error);
      toast.error(
        error.message ||
          "There was an issue with enrollment. Please contact support."
      );
    }
  };

  // Get only first three videos for demo
  const demoVideos = selectedCourse?.course?.videos?.slice(0, 3) || [];

  const scrollToPayment = () => {
    setShowPayment(true);
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl">{fetchError}</p>
          <p className="text-sm mt-2">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Check if there are no videos
  const hasNoVideos =
    !selectedCourse?.course?.videos ||
    selectedCourse.course.videos.length === 0;

  return (
    <>
      <div className="w-full py-6 bg-gray-100 text-center min-h-screen flex flex-col">
        {/* Course Details Section */}
        <div className="bg-white p-6 mb-6 shadow-md">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Thumbnail */}
              <img
                src={selectedCourse.course.thumbnail}
                alt={selectedCourse.course.title}
                className="w-full md:w-1/3 h-48 object-cover rounded-lg"
              />

              {/* Course Info Container */}
              <div className="flex-1 w-full">
                <h1 className="text-3xl font-bold text-[#164758] mb-3">
                  {selectedCourse.course.title}
                </h1>

                <p className="text-gray-600 mb-4">
                  {selectedCourse.course.description}
                </p>

                {/* Course Details and Button Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-6 text-sm text-gray-500">
                    <p>
                      👨‍🏫 Instructor:{" "}
                      {selectedCourse.course.instructor_id?.fullname}
                    </p>
                    <p>📚 Level: {selectedCourse.course.level}</p>
                  </div>

                  {/* Get Full Course Button */}
                  {!isEnrolled ? (
                    <button
                      onClick={scrollToPayment}
                      className="bg-[#00965f] text-white px-6 py-2.5 rounded hover:bg-[#164758] transition-colors duration-300 flex items-center gap-3 font-medium"
                    >
                      <span>Get Full Course</span>
                      <div className="border-l border-white/20 pl-3">
                        <span className="font-bold">
                          ₹{selectedCourse.course.price.$numberDecimal}
                        </span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        router.push(
                          `/banglore/courses/${selectedCourse.course._id}`
                        )
                      }
                      className="bg-[#00965f] text-white px-6 py-2.5 rounded hover:bg-[#164758] transition-colors duration-300 flex items-center gap-2 font-medium"
                    >
                      Go to Full Course
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="flex-grow">
          {hasNoVideos ? (
            // No Videos Available Message
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📹</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No Demo Videos Available Yet
                </h2>
                <p className="text-gray-600">
                  Demo videos for this course will be added soon. Please check
                  back later.
                </p>
              </div>
            </div>
          ) : (
            // Updated Video Player Section
            <div className="flex flex-col-reverse md:flex-row gap-4 p-4">
              {/* Video List */}
              <div className="md:w-1/3 w-full bg-white rounded-lg shadow-md p-4 mt-4 md:mt-0">
                <h2 className="text-xl font-bold mb-4">Demo Videos</h2>
                {demoVideos.map((video, index) => (
                  <div
                    key={index}
                    onClick={() => handleVideoSelect(video, index)}
                    className={`p-3 cursor-pointer rounded-lg mb-3 ${
                      currentVideoIndex === index
                        ? "bg-gray-100 border-l-4 border-[#00965f]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="w-20 h-16 flex-shrink-0">
                        <img
                          src={
                            video.thumbnail || selectedCourse.course.thumbnail
                          }
                          alt={video.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Video Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-[#164758] text-sm line-clamp-1">
                          {video.title}
                        </h3>
                        {/* Description */}
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {video.description || "No description available"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            Video {index + 1} of {demoVideos.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedCourse.course.videos.length > 3 && (
                  <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {selectedCourse.course.videos.length - 3} more videos
                      available in full course
                    </p>
                  </div>
                )}
              </div>

              {/* Video Player */}
              <div className="md:w-2/3 w-full bg-white rounded-lg shadow-md p-4">
                {selectedVideo ? (
                  <div>
                    <div className="relative w-full pt-[56.25%]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={selectedVideo.videoUrl}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    {/* Video Info */}
                    <div className="mt-4 text-left">
                      <h2 className="text-xl font-semibold text-[#164758]">
                        {selectedVideo.title}
                      </h2>
                      <p className="mt-2 text-gray-600 text-sm">
                        {selectedVideo.description ||
                          "No description available"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <FaPlay size={40} className="mx-auto mb-2" />
                      <p>Select a video to play</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Get Full Course Section */}
        <div className="bg-white mt-8 p-6 shadow-lg" ref={paymentSectionRef}>
          {isEnrolled ? (
            // Show access button for enrolled users
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-[#164758] mb-4">
                You're enrolled in this course!
              </h3>
              <button
                onClick={() =>
                  router.push(`/banglore/courses/${selectedCourse.course._id}`)
                }
                className="bg-[#00965f] text-white px-8 py-3 rounded-lg hover:bg-[#164758] transition-colors duration-300 flex items-center gap-2 text-lg font-semibold mx-auto"
              >
                Go to Full Course
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : // Show payment option for non-enrolled users
          showPayment ? (
            <RazorpayCard
              amount={selectedCourse.course.price.$numberDecimal}
              courseId={selectedCourse.course._id}
              onSuccess={handlePaymentSuccess}
            />
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-4">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-[#164758] mb-2">
                  Ready to Start Learning?
                </h3>
                <p className="text-gray-600">
                  Get full access to {selectedCourse.course.title} and start
                  your learning journey today!
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold text-[#00965f]">
                    ₹{selectedCourse.course.price.$numberDecimal}
                  </span>
                  <span className="text-sm text-gray-500">
                    Full Course Access
                  </span>
                </div>
              </div>
              <button
                className="bg-[#00965f] text-white px-8 py-3 rounded-lg hover:bg-[#164758] transition-colors duration-300 flex items-center gap-2 text-lg font-semibold"
                onClick={() => setShowPayment(true)}
              >
                Get Full Course
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <UserReviews />
      </div>
    </>
  );
};

export default DemoVideos;
