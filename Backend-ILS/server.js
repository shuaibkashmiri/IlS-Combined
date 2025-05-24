import "dotenv/config";
import express, { json } from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middlewares/errorHandler.js";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// / const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 8000;
const app = express();

// Updated CORS configuration to be more flexible
app.use((req, res, next) => {
// Allow requests from any origin
  const allowedOrigins = [
    "https://ils-project.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
    "*",
    // Add other origins as needed
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Razorpay-Signature"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).json({
      body: "OK",
    });
  }

  next();
});

// Updated cors middleware configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://ils-project.onrender.com",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        // Add other origins as needed
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Razorpay-Signature",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  })
);

// Middlewares
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
import authRouter from "./routes/authRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import offlineCourseRouter from "./routes/offlineCourseRoutes.js";
app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/video", videoRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/offline-course", offlineCourseRouter);

// for frontend
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Add error handler after all routes
app.use(errorHandler);

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// DB Connection
connectDB();
