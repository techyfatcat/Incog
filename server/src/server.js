import "./config/env.js";

import app from "./app.js";
import { connectDB } from "./db/db.js";

/* Crash protection */
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("🚀 Incog Backend Started");
            console.log(`🌍 Port: ${PORT}`);
            console.log("🔐 JWT:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");
            console.log("📧 SendGrid:", process.env.SENDGRID_API_KEY ? "Loaded ✅" : "Missing ❌");
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
};

startServer();

/* Handle async crashes */
process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Rejection:", err);
    process.exit(1);
});