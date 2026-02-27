import express from "express";
import {
    getMyProfile,
    updateMyProfile,
} from "../controllers/profile.controller.js";
import { getUserComments } from "../controllers/post.controller.js"; // 🆕 Import the activity fetcher
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// 👤 Core Profile Data
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// 📜 Profile Activity (Comments Tab)
// This matches: api.get('/profile/comments') in your Frontend
router.get("/comments", protect, getUserComments);

export default router;