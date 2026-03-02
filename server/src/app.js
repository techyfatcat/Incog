import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import avatarRoutes from "./routes/avatar.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

/* Trust proxy for production (Render, Railway, etc.) */
app.set("trust proxy", 1);

/* Security headers */
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

/* Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* CORS */
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

/* --- RATE LIMITING DEFINITIONS --- */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Too many requests, please try again later." });
    }
});

const avatarLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Avatar limit reached." });
    }
});

const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Too many OTP attempts. Please try again in an hour." });
    }
});

/* --- APPLY LIMITERS (Order Matters!) --- */
// 1. Specific, strict limits first
app.use("/api/auth/send-otp", otpLimiter);

// 2. High-traffic asset limits second
app.use("/api/avatar", avatarLimiter);

// 3. General API limits last
app.use("/api", generalLimiter);
/* Health check */
app.get("/", (req, res) => {
    res.json({ success: true, message: "Incog API Running 🚀" });
});

/* --- ROUTES --- */
// Standardized all routes to start with /api
app.use("/api/avatar", avatarRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

/* 404 Handler */
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

/* Global Error Handler */
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;