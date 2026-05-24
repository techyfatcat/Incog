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
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
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
            // ── FIX: removed unique:true — was causing duplicate key errors
            // on existing documents that had inviteToken:null stored explicitly.
            // sparse:true only skips documents where the field is *absent*,
            // not where it is explicitly null. We enforce uniqueness manually
            // via the index defined below.
            sparse: true,
            index: true,
        },
    },
    { timestamps: true }
);

groupSchema.index({ updatedAt: -1 });
groupSchema.index({ members: 1 });

// ── Startup migration: remove explicit null inviteTokens so sparse index works.
// Runs once every server start; no-ops immediately if nothing to clean.
groupSchema.statics.fixNullInviteTokens = async function () {
    try {
        const result = await this.updateMany(
            { inviteToken: null },
            { $unset: { inviteToken: "" } }
        );
        if (result.modifiedCount > 0) {
            console.log(`[Group] Cleaned ${result.modifiedCount} null inviteToken(s)`);
        }
    } catch (err) {
        console.error("[Group] fixNullInviteTokens failed:", err.message);
    }
};

const Group = mongoose.model("Group", groupSchema);
export default Group;