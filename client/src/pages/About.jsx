import React, { useState, useEffect } from 'react';
import {
    Shield, Target, Users, Zap, CheckCircle2,
    ArrowRight, Cpu, Globe, Database, Code2,
    Github, Linkedin
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// --- INTERACTIVE 3D TILT COMPONENT ---
const TiltCard = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative"
        >
            {children}
        </motion.div>
    );
};

// --- DEVELOPER CARD COMPONENT ---
const DevCard = ({ name, role, description }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 p-8 rounded-[32px] shadow-xl overflow-hidden transition-all duration-300 hover:shadow-blue-500/10"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/15 transition-colors" />

            <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6 overflow-hidden border-2 border-blue-600/20 flex items-center justify-center">
                    {/* Placeholder for Photo */}
                    <Users className="text-slate-400" size={30} />
                </div>

                <h3 className="text-xl font-bold dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{name}</h3>
                <p className="text-blue-600 font-semibold text-sm mb-4 uppercase tracking-wider">{role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {description}
                </p>

                <div className="flex gap-4">
                    <Github size={20} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                    <Linkedin size={20} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                </div>
            </div>
        </motion.div>
    );
};

export default function About() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const bgX = useSpring(useTransform(mouseX, [0, window.innerWidth], [-20, 20]));
    const bgY = useSpring(useTransform(mouseY, [0, window.innerHeight], [-20, 20]));

    return (
        <div className="min-h-screen bg-[#F8FAFF] dark:bg-[#080B16] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 overflow-x-hidden">

            {/* --- INTERACTIVE BACKGROUND --- */}
            <motion.div
                style={{ x: bgX, y: bgY }}
                className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-20"
            >
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">

                {/* --- HERO SECTION --- */}
                <section className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6 inline-block border border-blue-600/20">
                            The Incog Philosophy
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 dark:text-white leading-[1.1]">
                            Built for students.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">
                                Designed for placements.
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Incog is an anonymous, structured, and student-driven platform built to make placement preparation collaborative, organized, and confidence-driven.
                        </p>
                    </motion.div>
                </section>

                {/* --- BENTO GRID: PROBLEM --- */}
                <section className="mb-32">
                    <h2 className="text-3xl font-bold mb-12 text-center">The Problem We Saw</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
                        <div className="md:col-span-2 bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 p-8 rounded-[32px] shadow-sm flex flex-col justify-end">
                            <Shield className="text-blue-600 mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Fear of Judgment</h3>
                            <p className="text-sm text-slate-500">Students often hesitate to ask "simple" doubts in public groups, fearing peer pressure.</p>
                        </div>

                        <div className="bg-blue-600 p-8 rounded-[32px] text-white flex flex-col justify-center items-center text-center shadow-lg shadow-blue-600/20">
                            <Zap size={40} className="mb-4" />
                            <h3 className="text-xl font-bold">Scattered Info</h3>
                            <p className="text-sm opacity-80">Valuable interview experiences get buried in chaotic WhatsApp chats.</p>
                        </div>

                        <div className="bg-slate-900 dark:bg-indigo-900/40 p-8 rounded-[32px] text-white md:col-span-1 border border-white/5">
                            <Target size={32} className="mb-4 text-indigo-400" />
                            <h3 className="text-xl font-bold">No Tracking</h3>
                            <p className="text-sm opacity-80">Students lack a central dashboard to track progress against company kits.</p>
                        </div>

                        <div className="md:col-span-2 bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/5 p-8 rounded-[32px] flex items-center gap-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 text-blue-600">The Incog Fix</h3>
                                <p className="text-slate-500 font-medium italic">“Clarity matters more than identity.”</p>
                            </div>
                            <div className="hidden sm:block h-full w-px bg-slate-200 dark:bg-white/10" />
                            <ul className="flex-1 space-y-2 text-sm font-semibold">
                                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="text-green-500" /> Anonymous Peers</li>
                                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="text-green-500" /> Structured Kits</li>
                                <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="text-green-500" /> Progress Sync</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* --- DEVELOPER SECTION --- */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Meet the Developers</h2>
                        <p className="text-slate-500 dark:text-slate-400">The engineers behind the Incog platform.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <DevCard
                            name="Aadit Sarhadi"
                            role="Full Stack Developer"
                            description="Specializes in scalable backend architectures and high-performance real-time systems."
                        />
                        <DevCard
                            name="Divyansh Verma"
                            role="Frontend Engineer & Designer"
                            description="Expert in crafting immersive, interactive user interfaces and modern design systems."
                        />
                    </div>
                </section>

                {/* --- TECH STACK SECTION --- */}
                <section className="text-center mb-32">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">Built with Modern Tech</h2>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-medium"><Code2 size={24} /> React.js</div>
                        <div className="flex items-center gap-2 font-medium"><Cpu size={24} /> Node.js</div>
                        <div className="flex items-center gap-2 font-medium"><Database size={24} /> MongoDB</div>
                        <div className="flex items-center gap-2 font-medium"><Globe size={24} /> Socket.io</div>
                    </div>
                </section>

                {/* --- FINAL COMPACT CTA --- */}
                <section className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-[#151921] border border-slate-200 dark:border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        {/* Interactive glow effect */}
                        <div className="absolute top-0 right-0 w-48 h-full bg-blue-600/5 -skew-x-12 translate-x-12 group-hover:bg-blue-600/10 transition-colors duration-500" />

                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Start Preparing Better.</h2>
                            <p className="text-slate-500 dark:text-slate-400">Ready to ace your placements anonymously?</p>
                        </div>

                        <button className="relative z-10 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/25 whitespace-nowrap">
                            Get Started Now <ArrowRight size={20} />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}