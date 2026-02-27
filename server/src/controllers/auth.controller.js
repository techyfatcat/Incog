import { Otp } from "../models/Otp.model.js";
import { User } from "../models/User.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

/* =========================================================
    🔹 HELPERS: Generate JWTs
========================================================= */
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Short-lived security token
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET, // Make sure to add this to your .env
        { expiresIn: "7d" } // Long-lived session token
    );
};

/* =========================================================
    🔹 REFRESH TOKEN (The fix for self-logging out)
========================================================= */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token required" });
        }

        // Verify the long-lived refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired refresh token" });
            }

            // Issue a new short-lived access token
            const accessToken = generateAccessToken(decoded.id);
            return res.status(200).json({ accessToken });
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/* =========================================================
    🔹 SEND OTP
========================================================= */
export const sendOtp = async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        email = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, returnDocument: "after" }
        );

        await sendEmail({
            to: email,
            subject: "Verify your Incog Account",
            html: `
                <div style="font-family: sans-serif; max-width: 400px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6366f1;">Incog Verification Code</h2>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing: 6px; color: #1e1e1e;">${otp}</h1>
                    <p style="font-size: 12px; color: #666;">This code expires in 5 minutes.</p>
                </div>
            `,
        });

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send OTP Error:", error);
        return res.status(500).json({ error: "Unable to send OTP" });
    }
};

/* =========================================================
    🔹 VERIFY OTP
========================================================= */
export const verifyOtp = async (req, res) => {
    try {
        let { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

        email = email.toLowerCase().trim();
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return res.status(500).json({ error: "OTP verification failed" });
    }
};

/* =========================================================
    🔹 REGISTER
========================================================= */
export const register = async (req, res) => {
    try {
        let { email, username, password, avatar, purpose, otp } = req.body;

        if (!email || !username || !password || !otp) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        email = email.toLowerCase().trim();
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username: username.trim() }] });
        if (existingUser) return res.status(400).json({ error: "Email or username already taken" });

        const newUser = await User.create({
            email,
            username: username.trim(),
            password,
            avatar,
            purpose,
        });

        await Otp.deleteMany({ email });

        // GENERATE BOTH TOKENS
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        return res.status(201).json({
            message: "User registered successfully",
            token: accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ error: "Registration failed" });
    }
};

/* =========================================================
    🔹 LOGIN
========================================================= */
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Credentials required" });

        const user = await User.findOne({
            $or: [{ email: email.trim().toLowerCase() }, { username: email.trim() }]
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // GENERATE BOTH TOKENS
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        return res.status(200).json({
            message: "Login successful",
            token: accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Login failed" });
    }
};