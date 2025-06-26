import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/offline-course`;
// Fetch all offline courses
export const fetchOfflineCourses = createAsyncThunk(
  "inhouse/fetchOfflineCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-all-offline-courses`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch offline courses" }
      );
    }
  }
);

// Fetch all offline students
export const fetchOfflineStudents = createAsyncThunk(
  "inhouse/fetchOfflineStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-all-offline-students`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch offline students" }
      );
    }
  }
);

// Add Offline Course
export const addOfflineCourse = createAsyncThunk(
  "inhouse/addCourse",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-course`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add offline course" }
      );
    }
  }
);

// Add Offline Student
export const addOfflineStudent = createAsyncThunk(
  "inhouse/addOfflineStudent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/add-offline-student`,
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
        error.response?.data || { message: "Failed to add offline student" }
      );
    }
  }
);

// Offline Student Login
export const offlineStudentLogin = createAsyncThunk(
  "inhouse/offlineStudentLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/offline-student-login`,
        credentials,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// Get Inhouse Student Details
export const getInhouseStudentDetails = createAsyncThunk(
  "inhouse/getStudentDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/get-offline-student-details`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student details"
      );
    }
  }
);

export const createVideo = createAsyncThunk(
  "inhouse/createVideo",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          dispatch(setUploadProgress(percentCompleted));
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getVideos = createAsyncThunk(
  "inhouse/getVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-videos`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Give Discount to Student
export const giveDiscount = createAsyncThunk(
  "inhouse/giveDiscount",
  async ({ studentId, courseId, discountAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/give-discount`,
        { studentId, courseId, discountAmount },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to apply discount" }
      );
    }
  }
);

// Pay Fee for Student
export const payFee = createAsyncThunk(
  "inhouse/payFee",
  async ({ studentId, courseId, amountPaid }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/pay-fee`,
        { studentId, courseId, amountPaid },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to process fee payment" }
      );
    }
  }
);

const initialState = {
  offlineCourses: [],
  offlineStudents: [],
  loading: false,
  error: null,
  message: null,
  currentStudent: null,
  isAuthenticated: false,
  studentDetails: null,
  videos: [],
  videoLoading: false,
  videoError: null,
  uploadProgress: 0,
  getVideosLoading: false,
  getVideosError: null,
};

// Load initial state from localStorage if available
if (typeof window !== "undefined") {
  const storedStudent = localStorage.getItem("inHouseStudent");
  if (storedStudent) {
    try {
      const parsedData = JSON.parse(storedStudent);
      initialState.studentDetails = parsedData.student;
      initialState.currentStudent = parsedData.student;
    } catch (error) {
      console.error("Error parsing stored student data:", error);
    }
  }
}

const inhouseSlice = createSlice({
  name: "inhouse",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    clearState: (state) => {
      state.studentDetails = null;
      state.currentStudent = null;
      state.loading = false;
      state.error = null;
      state.message = null;
      state.isAuthenticated = false;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Offline Courses
      .addCase(fetchOfflineCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfflineCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.offlineCourses = action.payload.courses || [];
        state.message = null;
      })
      .addCase(fetchOfflineCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch courses";
      })
      // Fetch Offline Students
      .addCase(fetchOfflineStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfflineStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.offlineStudents = action.payload.students || [];
        state.message = null;
      })
      .addCase(fetchOfflineStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch students";
      })
      // Add Offline Course
      .addCase(addOfflineCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOfflineCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.offlineCourses.push(action.payload.course);
        state.message = action.payload.message || "Course added successfully";
      })
      .addCase(addOfflineCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add course";
      })
      // Add Offline Student
      .addCase(addOfflineStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOfflineStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.offlineStudents.push(action.payload.student);
        state.message = action.payload.message || "Student added successfully";
      })
      .addCase(addOfflineStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to add student";
      })
      // Offline Student Login
      .addCase(offlineStudentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(offlineStudentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload.student;
        state.isAuthenticated = true;
        state.message = "Login successful";
        // The student details will be fetched in the component after login
      })
      .addCase(offlineStudentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Login failed";
        state.isAuthenticated = false;
      })
      // Get Inhouse Student Details
      .addCase(getInhouseStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInhouseStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDetails = action.payload.student;
        state.currentStudent = action.payload.student;
        state.error = null;
        // Save to localStorage
        localStorage.setItem("inHouseStudent", JSON.stringify(action.payload));
        state.message = "Student details fetched successfully";
      })
      .addCase(getInhouseStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVideo.pending, (state) => {
        state.videoLoading = true;
        state.videoError = null;
        state.uploadProgress = 0;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.videoLoading = false;
        state.videos.push(action.payload.video);
        state.uploadProgress = 100;
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.videoLoading = false;
        state.videoError = action.payload?.error || "Failed to upload video";
        state.uploadProgress = 0;
      })
      .addCase(getVideos.pending, (state) => {
        state.getVideosLoading = true;
        state.getVideosError = null;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.getVideosLoading = false;
        state.videos = action.payload.videos;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.getVideosLoading = false;
        state.getVideosError =
          action.payload?.error || "Failed to fetch videos";
      })
      .addCase(giveDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(giveDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Discount applied successfully";
        // Update the student in offlineStudents
        const updatedStudent = action.payload.student;
        if (updatedStudent && state.offlineStudents) {
          const idx = state.offlineStudents.findIndex(
            (s) => s._id === updatedStudent._id
          );
          if (idx !== -1) {
            state.offlineStudents[idx] = updatedStudent;
          }
        }
      })
      .addCase(giveDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to apply discount";
      })
      // Pay Fee Cases
      .addCase(payFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payFee.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Fee payment processed successfully";
        // Update the student in offlineStudents
        const updatedStudent = action.payload.student;
        if (updatedStudent && state.offlineStudents) {
          const idx = state.offlineStudents.findIndex(
            (s) => s._id === updatedStudent._id
          );
          if (idx !== -1) {
            state.offlineStudents[idx] = updatedStudent;
          }
        }
      })
      .addCase(payFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to process fee payment";
      });
  },
});

export const {
  resetMessage,
  clearState,
  setUploadProgress,
} = inhouseSlice.actions;
export default inhouseSlice.reducer;
