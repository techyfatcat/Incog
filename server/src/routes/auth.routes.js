import express from "express";
import {
    sendOtp,
    verifyOtp,
    register,
    login,
    refreshToken // 👈 Added this
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/send-otp
 */
router.post("/send-otp", sendOtp);

/**
 * @route   POST /api/auth/verify-otp
 */
router.post("/verify-otp", verifyOtp);

/**
 * @route   POST /api/auth/register
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Get new access token using refresh token
 * @access  Public (Logic handles validation)
 */
router.post("/refresh", refreshToken); // 👈 Critical for fixing the auto-logout

/**
 * @route   GET /api/auth/me
 */
router.get("/me", protect, (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        avatarSeed: req.user.avatarSeed,
        bio: req.user.bio,
        stats: req.user.stats,
        settings: req.user.settings,
    });
});

export default router;