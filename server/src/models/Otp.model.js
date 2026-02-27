import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Auto-delete after 5 minutes
    },
});

/* 🔐 Hash OTP before saving */
otpSchema.pre("save", async function (next) {
    if (!this.isModified("otp")) return next();
    this.otp = await bcrypt.hash(this.otp, 10);
    next();
});

/* 🔐 Compare entered OTP with stored hashed OTP */
otpSchema.methods.compareOtp = async function (enteredOtp) {
    return await bcrypt.compare(enteredOtp, this.otp);
};

export const Otp = mongoose.model("Otp", otpSchema);