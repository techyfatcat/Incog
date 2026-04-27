import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);