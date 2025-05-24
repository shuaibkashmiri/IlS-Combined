import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

const GOOGLE_CALLBACK_URL = "http://localhost:8080/api/auth/google/callback";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile Data:", profile);

        if (!profile || !profile.emails || !profile.emails[0].value) {
          return done(new Error("Invalid profile data received from Google"));
        }

        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update existing user's Google info
          user.googleId = profile.id;
          user.picture = profile.photos?.[0]?.value;
          user.isVerified = true; // Ensure Google users are verified
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos?.[0]?.value,
            isVerified: true, // Google users are automatically verified
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Passport Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
