import crypto from "crypto";
import Group from "../models/Group.model.js";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function formatDate(date) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function groupMessagesByDate(messages) {
    const result = [];
    let lastLabel = null;
    for (const msg of messages) {
        const label = formatDate(msg.createdAt);
        if (label !== lastLabel) {
            result.push({ type: "date", label });
            lastLabel = label;
        }
        result.push({ type: "msg", ...msg });
    }
    return result;
}

/* ─── GET /groups ─────────────────────────────────────────────────────────── */
export const listGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate("creator", "username")
            .populate("members", "username")
            .select("-messages")
            .sort({ updatedAt: -1 })
            .lean();

        res.render("groups/index", {
            title: "Groups · Incog",
            groups,
            currentUser: req.user,
            error: req.query.error || null,
            success: req.query.success || null,
        });
    } catch (err) {
        res.render("groups/index", {
            title: "Groups · Incog",
            groups: [],
            currentUser: req.user,
            error: "Failed to load groups.",
            success: null,
        });
    }
};

/* ─── POST /groups ────────────────────────────────────────────────────────── */
export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name?.trim()) return res.redirect("/groups?error=Group+name+is+required");

        const inviteToken = crypto.randomBytes(16).toString("hex");
        const group = await Group.create({
            name: name.trim(),
            description: description?.trim() || "",
            creator: req.user._id,
            members: [req.user._id],
            inviteToken,
        });

        res.redirect(`/groups/${group._id}?success=Group+created`);
    } catch (err) {
        res.redirect(`/groups?error=${encodeURIComponent(err.message)}`);
    }
};

/* ─── GET /groups/:groupId ────────────────────────────────────────────────── */
export const getGroup = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, members: req.user._id })
            .populate("creator", "username")
            .populate("members", "username")
            .populate("messages.sender", "username")
            .lean();

        if (!group) return res.redirect("/groups?error=Group+not+found+or+access+denied");

        const rawMessages = (group.messages || [])
            .filter((m) => !m.deletedAt)
            .map((m) => ({
                ...m,
                formattedTime: formatTime(m.createdAt),
                isOwn: m.sender._id.toString() === req.user._id.toString(),
            }));

        const messageItems = groupMessagesByDate(rawMessages);

        const inviteUrl = group.inviteToken
            ? `${req.protocol}://${req.get("host")}/groups/join/${group.inviteToken}`
            : null;

        const allGroups = await Group.find({ members: req.user._id })
            .select("name _id updatedAt")
            .sort({ updatedAt: -1 })
            .lean();

        res.render("groups/chat", {
            title: `${group.name} · Incog`,
            group,
            messageItems,
            inviteUrl,
            allGroups,
            currentUser: req.user,
            error: req.query.error || null,
            success: req.query.success || null,
        });
    } catch (err) {
        res.redirect(`/groups?error=${encodeURIComponent(err.message)}`);
    }
};

/* ─── POST /groups/:groupId/messages ─────────────────────────────────────── */
export const sendMessage = async (req, res) => {
    const { groupId } = req.params;
    try {
        const { content } = req.body;
        if (!content?.trim()) return res.redirect(`/groups/${groupId}?error=Message+cannot+be+empty`);

        const group = await Group.findOne({ _id: groupId, members: req.user._id });
        if (!group) return res.redirect("/groups?error=Group+not+found");

        group.messages.push({ sender: req.user._id, content: content.trim() });
        await group.save();

        res.redirect(`/groups/${groupId}#bottom`);
    } catch (err) {
        res.redirect(`/groups/${groupId}?error=${encodeURIComponent(err.message)}`);
    }
};

/* ─── POST /groups/:groupId/messages/:messageId/delete ───────────────────── */
export const deleteMessage = async (req, res) => {
    const { groupId, messageId } = req.params;
    try {
        const group = await Group.findOne({ _id: groupId, members: req.user._id });
        if (!group) return res.redirect("/groups?error=Group+not+found");

        const message = group.messages.id(messageId);
        if (!message) return res.redirect(`/groups/${groupId}?error=Message+not+found`);

        if (message.sender.toString() !== req.user._id.toString())
            return res.redirect(`/groups/${groupId}?error=Cannot+delete+others+messages`);

        message.deletedAt = new Date();
        await group.save();
        res.redirect(`/groups/${groupId}#bottom`);
    } catch (err) {
        res.redirect(`/groups/${groupId}?error=${encodeURIComponent(err.message)}`);
    }
};

/* ─── GET /groups/join/:token ─────────────────────────────────────────────── */
export const joinViaInvite = async (req, res) => {
    try {
        const group = await Group.findOne({ inviteToken: req.params.token });
        if (!group) {
            return res.render("groups/join", {
                title: "Join Group · Incog",
                status: "error",
                message: "Invalid or expired invite link.",
                groupId: null,
                groupName: null,
                currentUser: req.user,
            });
        }

        const alreadyMember = group.members.some(
            (m) => m.toString() === req.user._id.toString()
        );
        if (!alreadyMember) {
            group.members.push(req.user._id);
            await group.save();
        }

        res.render("groups/join", {
            title: "Join Group · Incog",
            status: "success",
            message: alreadyMember ? "You're already a member!" : `You joined "${group.name}"!`,
            groupId: group._id,
            groupName: group.name,
            currentUser: req.user,
        });
    } catch (err) {
        res.render("groups/join", {
            title: "Join Group · Incog",
            status: "error",
            message: "Something went wrong. Please try again.",
            groupId: null,
            groupName: null,
            currentUser: req.user,
        });
    }
};

/* ─── POST /groups/:groupId/invite/regenerate ────────────────────────────── */
export const regenerateInvite = async (req, res) => {
    const { groupId } = req.params;
    try {
        const group = await Group.findOne({ _id: groupId, creator: req.user._id });
        if (!group)
            return res.redirect(`/groups/${groupId}?error=Only+the+creator+can+regenerate+the+invite`);

        group.inviteToken = crypto.randomBytes(16).toString("hex");
        await group.save();
        res.redirect(`/groups/${groupId}?success=Invite+link+regenerated`);
    } catch (err) {
        res.redirect(`/groups/${groupId}?error=${encodeURIComponent(err.message)}`);
    }
};