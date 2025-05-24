import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/offline-course";

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

const initialState = {
  offlineCourses: [],
  offlineStudents: [],
  loading: false,
  error: null,
  message: null,
};

const inhouseSlice = createSlice({
  name: "inhouse",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
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
      });
  },
});

export const { resetMessage } = inhouseSlice.actions;
export default inhouseSlice.reducer;