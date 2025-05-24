import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import courseReducer from "./features/courseSlice";
import inhouseReducer from "./features/inhouseSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
    inhouse: inhouseReducer,
  },
});
