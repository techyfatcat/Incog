import { Sun, Moon, Menu, X, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import IncogLogo from "../assets/incog_logo.png";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [avatarSeed, setAvatarSeed] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [isProfileHovered, setIsProfileHovered] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        setScrolled(latest > 10);
        if (latest > previous && latest > 150) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoggedIn(false);
            setUserName("");
            setAvatarSeed("");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    setIsLoggedIn(true);
                    setUserName(data.username);
                    setAvatarSeed(data.avatarSeed);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error("Navbar auth error:", error);
                handleLogout();
            }
        };

        fetchUser();
    }, [location.pathname]); // 👈 only run once on load


    const handleLogout = () => {
        localStorage.removeItem("token"); // ✅ only remove token
        setIsLoggedIn(false);
        setUserName("");
        setAvatarSeed("");
        navigate("/");
    };
    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Community", path: "/feed" },
        { name: "Resources", path: "/resources" },
        { name: "About", path: "/about" },
    ];

    const AVATAR_API = "http://localhost:5000/api/avatar";

    return (
        <motion.nav
            animate={{ y: visible ? 0 : -100 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 z-[100] w-full px-6 py-6 flex justify-center pointer-events-none"
        >
            <div
                className={`flex items-center w-full max-w-7xl px-5 py-2 pointer-events-auto
                transition-all duration-500 rounded-full border
                ${scrolled
                        ? "bg-[#e5e5e5]/70 dark:bg-black/40 backdrop-blur-2xl border-white/40 dark:border-white/10 shadow-xl mt-2"
                        : "bg-transparent border-transparent shadow-none mt-0"
                    }`}
            >
                {/* --- LEFT: LOGO --- */}
                <div className="flex-1 basis-0 flex justify-start">
                    <Link to="/" className="flex items-center group ml-2">
                        <motion.div className="flex items-center">
                            <motion.img
                                src={IncogLogo}
                                alt="Incog Logo"
                                animate={{ scale: scrolled ? 0.85 : 1 }}
                                whileHover={{ scale: 1.1, rotate: -3 }}
                                className="h-9 w-auto object-contain -mr-1"
                            />
                            <motion.span className="text-lg font-bold tracking-tighter text-slate-900 dark:text-white">
                                Incog
                            </motion.span>
                        </motion.div>
                    </Link>
                </div>

                {/* --- CENTER NAV --- */}
                <div className={`hidden md:flex items-center gap-1 p-1 rounded-full transition-all duration-500
                    ${scrolled ? "bg-transparent border-transparent" : "bg-[#d4d4d4]/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm"}`}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all
                            ${isActive(link.path)
                                    ? "bg-[#e5e5e5] dark:bg-white/20 text-blue-600 dark:text-white shadow-inner"
                                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* --- RIGHT SIDE --- */}
                <div className="flex-1 basis-0 flex justify-end items-center gap-2 md:gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400"
                    >
                        {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                    </button>

                    {!isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/auth" className="text-slate-900 dark:text-white text-[13px] font-bold hover:opacity-70">
                                Login
                            </Link>
                            <Link to="/auth" className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* Profile Dropdown Trigger */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsProfileHovered(true)}
                                onMouseLeave={() => setIsProfileHovered(false)}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 p-1 pr-4 bg-blue-600 rounded-full text-white shadow-md cursor-pointer overflow-hidden"
                                >
                                    <img
                                        src={`${AVATAR_API}/${avatarSeed}`}
                                        alt="pfp"
                                        className="w-8 h-8 rounded-full bg-white/20 object-cover"
                                        onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=fallback"; }}
                                    />
                                    <span className="text-[12px] font-black tracking-tight hidden sm:inline">{userName}</span>
                                </motion.div>

                                <AnimatePresence>
                                    {isProfileHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[110]"
                                        >
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200">
                                                <User size={16} />
                                                <span className="text-xs font-bold">My Profile</span>
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200">
                                                <SettingsIcon size={16} />
                                                <span className="text-xs font-bold">Settings</span>
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Logout Button (Outside) */}
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}

                    <button className="md:hidden p-2 text-slate-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:hidden absolute top-24 left-6 right-6 bg-[#e5e5e5]/95 dark:bg-black/90 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6 pointer-events-auto"
                    >
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-bold ${isActive(link.path) ? "text-blue-600" : "text-slate-900 dark:text-white"}`}>
                                {link.name}
                            </Link>
                        ))}
                        {isLoggedIn && (
                            <>
                                <hr className="border-black/5 dark:border-white/10" />
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold dark:text-white">Profile</Link>
                                <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold dark:text-white">Settings</Link>
                                <button onClick={handleLogout} className="text-2xl font-bold text-red-500 text-left">Logout</button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}