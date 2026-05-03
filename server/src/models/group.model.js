import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 300,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [messageSchema],
        inviteToken: {
            type: String,
            unique: true,
            sparse: true,
        },
        inviteExpiresAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Index for fast message retrieval
groupSchema.index({ "messages.createdAt": -1 });

const Group = mongoose.model("Group", groupSchema);
export default Group;