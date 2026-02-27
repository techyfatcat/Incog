import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },

        // 🟣 PROFILE
        bio: {
            type: String,
            default: "",
        },
        avatarSeed: {
            type: String,
            default: "default",
        },

        // 🟣 GAMIFICATION
        stats: {
            hp: {
                type: Number,
                default: 100, // 💡 Changed from 0 so new users aren't "dead"
            },
            level: {
                type: Number,
                default: 1,   // 💡 Matches your "Level 1 Hero" UI
            },
            streak: {
                type: Number,
                default: 0,
            },
        },

        // 🟣 SETTINGS
        settings: {
            allowDM: {
                type: Boolean,
                default: true,
            },
            incognito: {
                type: Boolean,
                default: false,
            },
            skillVisibility: {
                type: Boolean,
                default: true,
            },
        },
    },
    { timestamps: true }
);

/* 🔐 Hash password before saving */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/* 🔐 Compare entered password */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);