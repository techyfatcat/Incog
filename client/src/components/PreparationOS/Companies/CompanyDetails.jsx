import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    ArrowLeft, Target, Briefcase, PieChart, BarChart3,
    BrainCircuit, CheckCircle2, ExternalLink, Zap,
    Bookmark, Search, Clock, TrendingUp, Award,
    Code2, ChevronRight, Star, Calendar, BookOpen,
    MessageSquare, ThumbsUp, AlertTriangle, Shield,
    Layers, GitBranch, Terminal, Trophy, Info,
    XCircle, Cpu, Sparkles
} from 'lucide-react';

/* ── Animated counter ────────────────────────────────────────────────────── */
const AnimatedCounter = ({ target, duration = 1.4 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
        if (!inView) return;
        const num = parseFloat(target);
        if (isNaN(num)) { setCount(target); return; }
        let cur = 0;
        const step = num / (duration * 60);
        const id = setInterval(() => {
            cur += step;
            if (cur >= num) { setCount(num); clearInterval(id); }
            else setCount(Math.floor(cur));
        }, 1000 / 60);
        return () => clearInterval(id);
    }, [inView, target, duration]);
    return <span ref={ref}>{count}</span>;
};

/* ── Stat Card ───────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon, accent }) => (
    <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative overflow-hidden rounded-2xl p-5"
        style={{
            background: `linear-gradient(135deg, ${accent}22 0%, ${accent}10 100%)`,
            border: `1px solid ${accent}35`,
        }}>
        <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-xl" style={{ background: `${accent}25` }}>
                {React.cloneElement(icon, { size: 16, color: accent })}
            </div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: `${accent}99` }}>{label}</p>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
    </motion.div>
);

/* ── Difficulty Bar ──────────────────────────────────────────────────────── */
const DiffBar = ({ label, percent, count, color }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400 dark:text-white/40">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-white/25 font-medium normal-case">{count} qs</span>
                <span className="dark:text-white text-slate-600">{percent}%</span>
            </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full"
                style={{ background: color }}
            />
        </div>
    </div>
);

/* ── Topic Chip ──────────────────────────────────────────────────────────── */
const TopicChip = ({ name, value, rank }) => (
    <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.04 }}
        className="flex items-center gap-3 p-3 rounded-2xl transition-all group"
        style={{
            background: "var(--chip-bg, rgba(0,0,0,0.03))",
            border: "1px solid var(--chip-border, rgba(0,0,0,0.06))",
        }}>
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0"
            style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
            #{rank + 1}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-700 dark:text-white truncate">{name}</p>
            <div className="h-1 mt-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: rank * 0.04 + 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }}
                />
            </div>
        </div>
        <span className="text-[11px] font-black shrink-0" style={{ color: "#6366f1" }}>{value}%</span>
    </motion.div>
);

/* ── Experience Badge ────────────────────────────────────────────────────── */
const ExpBadge = ({ exp }) => {
    const config = {
        Positive: { bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.2)", text: "#10b981", icon: <ThumbsUp size={12} /> },
        Neutral: { bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)", text: "#f59e0b", icon: <Info size={12} /> },
        Negative: { bg: "rgba(244,63,94,0.07)", border: "rgba(244,63,94,0.2)", text: "#f43f5e", icon: <AlertTriangle size={12} /> },
    }[exp.sentiment] || {};
    return (
        <div className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: config.bg, border: `1px solid ${config.border}` }}>
            <span className="mt-0.5 shrink-0" style={{ color: config.text }}>{config.icon}</span>
            <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-white/70">{exp.text}</p>
        </div>
    );
};

/* ── Timeline Step ───────────────────────────────────────────────────────── */
const TimelineStep = ({ step, index, total }) => (
    <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black"
                style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                {index + 1}
            </div>
            {index < total - 1 && (
                <div className="w-px h-6 mt-1" style={{ background: "rgba(99,102,241,0.2)" }} />
            )}
        </div>
        <div className="pb-5">
            <p className="text-sm font-black text-slate-800 dark:text-white">{step.name}</p>
            <p className="text-[11px] text-slate-400 dark:text-white/35 mt-0.5">{step.description}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
                <Clock size={9} style={{ color: "#6366f1" }} />
                <span className="text-[10px] font-bold" style={{ color: "#6366f1" }}>{step.duration}</span>
            </div>
        </div>
    </div>
);

/* ── Question Row ────────────────────────────────────────────────────────── */
const QuestionRow = ({ q, isSolved, onToggle, isBookmarked, onBookmark }) => {
    const leetcodeUrl = `https://leetcode.com/problems/${q.title.toLowerCase().replace(/\s+/g, "-")}/`;
    const diffStyle = {
        Hard: { bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)", color: "#f43f5e" },
        Medium: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: "#f59e0b" },
        Easy: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", color: "#10b981" },
    }[q.difficulty] || {};

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="group flex items-center gap-4 p-4 rounded-[20px] transition-all duration-200"
            style={isSolved ? {
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.2)",
            } : {
                background: "var(--row-bg, rgba(0,0,0,0.02))",
                border: "1px solid transparent",
            }}
            onMouseEnter={e => !isSolved && (e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)")}
            onMouseLeave={e => !isSolved && (e.currentTarget.style.borderColor = "transparent")}
        >
            {/* Toggle */}
            <button
                onClick={() => onToggle(q.title)}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-400"
                style={isSolved ? {
                    background: "linear-gradient(135deg,#10b981,#059669)",
                    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                    color: "#fff",
                } : {
                    background: "var(--card-bg, #fff)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    color: "#cbd5e1",
                }}>
                <CheckCircle2 size={18} />
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate transition-all ${isSolved ? "line-through opacity-40 text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-white"
                    }`}>{q.title}</h4>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: "#6366f1" }}>{q.topic}</span>
                    {q.frequency && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/15" />
                            <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5">
                                <TrendingUp size={8} /> {q.frequency}% asked
                            </span>
                        </>
                    )}
                    {q.pattern && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/15" />
                            <span className="text-[9px] font-medium text-slate-400 dark:text-white/25">{q.pattern}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 shrink-0">
                <span className="text-[9px] font-black px-2.5 py-1 rounded-lg"
                    style={{ background: diffStyle.bg, border: `1px solid ${diffStyle.border}`, color: diffStyle.color }}>
                    {q.difficulty}
                </span>
                <div className="flex gap-1.5 pl-3" style={{ borderLeft: "1px solid rgba(0,0,0,0.07)" }}>
                    <a href={leetcodeUrl} target="_blank" rel="noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-500 transition-all hover:scale-110"
                        style={{ background: "var(--card-bg, #fff)", border: "1px solid rgba(0,0,0,0.07)" }}>
                        <ExternalLink size={13} />
                    </a>
                    <button
                        onClick={() => onBookmark(q.title)}
                        className="p-2 rounded-xl transition-all hover:scale-110"
                        style={isBookmarked ? {
                            background: "rgba(244,63,94,0.08)",
                            border: "1px solid rgba(244,63,94,0.2)",
                            color: "#f43f5e",
                        } : {
                            background: "var(--card-bg, #fff)",
                            border: "1px solid rgba(0,0,0,0.07)",
                            color: "#94a3b8",
                        }}>
                        <Bookmark size={13} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/* ══ MAIN COMPONENT ══════════════════════════════════════════════════════════ */
export default function CompanyDetails({ company, onBack }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [topicFilter, setTopicFilter] = useState("All");
    const [activeTab, setActiveTab] = useState("questions");

    const [solvedQuestions, setSolvedQuestions] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`solved_${company?.id}`) || "[]"); } catch { return []; }
    });
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`bookmarked_${company?.id}`) || "[]"); } catch { return []; }
    });

    useEffect(() => {
        if (company?.id) localStorage.setItem(`solved_${company.id}`, JSON.stringify(solvedQuestions));
    }, [solvedQuestions, company?.id]);
    useEffect(() => {
        if (company?.id) localStorage.setItem(`bookmarked_${company.id}`, JSON.stringify(bookmarkedQuestions));
    }, [bookmarkedQuestions, company?.id]);

    const toggleSolved = t => setSolvedQuestions(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
    const toggleBookmark = t => setBookmarkedQuestions(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

    const allTopics = useMemo(() => {
        if (!company?.questions) return [];
        return ["All", ...new Set(company.questions.map(q => q.topic))];
    }, [company?.questions]);

    const filtered = useMemo(() => {
        if (!company?.questions) return [];
        return company.questions.filter(q => {
            return q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (difficultyFilter === "All" || q.difficulty === difficultyFilter) &&
                (topicFilter === "All" || q.topic === topicFilter);
        });
    }, [company?.questions, searchQuery, difficultyFilter, topicFilter]);

    const solvedCount = solvedQuestions.filter(t => company?.questions?.some(q => q.title === t)).length;
    const totalQ = company?.questions?.length || 0;
    const progress = totalQ > 0 ? Math.round((solvedCount / totalQ) * 100) : 0;
    const easyCount = company?.questions?.filter(q => q.difficulty === "Easy").length || 0;
    const medCount = company?.questions?.filter(q => q.difficulty === "Medium").length || 0;
    const hardCount = company?.questions?.filter(q => q.difficulty === "Hard").length || 0;

    if (!company) return null;

    const tabs = [
        { id: "questions", label: "Question Bank", icon: <Code2 size={14} /> },
        { id: "process", label: "Interview Process", icon: <GitBranch size={14} /> },
        { id: "intel", label: "Topic Intel", icon: <BarChart3 size={14} /> },
        { id: "experiences", label: "Experiences", icon: <MessageSquare size={14} /> },
    ];

    return (
        <div className="pb-24 text-left">

            {/* ── Top Nav ── */}
            <div className="flex justify-between items-center mb-8">
                <motion.button
                    onClick={onBack}
                    whileHover={{ x: -3 }}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 font-bold text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Companies
                </motion.button>

                {/* Prep Score */}
                <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl"
                    style={{
                        background: "var(--card-bg, #fff)",
                        border: "1px solid var(--card-border, rgba(0,0,0,0.07))",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
                    }}>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">Prep Score</p>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{progress}%</p>
                        <p className="text-[9px] text-slate-400">{solvedCount}/{totalQ} solved</p>
                    </div>
                    <div className="relative w-11 h-11">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                            <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-slate-100 dark:text-white/5" />
                            <circle cx="22" cy="22" r="18" stroke="#6366f1" strokeWidth="3.5" fill="transparent"
                                strokeDasharray="113" strokeDashoffset={113 - (progress / 100) * 113}
                                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.7s ease" }} />
                        </svg>
                        <Zap size={12} style={{ color: "#6366f1" }} className="absolute inset-0 m-auto" />
                    </div>
                </div>
            </div>

            {/* ── Hero ── */}
            <div className="relative rounded-[36px] overflow-hidden mb-8 shadow-2xl"
                style={{ background: "linear-gradient(135deg,#0f0f1a 0%,#1a1040 50%,#0f1520 100%)" }}>
                {/* BG blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
                        style={{ background: company.color, filter: "blur(80px)" }} />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15"
                        style={{ background: "#7c3aed", filter: "blur(70px)" }} />
                </div>

                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

                <div className="relative z-10 p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-7">
                        {/* Logo */}
                        <div className="w-16 h-16 shrink-0 rounded-[20px] overflow-hidden flex items-center justify-center p-3 backdrop-blur-md"
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                boxShadow: `0 8px 32px rgba(0,0,0,0.3)`
                            }}>
                            <img src={company.logo} alt={company.name}
                                className="w-full h-full object-contain brightness-0 invert"
                                onError={e => e.target.style.opacity = 0} />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                                    style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                                    {company.category}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                                    style={{ background: "rgba(244,63,94,0.2)", color: "#fca5a5", border: "1px solid rgba(244,63,94,0.3)" }}>
                                    Level: {company.difficulty}
                                </span>
                                {company.isHiring && (
                                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                        style={{ background: "rgba(16,185,129,0.2)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)" }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Actively Hiring
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tighter mb-3">
                                {company.name}
                            </h1>
                            <p className="text-white/45 text-sm max-w-lg leading-relaxed">{
                                company.description || "One of the most sought-after companies for technical roles."
                            }</p>
                        </div>

                        {/* Quick stats */}
                        <div className="flex md:flex-col gap-2.5 shrink-0">
                            {[
                                { val: company.rating || "4.2", sub: "Rating" },
                                { val: company.employees || "10k+", sub: "Employees" },
                            ].map(s => (
                                <div key={s.sub} className="text-center px-5 py-3 rounded-2xl"
                                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <p className="text-2xl font-black text-white">{s.val}</p>
                                    <p className="text-[9px] text-white/35 font-bold uppercase tracking-wider">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                        <StatCard label="Avg. Rounds" value={company.rounds} icon={<Target />} accent="#6366f1" />
                        <StatCard label="Salary (LPA)" value={company.salary} icon={<Briefcase />} accent="#10b981" />
                        <StatCard label="Acceptance" value={company.acceptance} icon={<PieChart />} accent="#f43f5e" />
                        <StatCard label="Questions" value={totalQ} icon={<Code2 />} accent="#f59e0b" />
                    </div>
                </div>
            </div>

            {/* ── Difficulty Overview ── */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { label: "Easy", count: easyCount, pct: company.difficultySplit?.easy, color: "#10b981", border: "rgba(16,185,129,0.25)", bg: "rgba(16,185,129,0.06)" },
                    { label: "Medium", count: medCount, pct: company.difficultySplit?.medium, color: "#f59e0b", border: "rgba(245,158,11,0.25)", bg: "rgba(245,158,11,0.06)" },
                    { label: "Hard", count: hardCount, pct: company.difficultySplit?.hard, color: "#f43f5e", border: "rgba(244,63,94,0.25)", bg: "rgba(244,63,94,0.06)" },
                ].map(d => (
                    <motion.div
                        key={d.label}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setDifficultyFilter(p => p === d.label ? "All" : d.label)}
                        className="p-5 rounded-[24px] cursor-pointer transition-all"
                        style={{
                            background: difficultyFilter === d.label ? `${d.color}18` : d.bg,
                            border: `1px solid ${difficultyFilter === d.label ? d.color : d.border}`,
                            boxShadow: difficultyFilter === d.label ? `0 4px 20px ${d.color}20` : "none",
                        }}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: d.color }}>{d.label}</span>
                            <span className="text-[10px] font-black" style={{ color: d.color }}>{d.pct}%</span>
                        </div>
                        <p className="text-3xl font-black mb-2" style={{ color: d.color }}>{d.count}</p>
                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${d.pct}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ background: d.color }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200"
                        style={activeTab === tab.id ? {
                            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                            color: "#fff",
                            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                            border: "1px solid transparent",
                        } : {
                            background: "var(--pill-bg, rgba(0,0,0,0.04))",
                            color: "var(--pill-text, #94a3b8)",
                            border: "1px solid var(--pill-border, rgba(0,0,0,0.08))",
                        }}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ══ TAB CONTENT ══════════════════════════════════════════════════ */}
            <AnimatePresence mode="wait">

                {/* QUESTION BANK */}
                {activeTab === "questions" && (
                    <motion.div key="questions"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="rounded-[32px] p-7"
                            style={{
                                background: "var(--card-bg, #fff)",
                                border: "1px solid var(--card-border, rgba(0,0,0,0.07))",
                                boxShadow: "0 2px 20px rgba(0,0,0,0.04)"
                            }}>
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-3 mb-7">
                                <div className="relative flex-1">
                                    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search problems…"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none transition-all dark:text-white placeholder-slate-400"
                                        style={{
                                            background: "var(--input-bg, rgba(0,0,0,0.04))",
                                            border: "1px solid var(--input-border, rgba(0,0,0,0.08))",
                                        }}
                                    />
                                </div>
                                {[
                                    { val: difficultyFilter, set: setDifficultyFilter, opts: ["All", "Easy", "Medium", "Hard"] },
                                    { val: topicFilter, set: setTopicFilter, opts: allTopics },
                                ].map((sel, i) => (
                                    <select key={i}
                                        value={sel.val}
                                        onChange={e => sel.set(e.target.value)}
                                        className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none cursor-pointer dark:text-white transition-all"
                                        style={{
                                            background: "var(--input-bg, rgba(0,0,0,0.04))",
                                            border: "1px solid var(--input-border, rgba(0,0,0,0.08))",
                                            color: "var(--pill-text, #64748b)",
                                        }}>
                                        {sel.opts.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                ))}
                            </div>

                            {/* Meta row */}
                            <div className="flex items-center gap-4 mb-5 px-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{filtered.length} results</span>
                                {bookmarkedQuestions.length > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-rose-500">
                                        <Bookmark size={11} /> {bookmarkedQuestions.length} bookmarked
                                    </span>
                                )}
                                <button
                                    onClick={() => { setSearchQuery(""); setDifficultyFilter("All"); setTopicFilter("All"); }}
                                    className="ml-auto text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors">
                                    Clear filters
                                </button>
                            </div>

                            {/* Questions */}
                            <div className="space-y-2.5">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map(q => (
                                        <QuestionRow
                                            key={q.title} q={q}
                                            isSolved={solvedQuestions.includes(q.title)}
                                            onToggle={toggleSolved}
                                            isBookmarked={bookmarkedQuestions.includes(q.title)}
                                            onBookmark={toggleBookmark}
                                        />
                                    ))}
                                </AnimatePresence>
                                {filtered.length === 0 && (
                                    <div className="text-center py-16 rounded-[24px]"
                                        style={{ background: "rgba(0,0,0,0.02)", border: "2px dashed rgba(0,0,0,0.07)" }}>
                                        <XCircle size={28} className="text-slate-300 dark:text-white/15 mx-auto mb-3" />
                                        <p className="text-slate-400 dark:text-white/25 font-black uppercase tracking-widest text-xs">No questions match</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* INTERVIEW PROCESS */}
                {activeTab === "process" && (
                    <motion.div key="process"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Timeline */}
                        <div className="rounded-[32px] p-8"
                            style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-7 flex items-center gap-2.5">
                                <GitBranch size={18} style={{ color: "#6366f1" }} /> Interview Rounds
                            </h3>
                            {(company.interviewProcess || [
                                { name: "Online Assessment", description: "2 LeetCode-style problems + MCQs", duration: "90 min" },
                                { name: "Technical Round 1", description: "DSA & Problem Solving", duration: "60 min" },
                                { name: "Technical Round 2", description: "System Design & CS Fundamentals", duration: "60 min" },
                                { name: "HR Round", description: "Culture fit & compensation", duration: "30–45 min" },
                            ]).map((step, i, arr) => (
                                <TimelineStep key={i} step={step} index={i} total={arr.length} />
                            ))}
                        </div>

                        <div className="space-y-5">
                            {/* AI Strategy */}
                            <div className="rounded-[32px] p-8 relative overflow-hidden"
                                style={{ background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)" }}>
                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
                                <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2.5 relative z-10">
                                    <BrainCircuit size={18} /> AI Strategy
                                </h3>
                                <div className="space-y-2.5 relative z-10">
                                    <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                        <p className="text-sm font-bold text-white/90 leading-relaxed">
                                            {(company.difficultySplit?.hard || 0) > 30
                                                ? "⚠️ High Hard ratio — master DP, Graphs & Advanced Trees before applying."
                                                : "🚀 Medium-heavy — nail time complexity first. Most rejections happen here."}
                                        </p>
                                    </div>
                                    {(company.insights || []).slice(0, 3).map((ins, i) => (
                                        <div key={i} className="flex gap-3 items-start p-3.5 rounded-2xl"
                                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5"
                                                style={{ color: "#4f46e5" }}>{i + 1}</div>
                                            <p className="text-xs font-semibold text-white/80 leading-relaxed">{ins}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* What they look for */}
                            <div className="rounded-[32px] p-7"
                                style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))" }}>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                                    <Shield size={15} style={{ color: "#6366f1" }} /> What They Look For
                                </h3>
                                <div className="space-y-2">
                                    {(company.requirements || [
                                        "Strong DSA fundamentals",
                                        "Clean code & communication",
                                        "CS core (OS, DBMS, CN)",
                                        "Prior projects or internships",
                                    ]).map((req, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{ background: "var(--row-bg, rgba(0,0,0,0.03))" }}>
                                            <CheckCircle2 size={13} style={{ color: "#6366f1" }} className="shrink-0" />
                                            <span className="text-xs font-semibold text-slate-600 dark:text-white/60">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TOPIC INTEL */}
                {activeTab === "intel" && (
                    <motion.div key="intel"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Topic frequency */}
                        <div className="rounded-[32px] p-8"
                            style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-7 flex items-center gap-2.5">
                                <BarChart3 size={18} style={{ color: "#6366f1" }} /> Topic Frequency
                            </h3>
                            <div className="grid gap-2.5">
                                {(company.topicFrequency || []).map((t, i) => (
                                    <TopicChip key={t.name} name={t.name} value={t.value} rank={i} />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Study Roadmap */}
                            <div className="rounded-[32px] p-8"
                                style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))" }}>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2.5">
                                    <BookOpen size={18} style={{ color: "#6366f1" }} /> Study Roadmap
                                </h3>
                                <div className="space-y-2.5">
                                    {(company.studyPlan || [
                                        { week: "Week 1–2", focus: "Arrays, Strings & Hashing", priority: "Critical" },
                                        { week: "Week 3–4", focus: "Trees, Graphs & BFS/DFS", priority: "High" },
                                        { week: "Week 5", focus: "Dynamic Programming Patterns", priority: "High" },
                                        { week: "Week 6", focus: "System Design Basics", priority: "Medium" },
                                    ]).map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl"
                                            style={{ background: "var(--row-bg, rgba(0,0,0,0.03))" }}>
                                            <div className="shrink-0 min-w-[72px]">
                                                <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: "#6366f1" }}>{item.week}</p>
                                            </div>
                                            <p className="flex-1 text-xs font-black text-slate-700 dark:text-white">{item.focus}</p>
                                            <span className="text-[8px] font-black uppercase px-2 py-1 rounded-lg whitespace-nowrap"
                                                style={item.priority === "Critical"
                                                    ? { background: "rgba(244,63,94,0.1)", color: "#f43f5e" }
                                                    : item.priority === "High"
                                                        ? { background: "rgba(245,158,11,0.1)", color: "#f59e0b" }
                                                        : { background: "rgba(0,0,0,0.05)", color: "#94a3b8" }}>
                                                {item.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty Mix */}
                            <div className="rounded-[32px] p-7"
                                style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))" }}>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-5">Difficulty Mix</h3>
                                <div className="space-y-4">
                                    <DiffBar label="Easy" percent={company.difficultySplit?.easy} count={easyCount} color="#10b981" />
                                    <DiffBar label="Medium" percent={company.difficultySplit?.medium} count={medCount} color="#f59e0b" />
                                    <DiffBar label="Hard" percent={company.difficultySplit?.hard} count={hardCount} color="#f43f5e" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* EXPERIENCES */}
                {activeTab === "experiences" && (
                    <motion.div key="experiences"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Experiences */}
                            <div className="rounded-[32px] p-8"
                                style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2.5">
                                    <MessageSquare size={18} style={{ color: "#6366f1" }} /> Candidate Experiences
                                </h3>
                                <div className="space-y-3">
                                    {(company.experiences || [
                                        { text: "The interviewers were helpful and gave hints when stuck.", sentiment: "Positive" },
                                        { text: "OA was straightforward but the technical round had a surprise system design question.", sentiment: "Neutral" },
                                        { text: "Process was long — 5 rounds over 2 weeks. Be prepared.", sentiment: "Neutral" },
                                        { text: "Great culture and HR was transparent about the offer timeline.", sentiment: "Positive" },
                                    ]).map((exp, i) => <ExpBadge key={i} exp={exp} />)}
                                </div>
                            </div>

                            <div className="space-y-5">
                                {/* Offer Stats */}
                                <div className="rounded-[32px] p-8"
                                    style={{ background: "var(--card-bg, #fff)", border: "1px solid var(--card-border, rgba(0,0,0,0.07))" }}>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2.5">
                                        <Trophy size={18} style={{ color: "#f59e0b" }} /> Offer Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Offer Rate", value: company.acceptance, icon: <Award size={16} />, color: "#f59e0b" },
                                            { label: "Avg. CTC", value: company.salary, icon: <Briefcase size={16} />, color: "#10b981" },
                                            { label: "Avg. Rounds", value: company.rounds, icon: <Target size={16} />, color: "#6366f1" },
                                            { label: "Process Days", value: company.processDays || "14–21", icon: <Calendar size={16} />, color: "#f43f5e" },
                                        ].map(s => (
                                            <div key={s.label} className="p-4 rounded-2xl"
                                                style={{ background: "var(--row-bg, rgba(0,0,0,0.03))" }}>
                                                {React.cloneElement(s.icon, { color: s.color })}
                                                <p className="text-2xl font-black text-slate-800 dark:text-white mt-2">{s.value}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pitfalls */}
                                <div className="rounded-[32px] p-7"
                                    style={{
                                        background: "linear-gradient(135deg,rgba(245,158,11,0.06),rgba(249,115,22,0.04))",
                                        border: "1px solid rgba(245,158,11,0.2)"
                                    }}>
                                    <h3 className="text-sm font-black text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                                        <AlertTriangle size={14} /> Common Pitfalls
                                    </h3>
                                    <div className="space-y-2">
                                        {(company.pitfalls || [
                                            "Not explaining thought process while coding",
                                            "Skipping edge cases in solutions",
                                            "Not asking clarifying questions upfront",
                                        ]).map((p, i) => (
                                            <div key={i} className="flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400/80 font-semibold">
                                                <ChevronRight size={13} className="shrink-0 mt-0.5" /> {p}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}