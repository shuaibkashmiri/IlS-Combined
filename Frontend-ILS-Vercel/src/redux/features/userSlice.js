import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const isBrowser = typeof window !== "undefined";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// Get All Users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/getall`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add Offline Student
export const addOfflineStudent = createAsyncThunk(
  "user/addOfflineStudent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/add-offline-student`,
        formData,
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

// Register User
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      if (isBrowser)
        localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Login User with getUserDetails call
export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      if (!formData.email || !formData.password) {
        return rejectWithValue({ message: "Email and password are required" });
      }

      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      await dispatch(getUserDetails());
      if (isBrowser)
        localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// Instructor Login
export const instructorLogin = createAsyncThunk(
  "user/instructorLogin",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      if (!formData.email || !formData.password) {
        return rejectWithValue({ message: "Email and password are required" });
      }

      const response = await axios.post(
        `${BASE_URL}/api/auth/instructor/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      await dispatch(getUserDetails());
      if (isBrowser)
        localStorage.setItem(
          "instructor",
          JSON.stringify(response.data.instructor)
        );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Instructor login failed" }
      );
    }
  }
);

// Google Login with getUserDetails call
export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      // Instead of axios request, redirect to Google auth URL
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://ils-project.onrender.com"
          : "http://localhost:8080";

      window.location.href = `${baseUrl}/api/auth/google`;
      return {};
    } catch (error) {
      return rejectWithValue({ message: "Google login failed" });
    }
  }
);

// Get User Details
export const getUserDetails = createAsyncThunk(
  "user/details",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/userdetails`, {
        withCredentials: true,
      });

      // Log the response to see its structure
      console.log("API Response:", response);

      // Extract the actual user data from the response
      const userData = response.data.payload || response.data;

      // Log the extracted data
      console.log("Extracted User Data:", userData);

      // Save to session storage if in browser - only use "user" key
      if (isBrowser) {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      return userData;
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to get user details" }
      );
    }
  }
);

// Initiate Teaching Application
export const initiateTeachingApplication = createAsyncThunk(
  "user/initiateTeachingApplication",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/teach/initiate`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Initiation failed" }
      );
    }
  }
);

// Verify Teaching OTP
export const verifyTeachingOTP = createAsyncThunk(
  "user/verifyTeachingOTP",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/teach/verify-otp`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

// Complete Teaching Application
export const completeTeachingApplication = createAsyncThunk(
  "user/completeTeachingApplication",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/teach/complete`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Application completion failed" }
      );
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/admin/user/delete/${userId}`,
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

// Approve Instructor
export const approveInstructor = createAsyncThunk(
  "user/approveInstructor",
  async ({ instructorId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/instructor/approve/${instructorId}`,
        { status: "approved", reason },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Reject Instructor
export const rejectInstructor = createAsyncThunk(
  "user/rejectInstructor",
  async ({ instructorId, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/instructor/reject/${instructorId}`,
        { status: "rejected", reason },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const savedUser = (() => {
  if (!isBrowser) return null;
  const user = sessionStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
})();

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser,
    instructor: null, // Add state for instructor
    tempdata: null,
    loading: false,
    error: null,
    message: null,
    users: [],
    instructorRegistration: {
      step: 1, // 1: Initiate, 2: Verify OTP, 3: Complete Application
      email: null,
      message: null,
      error: null,
      loading: false,
    },
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.instructor = null; // Reset instructor on logout
      state.loading = false;
      state.error = null;
      state.message = "Logged out successfully";
      if (isBrowser) {
        localStorage.removeItem("user");
        localStorage.removeItem("instructor");
        sessionStorage.removeItem("user");
        Cookies.remove("token");
        Cookies.remove("token", { path: "/" });
        Cookies.remove("token", { path: "/banglore/instructor" });
      }
    },
    resetInstructorRegistration: (state) => {
      state.instructorRegistration = {
        step: 1,
        email: null,
        message: null,
        error: null,
        loading: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message =
          action.payload.message || "User Registered Successfully";
        if (isBrowser) {
          // Save user data
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tempdata = action.payload.tempdata;
        state.message = action.payload.message || "User Logged In Successfully";
        if (isBrowser) {
          // Save user data
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(instructorLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(instructorLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.instructor = action.payload.instructor;
        state.message = action.payload.message || "Login successful";
      })
      .addCase(instructorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.tempdata = action.payload.tempdata;
        if (isBrowser) {
          localStorage.setItem("user", JSON.stringify(action.payload.user)); // Save user data
        }
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Extract the data from action.payload
        const userData = action.payload;
        console.log("Reducer User Data:", userData);

        state.user = userData;
        // If the user is an instructor, also update instructor state
        if (userData.role === "instructor") {
          state.instructor = userData;
        }
        state.error = null;
        if (isBrowser) {
          // Store in session storage - only use "user" key
          sessionStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.user = null;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.payload;
        state.message = action.payload.message;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Add Offline Student
      .addCase(addOfflineStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOfflineStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Add the new student to the users array
        const newUser = {
          ...action.payload.user,
          role: "student",
          enrolledCourses: [],
          lastActive: null,
          isOflineStudent: true,
        };
        state.users.push(newUser);
      })
      .addCase(addOfflineStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Initiate Teaching Application
      .addCase(initiateTeachingApplication.pending, (state) => {
        state.instructorRegistration.loading = true;
        state.instructorRegistration.error = null;
      })
      .addCase(initiateTeachingApplication.fulfilled, (state, action) => {
        state.instructorRegistration.loading = false;
        state.instructorRegistration.step = 2;
        state.instructorRegistration.message = action.payload.message;
      })
      .addCase(initiateTeachingApplication.rejected, (state, action) => {
        state.instructorRegistration.loading = false;
        state.instructorRegistration.error = action.payload.message;
      })
      // Verify Teaching OTP
      .addCase(verifyTeachingOTP.pending, (state) => {
        state.instructorRegistration.loading = true;
        state.instructorRegistration.error = null;
      })
      .addCase(verifyTeachingOTP.fulfilled, (state, action) => {
        state.instructorRegistration.loading = false;
        state.instructorRegistration.step = 3;
        state.instructorRegistration.email = action.payload.email;
        state.instructorRegistration.message = action.payload.message;
      })
      .addCase(verifyTeachingOTP.rejected, (state, action) => {
        state.instructorRegistration.loading = false;
        state.instructorRegistration.error = action.payload.message;
      })
      // Complete Teaching Application
      .addCase(completeTeachingApplication.pending, (state) => {
        state.instructorRegistration.loading = true;
        state.instructorRegistration.error = null;
      })
      .addCase(completeTeachingApplication.fulfilled, (state, action) => {
        state.instructorRegistration.loading = false;
        state.instructorRegistration.step = 1; // Reset step after completion
        state.instructorRegistration.message = action.payload.message;
      })
      .addCase(completeTeachingApplication.rejected, (state, action) => {
        state.instructorRegistration.loading = false;
        state.instructorRegistration.error = action.payload.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Remove the deleted user from the users array
        state.users = state.users.filter(
          (user) => user._id !== action.payload.userId
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(approveInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Instructor approved successfully";
      })
      .addCase(approveInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to approve instructor";
      })
      .addCase(rejectInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Instructor rejected successfully";
      })
      .addCase(rejectInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reject instructor";
      });
  },
});

export const { logoutUser, resetInstructorRegistration } = userSlice.actions;
export default userSlice.reducer;
