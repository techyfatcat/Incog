import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Extract Token from Headers
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        // 2. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find User
        // Use decoded.id OR decoded._id to be safe
        const userId = decoded.id || decoded._id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        // 4. Attach User to Request
        // We attach the whole user, and Mongoose provides .id as a virtual for ._id
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({
            success: false,
            message: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
        });
    }
};