import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Try Authorization header first (React API calls)
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. Fall back to cookie (SSR browser page loads — /groups, etc.)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            // If it's a browser page load (accepts HTML), redirect to auth
            // If it's an API call, return JSON error as before
            if (req.accepts("html")) {
                return res.redirect("/auth?error=Please+login+to+continue");
            }
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find user
        const userId = decoded.id || decoded._id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            if (req.accepts("html")) {
                return res.redirect("/auth?error=Please+login+to+continue");
            }
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        // 5. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);

        const message = error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";

        if (req.accepts("html")) {
            return res.redirect(`/auth?error=${encodeURIComponent(message)}`);
        }
        return res.status(401).json({ success: false, message });
    }
};

export const optionalProtect = (req, res, next) => {
    // Try header first, then cookie
    const token =
        req.headers.authorization?.split(" ")[1] ||
        req.cookies?.token ||
        null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
        } catch (_) {
            // Invalid token — treat as guest
        }
    }
    next();
};