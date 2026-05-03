import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    listGroups,
    createGroup,
    getGroup,
    sendMessage,
    deleteMessage,
    joinViaInvite,
    regenerateInvite,
} from "../controllers/group.controller.js";

const router = express.Router();

router.use(protect); // all group routes require login

router.get("/", listGroups);
router.post("/", createGroup);
router.get("/join/:token", joinViaInvite);
router.get("/:groupId", getGroup);
router.post("/:groupId/messages", sendMessage);
router.post("/:groupId/messages/:messageId/delete", deleteMessage);
router.post("/:groupId/invite/regenerate", regenerateInvite);

export default router;