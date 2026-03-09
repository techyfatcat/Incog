import express from "express";
import {
    sendOtp,
    verifyOtp,
    register,
    login,
    refreshToken
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshToken);

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