import express from "express";
import { createGroup, joinGroup, getUserGroups } from "../controllers/group.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.get("/", protect, getUserGroups);
router.post("/join/:code", protect, joinGroup);

export default router;