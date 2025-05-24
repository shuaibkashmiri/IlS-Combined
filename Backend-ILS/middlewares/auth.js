import JWT from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const  isOfflineStudent = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
// roleMiddleware.js
export const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    const userid = req.user; // Assume req.user mein user data aata hai (JWT ya session se)
    const getUser = await User.findById(userid);
    const userRole = getUser.role;
    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role found" });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next(); // Access allowed
  };
};
