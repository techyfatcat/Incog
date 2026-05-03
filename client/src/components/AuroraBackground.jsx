import { motion } from "framer-motion";

export default function AuroraBackground({ theme }) {
    const isDark = theme === "dark";

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

            {/* Base background */}
            <div
                className={`absolute inset-0 ${isDark ? "bg-[#080B16]" : "bg-[#e5e5e5]"
                    }`}
            />

            {/* Aurora Glow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isDark ? 0.55 : 0.2 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
            >
                {/* Top Left Glow */}
                <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-50" />

                {/* Bottom Right Glow */}
                <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-sky-400 rounded-full blur-[120px] opacity-40" />

                {/* Center Soft Glow */}
                <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-violet-500 rounded-full blur-[120px] opacity-30" />
            </motion.div>

            {/* Subtle gradient overlay (adds depth) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/30" />

        </div>
    );
}