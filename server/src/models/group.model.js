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
        // Soft delete — message stays in DB, just hidden in UI
        // Only set when user deletes their own message
        // Never auto-expires, never auto-deleted
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // createdAt = permanent send time, updatedAt = last edit time
    }
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
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // ← not required so old docs without creator don't crash
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // All messages stored permanently as embedded subdocuments
        // MongoDB has no automatic cleanup — messages persist until:
        //   1. User manually deletes (sets deletedAt)
        //   2. The entire group is deleted
        messages: [messageSchema],

        inviteToken: {
            type: String,
            unique: true,
            sparse: true, // allows multiple nulls
        },
    },
    {
        timestamps: true, // group-level createdAt / updatedAt
    }
);

// Index on group updatedAt for sorting sidebar by recent activity
groupSchema.index({ updatedAt: -1 });

// Index to find groups a user belongs to quickly
groupSchema.index({ members: 1 });

const Group = mongoose.model("Group", groupSchema);
export default Group;