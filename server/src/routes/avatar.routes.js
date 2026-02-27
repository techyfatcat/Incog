import express from "express";
import { generateAvatar } from "../controllers/avatar.controller.js";

const router = express.Router();

router.get("/:seed", generateAvatar);

export default router;