import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "http://localhost:8080/api/course";
// const BASE_URL = "https://ils-project.onrender.com/api/course";

const isBrowser = typeof window !== "undefined";

// get all courses for admin
export const getAllCoursesforAdmin = createAsyncThunk(
  "course/getallforadmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/getallforadmin`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Enroll offline student in course
export const enrollOfflineStudentInCourse = createAsyncThunk(
  "course/enrollOfflineStudentInCourse",
  async ({ studentId, courseId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/enroll-offline-student-in-course/${studentId}/${courseId}`,
        {}, // Empty body, adjust if your API expects data
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add Course
export const addCourse = createAsyncThunk(
  "course/add",
  async (formData, { rejectWithValue }) => {
    try {
      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }

      // Ensure the file is properly appended
      if (!formData.get("thumbnail")) {
        throw new Error("No thumbnail file found in form data");
      }

      const response = await axios.post(`${BASE_URL}/create`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload Progress:", percentCompleted);
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Course creation error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Failed to create course" }
      );
    }
  }
);

// get Course Details
export const getAllCourses = createAsyncThunk(
  "course/getall",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// get course based on id
export const getSingle = createAsyncThunk(
  "course/getsingle",
  async (cid, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/get/${cid}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get Single Course
export const getSingleCourse = createAsyncThunk(
  "courses/getSingle",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${id}`);
      // Store in sessionStorage
      if (isBrowser)
        sessionStorage.setItem("selectedCourse", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch course" }
      );
    }
  }
);

// Action to set upload progress
export const setUploadProgress = (progress) => ({
  type: "courses/setUploadProgress",
  payload: progress,
});

// Add Video
export const addVideo = createAsyncThunk(
  "course/addVideo",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/video/add`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUploadProgress(percentCompleted));
            console.log("Video Upload Progress:", percentCompleted);
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Approve Course
export const approveCourse = createAsyncThunk(
  "course/approve",
  async ({ courseId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/course/approve/${courseId}`,
        { status: "approved", reason },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to approve course" }
      );
    }
  }
);

// Reject Course
export const rejectCourse = createAsyncThunk(
  "course/reject",
  async ({ courseId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/course/reject/${courseId}`,
        { status: "rejected", reason },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reject course" }
      );
    }
  }
);

// Approve Video
export const approveVideo = createAsyncThunk(
  "course/approveVideo",
  async ({ videoId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/video/approve/${videoId}`,
        { status: "approved", reason },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to approve video" }
      );
    }
  }
);

// Reject Video
export const rejectVideo = createAsyncThunk(
  "course/rejectVideo",
  async ({ videoId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/admin/video/reject/${videoId}`,
        { status: "rejected", reason },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reject video" }
      );
    }
  }
);

// Delete Video
export const deleteVideo = createAsyncThunk(
  "course/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/video/delete/${videoId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete video" }
      );
    }
  }
);

// Edit Video
export const editVideo = createAsyncThunk(
  "course/editVideo",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/video/edit/${formData.get("videoId")}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to edit video" }
      );
    }
  }
);

// Edit Course
export const editCourse = createAsyncThunk(
  "course/editCourse",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/course/edit/${formData.get("courseId")}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to edit course" }
      );
    }
  }
);

// Delete Course
export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/admin/course/delete/${courseId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete course" }
      );
    }
  }
);

const initialState = {
  courses: [],
  selectedCourse: isBrowser
    ? JSON.parse(sessionStorage.getItem("selectedCourse")) || null
    : null,
  loading: false,
  error: null,
  uploadProgress: 0, // Add this to track upload progress
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Course Added Successfully";
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.message = action.payload.message || "Course Added Successfully";
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCourse = action.payload.course;
        state.message = action.payload.message || "Course Added Successfully";
      })
      .addCase(getSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getSingleCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(getSingleCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch course";
      })
      .addCase(addVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0; // Reset progress on upload start
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Video Added Successfully";
        state.uploadProgress = 100; // Set to 100 on completion
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.uploadProgress = 0; // Reset on failure
      })
      .addCase(getAllCoursesforAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoursesforAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.message = action.payload.message || "Course Added Successfully";
      })
      .addCase(getAllCoursesforAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Approve Course Cases
      .addCase(approveCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Course approved successfully";
        // Update the course status in the courses array
        const courseIndex = state.courses.findIndex(
          (course) => course._id === action.payload.course._id
        );
        if (courseIndex !== -1) {
          state.courses[courseIndex] = action.payload.course;
        }
      })
      .addCase(approveCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to approve course";
      })
      // Reject Course Cases
      .addCase(rejectCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Course rejected successfully";
        // Update the course status in the courses array
        const courseIndex = state.courses.findIndex(
          (course) => course._id === action.payload.course._id
        );
        if (courseIndex !== -1) {
          state.courses[courseIndex] = action.payload.course;
        }
      })
      .addCase(rejectCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reject course";
      })
      // Delete Video Cases
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Video deleted successfully";
        // Remove the deleted video from the correct course
        const deletedVideoId = action.meta.arg;
        state.courses = state.courses.map((course) => {
          if (course.videos) {
            course.videos = course.videos.filter(
              (video) => video._id !== deletedVideoId
            );
          }
          return course;
        });
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete video";
      })
      // Approve Video Cases
      .addCase(approveVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Video approved successfully";
        // Update the video status in the courses array
        state.courses = state.courses.map((course) => {
          if (course.videos) {
            course.videos = course.videos.map((video) => {
              if (video._id === action.payload.video._id) {
                return action.payload.video;
              }
              return video;
            });
          }
          return course;
        });
      })
      .addCase(approveVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to approve video";
      })
      // Reject Video Cases
      .addCase(rejectVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Video rejected successfully";
        // Update the video status in the courses array
        state.courses = state.courses.map((course) => {
          if (course.videos) {
            course.videos = course.videos.map((video) => {
              if (video._id === action.payload.video._id) {
                return action.payload.video;
              }
              return video;
            });
          }
          return course;
        });
      })
      .addCase(rejectVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reject video";
      })
      // Edit Video Cases
      .addCase(editVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Video updated successfully";
        // Update the video in the courses array
        state.courses = state.courses.map((course) => {
          if (course.videos) {
            course.videos = course.videos.map((video) => {
              if (video._id === action.payload.video._id) {
                return action.payload.video;
              }
              return video;
            });
          }
          return course;
        });
      })
      .addCase(editVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to edit video";
      })
      // Edit Course Cases
      .addCase(editCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Course updated successfully";
        // Update the course in the courses array
        const courseIndex = state.courses.findIndex(
          (course) => course._id === action.payload.course._id
        );
        if (courseIndex !== -1) {
          state.courses[courseIndex] = action.payload.course;
        }
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to edit course";
      })
      // Delete Course Cases
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Course deleted successfully";
        // Remove the deleted course from the courses array
        state.courses = state.courses.filter(
          (course) => course._id !== action.meta.arg
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete course";
      });
  },
});

export default courseSlice.reducer;
