import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import avatarRoutes from "./routes/avatar.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import internshipRoutes from "./routes/internship.routes.js";
import groupRoutes from "./routes/group.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

/* Trust proxy for production (Render, Railway, etc.) */
app.set("trust proxy", 1);

/* ── EJS setup for SSR group pages ── */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

/* Security headers */
app.use(
    helmet({
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: false,
    })
);

/* Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

const internshipLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // Stricter limit to save API credits
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Internship search limit reached." });
    }
});

/* --- APPLY LIMITERS (Order Matters!) */

// strict limits first
app.use("/api/auth/send-otp", otpLimiter);

// internship limiter before general limiter
app.use("/api/internships", internshipLimiter);

// high-traffic assets
app.use("/api/avatar", avatarLimiter);

// general limiter last
app.use("/api", generalLimiter);
/* Health check */
app.get("/", (req, res) => {
    res.json({ success: true, message: "Incog API Running 🚀" });
});

/* --- ROUTES --- */
// Standardized all routes to start with /api
app.use("/api/internships", internshipRoutes);
app.use("/api/avatar", avatarRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);
app.use("/groups", groupRoutes);

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