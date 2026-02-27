import { User } from "../models/User.model.js";

/**
 * 👤 GET MY PROFILE: Fetches current user data and Hero stats
 */
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure stats exist (Safety check for older accounts)
        if (!user.stats) {
            user.stats = { hp: 100, level: 1, xp: 0 };
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * 📝 UPDATE MY PROFILE: Updates username, bio, avatar, and settings
 */
export const updateMyProfile = async (req, res) => {
    try {
        const { username, bio, avatarSeed, settings } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // 🆔 Handle Username Change logic
        if (username && username !== user.username) {
            // Basic regex to prevent spaces or weird characters if needed
            const cleanUsername = username.toLowerCase().replace(/\s/g, '');
            const existing = await User.findOne({ username: cleanUsername });

            if (existing) return res.status(400).json({ message: "Username already taken" });
            user.username = cleanUsername;
        }

        // 🎨 Basic Info & Customization
        if (bio !== undefined) user.bio = bio;
        if (avatarSeed) user.avatarSeed = avatarSeed;

        // 🧠 Handle Nested Settings
        if (settings) {
            if (settings.allowDM !== undefined) user.settings.allowDM = settings.allowDM;
            if (settings.incognito !== undefined) user.settings.incognito = settings.incognito;
            if (settings.skillVisibility !== undefined) user.settings.skillVisibility = settings.skillVisibility;
        }

        await user.save();

        // 🛡️ Return user without sensitive data
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json(updatedUser);
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};