import express from "express";
import {
    getMyProfile,
    updateMyProfile,
} from "../controllers/profile.controller.js";
import { getUserComments } from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Core Profile Data
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// Profile Activity (Comments Tab)
router.get("/comments", protect, getUserComments);

export default router;