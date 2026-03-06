import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden font-mono">

            {/* Red Alert Strobing Overlay */}
            <motion.div
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-red-600 pointer-events-none"
            />

            {/* Scanned Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', size: '40px 40px', backgroundSize: '40px 40px' }}
            />

            {/* Radar Scanner SVG */}
            <div className="relative mb-8">
                <svg width="300" height="300" viewBox="0 0 200 200" className="relative z-10">
                    <circle cx="100" cy="100" r="98" stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.3" />
                    <circle cx="100" cy="100" r="60" stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.2" />

                    {/* Rotating Scan Line */}
                    <motion.line
                        x1="100" y1="100" x2="100" y2="0"
                        stroke="#ef4444" strokeWidth="2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "100px", originY: "100px" }}
                    />

                    {/* Blinking Intruders (The 404) */}
                    <motion.g
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <text x="75" y="110" fill="#ef4444" fontSize="30" fontWeight="bold">404</text>
                        <circle cx="100" cy="100" r="5" fill="#ef4444" />
                    </motion.g>
                </svg>
            </div>

            {/* Warning Text */}
            <div className="text-center z-20 px-4">
                <motion.h2
                    animate={{ skewX: [-2, 2, -2] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                    className="text-red-500 text-3xl md:text-5xl font-black mb-2 tracking-tighter"
                >
                    RESTRICTED AREA: UNKNOWN SECTOR
                </motion.h2>

                <p className="text-red-400/70 text-sm mb-10 uppercase tracking-[0.2em]">
                    Identification failed. Unauthorized access detected.
                </p>

                <Link to="/">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#ef4444", color: "#000" }}
                        className="border-2 border-red-500 text-red-500 px-10 py-3 font-bold uppercase tracking-widest transition-all"
                    >
                        Abort and Return to Base
                    </motion.button>
                </Link>
            </div>

            {/* Terminal Static Effect */}
            <div className="absolute bottom-10 left-10 text-red-500/40 text-[10px] uppercase leading-tight hidden md:block">
                <div>LAT: 40.4404</div>
                <div>LNG: -40.4404</div>
                <div>STATUS: CRITICAL_FAILURE</div>
                <div>TRACE_ROUTE: COMPROMISED</div>
            </div>
        </div>
    );
};

export default NotFound;