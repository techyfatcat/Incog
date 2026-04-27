import Group from "../models/group.model.js";
import { nanoid } from "nanoid";

export const createGroup = async (req, res) => {
    const { name } = req.body;

    const group = await Group.create({
        name,
        createdBy: req.user.id,
        members: [req.user.id],
        inviteCode: nanoid(6)
    });

    res.json(group);
};

export const joinGroup = async (req, res) => {
    const { code } = req.params;

    const group = await Group.findOne({ inviteCode: code });
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (!group.members.includes(req.user.id)) {
        group.members.push(req.user.id);
        await group.save();
    }

    res.json(group);
};

export const getUserGroups = async (req, res) => {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
};