import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
    Shield, Trophy, FileCheck, Search, Zap, Eye,
    MessageSquare, Award, Users, Github,
    Twitter, Linkedin, Mail, ArrowUpRight, Sparkles,
    PenTool, Rocket, BookOpen, CheckCircle2, XCircle,
    BrainCircuit, Lock, TrendingUp, Star, ChevronRight,
    Code2, Lightbulb, Target, HeartHandshake, Cpu, Globe, Database, ArrowRight,
} from 'lucide-react';
import incogLogo from '../assets/incog_logo.png';
import logoDark from '../assets/logo/logo-dark.svg';
import logoLight from '../assets/logo/logo-light.svg';
import AuroraBackground from "../components/AuroraBackground";
import { useTheme } from "../context/ThemeContext";
import { motion, useScroll, useTransform } from "framer-motion";


// --- THREE.JS NETWORK BACKGROUND COMPONENT ---
const ParticleNetwork = () => {
    const count = 80;
    const meshRef = useRef();
    const lineMeshRef = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3((Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 25),
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.015, (Math.random() - 0.5) * 0.015, (Math.random() - 0.5) * 0.015),
            });
        }
        return temp;
    }, []);

    const isDark = document.documentElement.classList.contains('dark');

    <img
        src={isDark ? logoDark : logoLight}
        alt="Incog"
        className="h-10"
    />

    useFrame((state) => {
        const positions = new Float32Array(count * 3);
        const linePositions = [];
        const mouse = state.mouse;

        particles.forEach((p, i) => {
            p.position.add(p.velocity);
            p.position.x += (mouse.x * 2 - p.position.x) * 0.001;
            p.position.y += (mouse.y * 2 - p.position.y) * 0.001;

            if (Math.abs(p.position.x) > 15) p.velocity.x *= -1;
            if (Math.abs(p.position.y) > 15) p.velocity.y *= -1;
            if (Math.abs(p.position.z) > 15) p.velocity.z *= -1;

            positions[i * 3] = p.position.x;
            positions[i * 3 + 1] = p.position.y;
            positions[i * 3 + 2] = p.position.z;

            for (let j = i + 1; j < count; j++) {
                const dist = p.position.distanceTo(particles[j].position);
                if (dist < 5) {
                    linePositions.push(p.position.x, p.position.y, p.position.z);
                    linePositions.push(particles[j].position.x, particles[j].position.y, particles[j].position.z);
                }
            }
        });

        if (meshRef.current) meshRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        if (lineMeshRef.current) lineMeshRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    });

    return (
        <group>
            <points ref={meshRef}>
                <bufferGeometry />
                <pointsMaterial color="#6366f1" size={0.12} transparent opacity={0.6} />
            </points>
            <lineSegments ref={lineMeshRef}>
                <bufferGeometry />
                <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
            </lineSegments>
        </group>
    );
};

// --- SCROLL ANIMATION HOOK ---
function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, visible];
}

export default function Home() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("AnonUser");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
    const { theme } = useTheme();
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, -80]);
    const featureCards = [
        { icon: <Shield size={48} />, title: "Stay Anonymous", desc: "Your identity stays hidden. Focus on learning." },
        { icon: <Trophy size={48} />, title: "Earn Honor Points", desc: "Contribute insights and build your credibility." },
        { icon: <FileCheck size={48} />, title: "Prepare for Placements", desc: "Practice coding and get senior guidance." }
    ];

    const handleNavigation = (path) => {
        if (isLoggedIn) navigate(path);
        else navigate('/auth');
    };

    useEffect(() => {
        const syncUser = () => {
            const token = localStorage.getItem("token");
            const name = localStorage.getItem("userName");
            if (!token) { setIsLoggedIn(false); setDisplayName("AnonUser"); return; }
            setIsLoggedIn(true);
            setDisplayName(name || "AnonUser");
        };
        syncUser();
        window.addEventListener("storage", syncUser);
        window.addEventListener("auth-logout", syncUser);
        const timer = setInterval(() => setActiveCard((prev) => (prev + 1) % featureCards.length), 4000);
        return () => {
            window.removeEventListener("storage", syncUser);
            window.removeEventListener("auth-logout", syncUser);
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-900 dark:text-white">
            <AuroraBackground theme={theme} />
            {/* BG Canvas */}


            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-24">

                {/* --- HERO SECTION --- */}
                <motion.div
                    style={{ y: heroY }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32 min-h-[450px]"
                >
                    <div className="max-w-2xl space-y-8 text-center lg:text-left">
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                Prepare without <br />
                                <span className="text-indigo-600 dark:text-indigo-500">hesitation.</span>
                            </h1>
                            <div className="space-y-3">
                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
                                    Ask. Learn. Contribute. Track progress.
                                </p>
                                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    Everything you need for placements — in one anonymous ecosystem.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => handleNavigation('/feed')}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
                            >
                                <Zap size={20} className="fill-white" />
                                Enter Incog
                            </button>
                            <button
                                onClick={() => handleNavigation('/resources')}
                                className="bg-[#D4D4D4] dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2 group"
                            >
                                <Search size={20} className="text-indigo-600" />
                                Explore Resources
                            </button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#080B16] bg-slate-200 overflow-hidden shadow-sm">
                                        <img src={`${import.meta.env.VITE_API_URL}/api/avatar/${i + 10}`} alt="" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Joined by <span className="text-indigo-600 dark:text-indigo-400">4,200+</span> engineers
                            </p>
                        </div>
                    </div>

                    {/* Rotating Feature Card */}
                    <div className="relative w-full max-w-md h-[380px] group hidden lg:block">
                        <div className="absolute inset-0 bg-indigo-600 rounded-[40px] rotate-6 opacity-10 transition-transform duration-1000 group-hover:rotate-12" />
                        <div className="absolute inset-0 bg-indigo-500 rounded-[40px] -rotate-3 opacity-20 transition-transform duration-1000 group-hover:-rotate-6" />
                        <div className="absolute inset-0 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
                            {featureCards.map((card, index) => (
                                <div key={index} className={`absolute inset-0 p-10 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${index === activeCard ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-md'}`}>
                                    <div className={`mb-8 transition-all duration-700 delay-300 transform ${index === activeCard ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                        <div className="text-indigo-600 dark:text-indigo-500 bg-indigo-500/10 w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner">{card.icon}</div>
                                    </div>
                                    <div className={`transition-all duration-700 delay-500 ${index === activeCard ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                        <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{card.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-4 text-lg leading-snug">{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* --- PROBLEMS SECTION --- */}
                <ProblemsSection />



            </main>

            {/* --- FOOTER --- */}
            <footer className="relative z-10 border-t border-slate-300 dark:border-white/10 bg-[#D4D4D4]/40 dark:bg-black/40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                        {/* Brand */}
                        <div className="col-span-1 space-y-6">
                            <div className="flex items-center gap-3 group cursor-pointer w-fit">
                                <img
                                    src={theme === "dark" ? logoDark : logoLight}
                                    alt="Incog Logo"
                                    className="w-30 h-3s0 object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-[10deg] filter drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                />

                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                The anonymous hub for placement preparation. Share insights, earn honor, and crack your dream role.
                            </p>
                        </div>

                        {/* Ecosystem */}
                        <FooterLinkCol
                            title="Ecosystem"
                            links={[
                                { name: "Feed", href: "/feed" },
                                { name: "Resources", href: "/resources" },
                                { name: "Profile", href: "/profile" }
                            ]}
                        />

                        {/* Legal & Help */}
                        <FooterLinkCol
                            title="Legal & Help"
                            links={[
                                { name: "Community Guidelines", href: "/docs/Incog_Community_Guidelines.pdf" },
                                { name: "Privacy Policy", href: "/docs/Incog_Privacy_Policy.pdf" },
                                { name: "Terms of Service", href: "/docs/Incog_Terms_and_Conditions.pdf" },
                                { name: "Report an Issue", href: "mailto:incog.help@outlook.com" }
                            ]}
                        />
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-slate-300 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-slate-500">© 2026 Incog Community. Built by engineers, for engineers.</p>
                            <p className="text-[10px] text-slate-400">v1.0.0-stable</p>
                        </div>
                        <div className="flex items-center gap-5">
                            <SocialIcon icon={<Github size={18} />} />
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// ─────────────────────────────────────────────
// PROBLEMS SECTION
// ─────────────────────────────────────────────
const problems = [
    {
        icon: <XCircle size={28} />,
        title: "Fear of Judgment",
        desc: "Students hesitate to ask 'basic' questions in public forums, missing out on crucial learning because they're afraid of being seen as inexperienced."
    },
    {
        icon: <XCircle size={28} />,
        title: "Scattered Resources",
        desc: "Placement prep is fragmented across dozens of platforms — no single place to get interview experiences, DSA practice, and HR tips together."
    },
    {
        icon: <XCircle size={28} />,
        title: "No Real Incentive to Share",
        desc: "Seniors rarely contribute interview experiences back. Knowledge dies with each batch, leaving juniors to start from scratch every season."
    },
    {
        icon: <XCircle size={28} />,
        title: "Generic Advice That Doesn't Apply",
        desc: "Most online advice is written for FAANG. Students from tier-2/3 colleges get no targeted, relatable guidance for their specific situation."
    }
];

function ProblemsSection() {
    const [ref, visible] = useScrollReveal(0.1);

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-32"
        >
            {/* Header */}
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
            <section className="text-center mb-32">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">Built with Modern Tech</h2>
                <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-medium"><Code2 size={24} /> React.js</div>
                    <div className="flex items-center gap-2 font-medium"><Cpu size={24} /> Node.js</div>
                    <div className="flex items-center gap-2 font-medium"><Database size={24} /> MongoDB</div>
                    <div className="flex items-center gap-2 font-medium"><Globe size={24} /> Socket.io</div>
                </div>
            </section>
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
        </motion.section>

    );
}

// ─────────────────────────────────────────────
// BENEFITS SECTION
// ─────────────────────────────────────────────
const benefits = [
    {
        icon: <Lock size={28} />,
        title: "True Anonymity",
        desc: "Ask anything without fear. Your real identity is never exposed — not to other users, not to companies. Zero social anxiety."
    },
    {
        icon: <BrainCircuit size={28} />,
        title: "Peer-Driven Intelligence",
        desc: "Real interview experiences from real students. Fresher-to-fresher advice that actually applies to your college and your target companies."
    },
    {
        icon: <Trophy size={28} />,
        title: "Honor Points System",
        desc: "Every insight you share earns you HP. Rise through the leaderboard, build anonymous credibility, and make your contribution visible."
    },
    {
        icon: <Target size={28} />,
        title: "Placement-First Focus",
        desc: "No noise. No job listings. No generic tutorials. Every feature is designed around one goal: getting you hired."
    },
    {
        icon: <HeartHandshake size={28} />,
        title: "Pay It Forward",
        desc: "The knowledge loop doesn't die with each batch. Seniors contribute, juniors benefit, everyone grows — a self-sustaining community."
    },
    {
        icon: <Lightbulb size={28} />,
        title: "Curated Resources",
        desc: "Handpicked DSA sheets, system design guides, HR question banks, and company-specific prep — all in one place."
    }
];

function BenefitsSection() {
    const [ref, visible] = useScrollReveal(0.1);

    return (
        <section ref={ref} className="mb-32">
            {/* Header */}
            <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-3">Why Incog</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                    Built for the way <span className="text-indigo-600 dark:text-indigo-500">you actually learn.</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-xl mx-auto leading-relaxed">
                    Every feature exists for a reason. No fluff, no bloat — just what you need to land the offer.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((b, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        <div className="p-6 rounded-[24px] bg-white/70 dark:bg-[#111111]/60 border border-slate-200 dark:border-white/5 hover:border-indigo-400/50 dark:hover:border-indigo-600/40 transition-all shadow-sm hover:shadow-xl group backdrop-blur-sm h-full flex flex-col gap-4">
                            <div className="text-indigo-600 dark:text-indigo-500 bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                                {b.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{b.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function FooterLinkCol({ title, links }) {
    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">{title}</h4>
            <ul className="space-y-2">
                {links.map((link, idx) => (
                    <li key={idx}>
                        <a
                            href={link.href}
                            target={link.href.endsWith('.pdf') ? "_blank" : "_self"}
                            rel="noreferrer"
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors flex items-center gap-1 group"
                        >
                            {link.name}
                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="p-2 rounded-lg bg-white/20 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300">
            {icon}
        </a>
    );
}