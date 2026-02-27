import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
    Shield, Trophy, FileCheck, Search, Zap, Eye,
    MessageSquare, Award, Users, Github,
    Twitter, Linkedin, Mail, ArrowUpRight, Sparkles,
    PenTool, Rocket, BookOpen
} from 'lucide-react';
import incogLogo from '../assets/incog_logo.png';

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

export default function Home() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("AnonUser");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeCard, setActiveCard] = useState(0);
    const [sessionTime, setSessionTime] = useState(0);

    const featureCards = [
        { icon: <Shield size={48} />, title: "Stay Anonymous", desc: "Your identity stays hidden. Focus on learning." },
        { icon: <Trophy size={48} />, title: "Earn Honor Points", desc: "Contribute insights and build your credibility." },
        { icon: <FileCheck size={48} />, title: "Prepare for Placements", desc: "Practice coding and get senior guidance." }
    ];

    const contributors = [
        { name: "AnonCoder", tag: "anoncoder12", points: "1,275", img: "1" },
        { name: "PlacementGuru", tag: "guru_dev", points: "1,120", img: "2" },
        { name: "IncognitoDev", tag: "incog_ninja", points: "980", img: "3" },
        { name: "CodeSlayer", tag: "slayer99", points: "850", img: "4" },
        { name: "TechWizard", tag: "wiz_ace", points: "740", img: "5" },
        { name: "LogicMaster", tag: "logic_m", points: "690", img: "6" },
        { name: "ByteNinja", tag: "byte_n", points: "620", img: "7" },
        { name: "WebScout", tag: "scout_dev", points: "580", img: "8" },
        { name: "DataPhantom", tag: "phantom_x", points: "510", img: "9" },
        { name: "BitBoss", tag: "boss_bit", points: "490", img: "10" },
    ];

    const handleNavigation = (path) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            // Not logged in? Send them to auth
            navigate('/auth');
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setSessionTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    useEffect(() => {
        const syncUser = () => {
            const token = localStorage.getItem("token");
            const name = localStorage.getItem("userName");

            // If there's no token, we are definitely logged out
            if (!token) {
                setIsLoggedIn(false);
                setDisplayName("AnonUser");
                return;
            }

            setIsLoggedIn(true);
            setDisplayName(name || "AnonUser");
        };

        syncUser();

        // Listen for storage changes (e.g., if user logs out in another tab)
        window.addEventListener("storage", syncUser);

        // Custom event: If api.js forces a logout due to expired refresh token
        window.addEventListener("auth-logout", syncUser);

        const timer = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % featureCards.length);
        }, 4000);

        return () => {
            window.removeEventListener("storage", syncUser);
            window.removeEventListener("auth-logout", syncUser);
            clearInterval(timer);
        };
    }, []);
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#E5E5E5] dark:bg-[#080B16] text-slate-900 dark:text-white font-sans transition-colors duration-300">

            <div className="fixed inset-0 z-0 bg-[#E5E5E5] dark:bg-[#080B16]">
                <Suspense fallback={null}>
                    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                        <ParticleNetwork />
                    </Canvas>
                </Suspense>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-24">

                {/* --- HERO SECTION --- */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32 min-h-[450px]">
                    <div className="max-w-2xl space-y-8 text-center lg:text-left">

                        <div className="space-y-6">
                            {/* Slightly reduced from 7xl to 6xl for better symmetry */}
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                Prepare without <br />
                                <span className="text-indigo-600 dark:text-indigo-500">hesitation.</span>
                            </h1>

                            <div className="space-y-3">
                                {/* Adjusted from 2xl to xl */}
                                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">
                                    Ask. Learn. Contribute. Track progress.
                                </p>
                                {/* Adjusted to lg for medium weight presence */}
                                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                    Everything you need for placements — in one anonymous ecosystem.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {/* Enter Incog Button */}
                            <button
                                onClick={() => handleNavigation('/feed')}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
                            >
                                <Zap size={20} className="fill-white" />
                                Enter Incog
                            </button>

                            {/* Explore Resources Button */}
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
                                        <img src={`${import.meta.env.VITE_API_URL}/avatar/${i + 10}`} />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Joined by <span className="text-indigo-600 dark:text-indigo-400">4,200+</span> engineers
                            </p>
                        </div>
                    </div>

                    {/* Right Side Card (Kept 400px height for symmetry with 6xl font) */}
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
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold">Community Feed</h2>
                            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline">View All</button>
                        </div>

                        <div className="relative group mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input type="text" placeholder="Search experiences, questions, or tags..." className="w-full bg-[#D4D4D4]/50 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm" />
                        </div>

                        <PostCard title="How to approach dynamic programming questions?" excerpt="DP often feels like magic, but it's really just smart recursion. I've broken down the 'top-down' vs 'bottom-up' approach using 5 classic LeetCode problems..." hp="450" views="5.1k" comments="24" />
                        <PostCard title="The Google HR Trap: Salary Negotiations" excerpt="I've been on both sides of the table. Here is why you should never disclose your current CTC until the third round..." hp="820" views="12k" comments="45" />
                        <PostCard title="System Design: Scaling from 0 to 1M Users" excerpt="A step-by-step guide on when to introduce Load Balancers, Caching (Redis), and Database Sharding in your architecture..." hp="610" views="8.4k" comments="32" />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-[#D4D4D4]/30 dark:bg-[#111111]/80 border border-slate-300 dark:border-white/10 rounded-[32px] p-6 shadow-xl sticky top-8 backdrop-blur-xl">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy size={20} className="text-yellow-500" />
                                <h3 className="text-lg font-bold uppercase tracking-tight">Top Contributors</h3>
                            </div>
                            <div className="space-y-4">
                                {contributors.map((user, idx) => (
                                    <UserItem key={idx} {...user} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 border-t border-slate-300 dark:border-white/10 bg-[#D4D4D4]/40 dark:bg-black/40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                        {/* --- BRAND COLUMN --- */}
                        <div className="col-span-1 md:col-span-1 space-y-6">
                            <div className="flex items-center gap-3 group cursor-pointer w-fit">
                                <img
                                    src={incogLogo}
                                    alt="Incog Logo"
                                    className="w-12 h-12 object-contain transition-all duration-500 ease-out 
                                   group-hover:scale-110 group-hover:rotate-[10deg] filter 
                                   drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                />
                                <span className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white 
                                     transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    Incog
                                </span>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    The anonymous hub for placement preparation. Share insights, earn honor, and crack your dream role.
                                </p>
                            </div>
                        </div>

                        {/* --- ECOSYSTEM SECTION --- */}
                        <FooterLinkCol
                            title="Ecosystem"
                            links={[
                                { name: "Community", href: "/community" },
                                { name: "Resources", href: "/resources" },
                                { name: "Leaderboard", href: "/leaderboard" },
                                { name: "Profile", href: "/profile" }
                            ]}
                        />

                        {/* --- LEGAL & HELP --- */}
                        <FooterLinkCol
                            title="Legal & Help"
                            links={[
                                { name: "Community Guidelines", href: "/docs/Incog_Community_Guidelines.pdf" },
                                { name: "Privacy Policy", href: "/docs/Incog_Privacy_Policy.pdf" },
                                { name: "Terms of Service", href: "/docs/Incog_Terms_and_Conditions.pdf" },
                                { name: "Report an Issue", href: "mailto:incog.help@outlook.com" }
                            ]}
                        />

                        {/* --- SESSION TERMINAL --- */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Session Terminal
                            </h4>

                            <div className="p-4 rounded-2xl bg-slate-900 text-emerald-500 font-mono text-[11px] space-y-2 border border-slate-800 shadow-2xl relative overflow-hidden group">
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[200%] animate-scanline pointer-events-none" />

                                <div className="flex justify-between">
                                    <span className="text-emerald-700">PROTOCOL:</span>
                                    <span className="text-emerald-300">INC_SEC/2.0</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-emerald-700">REGION:</span>
                                    <span className="text-emerald-300">
                                        {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1]?.replace('_', ' ') || "Global"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-emerald-700">PLATFORM:</span>
                                    <span className="text-emerald-300">
                                        {navigator.platform || "WebClient"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-1 border-t border-emerald-900/50 mt-2">
                                    <span className="text-emerald-700 uppercase font-bold">Session Time:</span>
                                    <span className="text-emerald-400">{formatTime(sessionTime)}</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-500 italic leading-tight px-1">
                                * All session data is locally encrypted, volatile, and self-contained within your browser.
                            </p>
                        </div>
                    </div>

                    {/* --- BOTTOM BAR --- */}
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

// Helpers
function PostCard({ title, excerpt, hp, views, comments }) {
    return (
        <div className="p-6 rounded-[24px] bg-white/80 dark:bg-[#111111]/50 border border-slate-300 dark:border-white/5 hover:border-indigo-500/40 transition-all cursor-pointer shadow-sm hover:shadow-xl group backdrop-blur-sm">
            <h4 className="text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-500 transition-colors">{title}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">{excerpt}</p>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                    <Award size={16} className="fill-indigo-500/20" />
                    <span className="text-xs font-bold tracking-tight">{hp} HP</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400"><Eye size={18} /> <span className="text-xs font-semibold">{views}</span></div>
                <div className="flex items-center gap-1.5 text-slate-400"><MessageSquare size={18} /> <span className="text-xs font-semibold">{comments}</span></div>
            </div>
        </div>
    );
}

function UserItem({ name, tag, points, img }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer p-2 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/avatar/${img}`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full bg-indigo-900/30 border border-slate-300 dark:border-white/10"
                        onError={(e) => {
                            // Fallback to a UI Avatar if your backend blocks the request
                            e.target.src = `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`;
                        }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#080B16] rounded-full" />
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-sm font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-500 transition-colors leading-tight">{name}</span>
                    <span className="text-[10px] font-medium text-slate-500 italic">@{tag}</span>
                </div>
            </div>
            <div className="flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-lg">
                <Zap size={12} className="text-indigo-600 dark:text-indigo-400 fill-indigo-500" />
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{points}</span>
            </div>
        </div>
    );
}

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
        <a href="#" className="p-2 rounded-lg bg-white/20 dark:bg-white/5 text-slate-500 dark:text-slate-400 
                              hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 
                              transition-all duration-300 social-glow">
            {icon}
        </a>
    );
}