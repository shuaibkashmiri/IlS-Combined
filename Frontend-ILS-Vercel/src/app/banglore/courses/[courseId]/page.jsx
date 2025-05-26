"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getSingle } from "../../../../redux/features/courseSlice";
import Loading from "../../sharedComponents/Loading";
import { toast } from "sonner";
import Authorized from "../../../../auth/auth";

import { useRouter } from "next/navigation";

const FullCouses = ({ params }) => {
  Authorized();
  const { courseId } = params;
  const dispatch = useDispatch();
  const router = useRouter();

  const { selectedCourse, loading, error } = useSelector(
    (state) => state.courses
  );
  const { user } = useSelector((state) => state.user);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef();

  // Check enrollment status
  useEffect(() => {
    if (!user) {
      toast.error("Please login to access the course");
      router.push("/banglore");
      return;
    }

    const isEnrolled = user.enrolledCourses?.some(
      (course) => course.courseId === courseId
    );

    if (!isEnrolled) {
      toast.error("Unauthorized Access: You are not enrolled in this course");
      router.push("/banglore");
      return;
    }

    // Only fetch course if user is enrolled
    if (courseId) {
      dispatch(getSingle(courseId));
    }
  }, [courseId, user, dispatch, router]);

  useEffect(() => {
    if (selectedCourse?.course?.videos?.length > 0) {
      const firstVideo = selectedCourse.course.videos[0];
      const embedUrl = getYouTubeEmbedUrl(firstVideo.videoUrl);
      setSelectedVideo({
        ...firstVideo,
        videoUrl: embedUrl,
        thumbnailUrl:
          firstVideo.thumbnailUrl || selectedCourse.course.thumbnail,
      });
    }
  }, [selectedCourse]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  if (!selectedCourse) {
    return <div className="text-center p-4">No course found</div>;
  }

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
      thumbnailUrl: video.thumbnailUrl || selectedCourse.course.thumbnail,
    });
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      const player = videoRef.current.contentWindow;
      if (player && player.postMessage) {
        const command = isPlaying ? "pauseVideo" : "playVideo";
        player.postMessage(
          `{"event":"command","func":"${command}","args":""}`,
          "*"
        );
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      handleVideoSelect(
        selectedCourse.course.videos[currentVideoIndex - 1],
        currentVideoIndex - 1
      );
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < selectedCourse.course.videos.length - 1) {
      handleVideoSelect(
        selectedCourse.course.videos[currentVideoIndex + 1],
        currentVideoIndex + 1
      );
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const player = videoRef.current.contentWindow;
      if (player && player.postMessage) {
        player.postMessage('{"event":"listening"}', "*");

        window.addEventListener("message", (event) => {
          if (event.data && typeof event.data === "string") {
            try {
              const data = JSON.parse(event.data);
              if (data.event === "onStateChange" && data.info === 1) {
                // Playing
                setProgress((data.currentTime / data.duration) * 100);
              }
            } catch (e) {
              // Handle parse error
            }
          }
        });
      }
    }
  };

  return (
    <>
      <div className="w-full py-6 bg-gray-100 text-center min-h-screen flex flex-col">
        {/* Course Header */}
        <div className="bg-white p-6 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6 max-w-6xl mx-auto">
            <img
              src={selectedCourse.course.thumbnail}
              alt={selectedCourse.course.title}
              className="w-full md:w-1/3 h-48 object-cover rounded-lg"
            />
            <div className="flex-1 text-left">
              <h1 className="text-3xl font-bold text-[#164758] mb-3">
                {selectedCourse.course.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {selectedCourse.course.description}
              </p>
              <div className="flex gap-6 text-sm text-gray-500">
                <p>
                  👨‍🏫 Instructor: {selectedCourse.course.instructor_id?.fullname}
                </p>
                <p>⏳ Duration: {selectedCourse.course.duration} hours</p>
                <p>📚 Level: {selectedCourse.course.level}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Video Player and List Section */}
        <div className="flex flex-col-reverse md:flex-row gap-4 p-4">
          {/* Video List */}
          <div className="md:w-1/3 w-full bg-white rounded-lg shadow-md p-4 mt-4 md:mt-0">
            <h2 className="text-xl font-bold mb-4">Course Content</h2>
            {selectedCourse.course.videos?.map((video, index) => (
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
                        video.thumbnailUrl || selectedCourse.course.thumbnail
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
                        Video {index + 1} of{" "}
                        {selectedCourse.course.videos.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Course Summary */}
            <div className="mt-4 p-2 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <p>Total Videos: {selectedCourse.course.videos?.length || 0}</p>
              </div>
            </div>
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
                    {selectedVideo.description || "No description available"}
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
      </div>
    </>
  );
};

export default FullCouses;
