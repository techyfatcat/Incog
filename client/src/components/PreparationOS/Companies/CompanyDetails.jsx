import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    ArrowLeft, Target, Briefcase, PieChart, BarChart3,
    BrainCircuit, Sparkles, CheckCircle2, ExternalLink,
    Zap, Bookmark, Search, Clock, Users, TrendingUp,
    Award, Code2, ChevronRight, Star, Calendar,
    BookOpen, MessageSquare, ThumbsUp, AlertTriangle,
    Shield, Coffee, Layers, GitBranch, Terminal, Trophy,
    Info, XCircle
} from 'lucide-react';

// ─── Animated Counter ───────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = "", duration = 1.5 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const num = parseFloat(target);
        if (isNaN(num)) { setCount(target); return; }
        let start = 0;
        const step = num / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= num) { setCount(num); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, target, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, gradient, suffix }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`relative overflow-hidden rounded-3xl p-6 border ${gradient}`}
    >
        <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm">{icon}</div>
            <div className="w-1.5 h-8 rounded-full bg-white/20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">{label}</p>
        <p className="text-3xl font-black text-white leading-none">
            <AnimatedCounter target={value} suffix={suffix || ""} />
        </p>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
    </motion.div>
);

// ─── Difficulty Bar ──────────────────────────────────────────────────────────
const DifficultyBar = ({ label, percent, color, count }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
            <span className="text-slate-400 dark:text-white/40">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-white/30 font-medium normal-case">{count} qs</span>
                <span className="dark:text-white text-slate-700">{percent}%</span>
            </div>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    </div>
);

// ─── Topic Chip ──────────────────────────────────────────────────────────────
const TopicChip = ({ name, value, rank }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: rank * 0.05 }}
        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all group"
    >
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xs font-black text-indigo-500">
            #{rank + 1}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-black dark:text-white text-slate-700 truncate">{name}</p>
            <div className="h-1 mt-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: rank * 0.05 + 0.3 }}
                    className="h-full bg-indigo-500 rounded-full"
                />
            </div>
        </div>
        <span className="text-xs font-black text-indigo-500 shrink-0">{value}%</span>
    </motion.div>
);

// ─── Experience Badge ────────────────────────────────────────────────────────
const ExperienceBadge = ({ exp }) => {
    const colors = {
        Positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        Neutral: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        Negative: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
    const icons = {
        Positive: <ThumbsUp size={12} />,
        Neutral: <Info size={12} />,
        Negative: <AlertTriangle size={12} />,
    };
    return (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${colors[exp.sentiment]}`}>
            <div className="mt-0.5 shrink-0">{icons[exp.sentiment]}</div>
            <p className="text-xs font-semibold leading-relaxed">{exp.text}</p>
        </div>
    );
};

// ─── Timeline Step ───────────────────────────────────────────────────────────
const TimelineStep = ({ step, index, total }) => (
    <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-500/30">
                {index + 1}
            </div>
            {index < total - 1 && <div className="w-0.5 h-6 bg-indigo-500/20 mt-1" />}
        </div>
        <div className="pb-6">
            <p className="text-sm font-black dark:text-white text-slate-700">{step.name}</p>
            <p className="text-[11px] text-slate-400 dark:text-white/40 mt-0.5">{step.description}</p>
            <div className="flex items-center gap-2 mt-2">
                <Clock size={10} className="text-indigo-500" />
                <span className="text-[10px] font-bold text-indigo-500">{step.duration}</span>
            </div>
        </div>
    </div>
);

// ─── Question Row ─────────────────────────────────────────────────────────────
const QuestionRow = ({ q, isSolved, onToggle, isBookmarked, onBookmark }) => {
    const leetcodeUrl = `https://leetcode.com/problems/${q.title.toLowerCase().replace(/\s+/g, "-")}/`;
    const diffStyle = {
        Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`group flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-300 ${isSolved
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-slate-50 dark:bg-white/[0.03] border-transparent hover:border-indigo-500/20"
                }`}
        >
            {/* Solved Toggle */}
            <button
                onClick={() => onToggle(q.title)}
                className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSolved
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-white dark:bg-white/5 text-slate-300 dark:text-white/20 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40"
                    }`}
            >
                <CheckCircle2 size={20} />
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate transition-all ${isSolved ? "text-emerald-600 dark:text-emerald-400 line-through opacity-50" : "dark:text-white text-slate-800"
                    }`}>{q.title}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">{q.topic}</span>
                    {q.frequency && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                            <div className="flex items-center gap-1">
                                <TrendingUp size={10} className="text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-500">{q.frequency}% asked</span>
                            </div>
                        </>
                    )}
                    {q.pattern && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                            <span className="text-[10px] font-medium text-slate-400 dark:text-white/30">{q.pattern}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${diffStyle[q.difficulty]}`}>
                    {q.difficulty}
                </span>
                <div className="flex gap-1.5 pl-3 border-l border-slate-200 dark:border-white/10">
                    <a
                        href={leetcodeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white dark:bg-white/5 rounded-xl text-slate-400 hover:text-indigo-500 transition-all hover:scale-110 border border-slate-100 dark:border-white/5"
                    >
                        <ExternalLink size={15} />
                    </a>
                    <button
                        onClick={() => onBookmark(q.title)}
                        className={`p-2 rounded-xl transition-all hover:scale-110 border ${isBookmarked
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : "bg-white dark:bg-white/5 text-slate-400 hover:text-rose-500 border-slate-100 dark:border-white/5"
                            }`}
                    >
                        <Bookmark size={15} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CompanyDetails({ company, onBack }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [topicFilter, setTopicFilter] = useState("All");
    const [activeTab, setActiveTab] = useState("questions"); // questions | process | intel | experiences
    const [solvedQuestions, setSolvedQuestions] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`solved_${company?.id}`) || "[]"); } catch { return []; }
    });
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`bookmarked_${company?.id}`) || "[]"); } catch { return []; }
    });

    useEffect(() => {
        if (company?.id) {
            localStorage.setItem(`solved_${company.id}`, JSON.stringify(solvedQuestions));
        }
    }, [solvedQuestions, company?.id]);

    useEffect(() => {
        if (company?.id) {
            localStorage.setItem(`bookmarked_${company.id}`, JSON.stringify(bookmarkedQuestions));
        }
    }, [bookmarkedQuestions, company?.id]);

    const toggleSolved = (title) =>
        setSolvedQuestions(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);

    const toggleBookmark = (title) =>
        setBookmarkedQuestions(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);

    const allTopics = useMemo(() => {
        if (!company?.questions) return [];
        return ["All", ...new Set(company.questions.map(q => q.topic))];
    }, [company?.questions]);

    const filteredQuestions = useMemo(() => {
        if (!company?.questions) return [];
        return company.questions.filter(q => {
            const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchDiff = difficultyFilter === "All" || q.difficulty === difficultyFilter;
            const matchTopic = topicFilter === "All" || q.topic === topicFilter;
            return matchSearch && matchDiff && matchTopic;
        });
    }, [company?.questions, searchQuery, difficultyFilter, topicFilter]);

    const solvedCount = solvedQuestions.filter(t => company?.questions?.some(q => q.title === t)).length;
    const totalQuestions = company?.questions?.length || 0;
    const progress = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
    const easyCount = company?.questions?.filter(q => q.difficulty === "Easy").length || 0;
    const medCount = company?.questions?.filter(q => q.difficulty === "Medium").length || 0;
    const hardCount = company?.questions?.filter(q => q.difficulty === "Hard").length || 0;

    if (!company) return null;

    const tabs = [
        { id: "questions", label: "Question Bank", icon: <Code2 size={15} /> },
        { id: "process", label: "Interview Process", icon: <GitBranch size={15} /> },
        { id: "intel", label: "Topic Intel", icon: <BarChart3 size={15} /> },
        { id: "experiences", label: "Experiences", icon: <MessageSquare size={15} /> },
    ];

    return (
        <div className="pb-24 text-left">
            {/* ── Top Nav ── */}
            <div className="flex justify-between items-center mb-10">
                <motion.button
                    onClick={onBack}
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 font-bold text-sm transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Companies
                </motion.button>

                {/* Prep Score Ring */}
                <div className="flex items-center gap-4 bg-white dark:bg-white/5 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Prep Score</p>
                        <p className="text-sm font-black dark:text-white">{progress}%</p>
                        <p className="text-[9px] text-slate-400">{solvedCount}/{totalQuestions} solved</p>
                    </div>
                    <div className="relative w-12 h-12">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-white/5" />
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray="125.6"
                                strokeDashoffset={125.6 - (progress / 100) * 125.6}
                                strokeLinecap="round"
                                className="text-indigo-500 transition-all duration-700"
                            />
                        </svg>
                        <Zap size={14} className="text-indigo-500 absolute inset-0 m-auto" />
                    </div>
                </div>
            </div>

            {/* ── Hero Header ── */}
            <div className="relative rounded-[40px] overflow-hidden mb-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/5 shadow-2xl">
                {/* BG decoration */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-700 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="relative z-10 p-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        {/* Logo */}
                        <div className="w-20 h-20 shrink-0 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 flex items-center justify-center shadow-2xl overflow-hidden p-4">
                            <img src={company.logo} alt={company.name} className="w-full h-full object-contain brightness-0 invert" />
                        </div>

                        {/* Title Block */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{company.category}</span>
                                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Level: {company.difficulty}</span>
                                {company.isHiring && (
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Actively Hiring
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter mb-3">{company.name}</h1>
                            <p className="text-white/50 text-sm max-w-xl leading-relaxed">{company.description || "One of the most sought-after companies for technical roles. Known for rigorous interviews and competitive compensation."}</p>
                        </div>

                        {/* Quick Stats Vertical */}
                        <div className="flex md:flex-col gap-3">
                            <div className="text-center px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-2xl font-black text-white">{company.rating || "4.2"}</p>
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Rating</p>
                            </div>
                            <div className="text-center px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-2xl font-black text-white">{company.employees || "10k+"}</p>
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Employees</p>
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <StatCard label="Avg. Rounds" value={company.rounds} icon={<Target size={18} className="text-white/80" />} gradient="bg-indigo-600/30 border-indigo-500/20" />
                        <StatCard label="Salary (LPA)" value={company.salary} icon={<Briefcase size={18} className="text-white/80" />} gradient="bg-emerald-600/30 border-emerald-500/20" />
                        <StatCard label="Acceptance" value={company.acceptance} icon={<PieChart size={18} className="text-white/80" />} gradient="bg-rose-600/30 border-rose-500/20" />
                        <StatCard label="Questions" value={totalQuestions} icon={<Code2 size={18} className="text-white/80" />} gradient="bg-amber-600/30 border-amber-500/20" />
                    </div>
                </div>
            </div>

            {/* ── Difficulty Overview Strip ── */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Easy", count: easyCount, percent: company.difficultySplit?.easy, color: "bg-emerald-500", textColor: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Medium", count: medCount, percent: company.difficultySplit?.medium, color: "bg-amber-500", textColor: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
                    { label: "Hard", count: hardCount, percent: company.difficultySplit?.hard, color: "bg-rose-500", textColor: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
                ].map(d => (
                    <motion.div
                        key={d.label}
                        whileHover={{ scale: 1.02 }}
                        className={`p-5 rounded-3xl border ${d.bg} cursor-pointer`}
                        onClick={() => setDifficultyFilter(prev => prev === d.label ? "All" : d.label)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className={`text-xs font-black uppercase tracking-widest ${d.textColor}`}>{d.label}</span>
                            <span className={`text-[10px] font-black ${d.textColor}`}>{d.percent}%</span>
                        </div>
                        <p className={`text-3xl font-black ${d.textColor} mb-2`}>{d.count}</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${d.percent}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-full rounded-full ${d.color}`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                : "bg-white dark:bg-white/5 text-slate-500 dark:text-white/40 border border-slate-100 dark:border-white/10 hover:text-indigo-500"
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">

                {/* ══ QUESTION BANK TAB ══ */}
                {activeTab === "questions" && (
                    <motion.div key="questions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-8 shadow-sm">
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                    <input
                                        type="text"
                                        placeholder="Search problems..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-indigo-500/20 dark:text-white transition-all placeholder-slate-400"
                                    />
                                </div>
                                <select
                                    value={difficultyFilter}
                                    onChange={e => setDifficultyFilter(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-xs font-black outline-none cursor-pointer dark:text-white"
                                >
                                    <option value="All">All Difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <select
                                    value={topicFilter}
                                    onChange={e => setTopicFilter(e.target.value)}
                                    className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-xs font-black outline-none cursor-pointer dark:text-white"
                                >
                                    {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-6 mb-6 px-2">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{filteredQuestions.length} results</span>
                                {bookmarkedQuestions.length > 0 && (
                                    <button
                                        onClick={() => setTopicFilter("All")}
                                        className="flex items-center gap-1.5 text-[11px] font-black text-rose-500 hover:text-rose-600 transition-colors"
                                    >
                                        <Bookmark size={12} /> {bookmarkedQuestions.length} bookmarked
                                    </button>
                                )}
                                <button
                                    onClick={() => { setSearchQuery(""); setDifficultyFilter("All"); setTopicFilter("All"); }}
                                    className="ml-auto text-[11px] font-bold text-slate-400 hover:text-indigo-500 transition-colors"
                                >
                                    Clear filters
                                </button>
                            </div>

                            {/* Question List */}
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredQuestions.map((q, i) => (
                                        <QuestionRow
                                            key={q.title}
                                            q={q}
                                            isSolved={solvedQuestions.includes(q.title)}
                                            onToggle={toggleSolved}
                                            isBookmarked={bookmarkedQuestions.includes(q.title)}
                                            onBookmark={toggleBookmark}
                                        />
                                    ))}
                                </AnimatePresence>

                                {filteredQuestions.length === 0 && (
                                    <div className="text-center py-20 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                                        <XCircle size={32} className="text-slate-300 dark:text-white/20 mx-auto mb-3" />
                                        <p className="text-slate-400 dark:text-white/30 font-black uppercase tracking-widest text-xs">No questions match your filters</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══ INTERVIEW PROCESS TAB ══ */}
                {activeTab === "process" && (
                    <motion.div key="process" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Timeline */}
                        <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
                            <h3 className="text-xl font-black dark:text-white text-slate-800 mb-8 flex items-center gap-3">
                                <GitBranch className="text-indigo-500" size={22} /> Interview Rounds
                            </h3>
                            {(company.interviewProcess || [
                                { name: "Online Assessment", description: "2 LeetCode-style problems + MCQs", duration: "90 min" },
                                { name: "Technical Round 1", description: "DSA & Problem Solving", duration: "60 min" },
                                { name: "Technical Round 2", description: "System Design & CS Fundamentals", duration: "60 min" },
                                { name: "HR Round", description: "Culture fit & compensation discussion", duration: "30–45 min" },
                            ]).map((step, i, arr) => (
                                <TimelineStep key={i} step={step} index={i} total={arr.length} />
                            ))}
                        </div>

                        {/* Tips + Requirements */}
                        <div className="space-y-6">
                            <div className="bg-indigo-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full" />
                                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><BrainCircuit size={22} /> AI Strategy</h3>
                                <div className="space-y-3 relative z-10">
                                    <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                                        <p className="text-sm font-bold leading-relaxed">
                                            {company.difficultySplit?.hard > 30
                                                ? "⚠️ High Hard ratio — master DP, Graphs & Advanced Trees before applying."
                                                : "🚀 Medium-heavy — nail time complexity first. Most rejections happen here."}
                                        </p>
                                    </div>
                                    {(company.insights || []).slice(0, 3).map((insight, i) => (
                                        <div key={i} className="flex gap-3 items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="w-5 h-5 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</div>
                                            <p className="text-xs font-semibold leading-relaxed">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-8 shadow-sm">
                                <h3 className="text-base font-black dark:text-white text-slate-800 mb-5 flex items-center gap-2">
                                    <Shield size={18} className="text-indigo-500" /> What They Look For
                                </h3>
                                <div className="space-y-2">
                                    {(company.requirements || [
                                        "Strong DSA fundamentals",
                                        "Clean code & communication",
                                        "CS core knowledge (OS, DBMS, CN)",
                                        "Prior projects or internships",
                                    ]).map((req, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                            <CheckCircle2 size={15} className="text-indigo-500 shrink-0" />
                                            <span className="text-xs font-semibold dark:text-white/70 text-slate-600">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══ TOPIC INTEL TAB ══ */}
                {activeTab === "intel" && (
                    <motion.div key="intel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Topic Frequency */}
                        <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
                            <h3 className="text-xl font-black dark:text-white text-slate-800 mb-8 flex items-center gap-3">
                                <BarChart3 className="text-indigo-500" size={22} /> Topic Frequency
                            </h3>
                            <div className="grid gap-3">
                                {(company.topicFrequency || []).map((topic, i) => (
                                    <TopicChip key={topic.name} name={topic.name} value={topic.value} rank={i} />
                                ))}
                            </div>
                        </div>

                        {/* Recommended Resources */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
                                <h3 className="text-xl font-black dark:text-white text-slate-800 mb-8 flex items-center gap-3">
                                    <BookOpen className="text-indigo-500" size={22} /> Study Roadmap
                                </h3>
                                <div className="space-y-3">
                                    {(company.studyPlan || [
                                        { week: "Week 1–2", focus: "Arrays, Strings & Hashing", priority: "Critical" },
                                        { week: "Week 3–4", focus: "Trees, Graphs & BFS/DFS", priority: "High" },
                                        { week: "Week 5", focus: "Dynamic Programming Patterns", priority: "High" },
                                        { week: "Week 6", focus: "System Design Basics", priority: "Medium" },
                                    ]).map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                            <div className="text-center shrink-0">
                                                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">{item.week}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black dark:text-white text-slate-700">{item.focus}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${item.priority === "Critical" ? "bg-rose-500/10 text-rose-500" :
                                                    item.priority === "High" ? "bg-amber-500/10 text-amber-500" :
                                                        "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/30"
                                                }`}>{item.priority}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty Split Detail */}
                            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-8 shadow-sm">
                                <h3 className="text-base font-black dark:text-white text-slate-800 mb-6">Difficulty Mix</h3>
                                <div className="space-y-5">
                                    <DifficultyBar label="Easy" percent={company.difficultySplit?.easy} count={easyCount} color="bg-emerald-500" />
                                    <DifficultyBar label="Medium" percent={company.difficultySplit?.medium} count={medCount} color="bg-amber-500" />
                                    <DifficultyBar label="Hard" percent={company.difficultySplit?.hard} count={hardCount} color="bg-rose-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ══ EXPERIENCES TAB ══ */}
                {activeTab === "experiences" && (
                    <motion.div key="experiences" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
                                <h3 className="text-xl font-black dark:text-white text-slate-800 mb-8 flex items-center gap-3">
                                    <MessageSquare className="text-indigo-500" size={22} /> Candidate Experiences
                                </h3>
                                <div className="space-y-3">
                                    {(company.experiences || [
                                        { text: "The interviewers were helpful and gave hints when stuck. Great experience overall.", sentiment: "Positive" },
                                        { text: "OA was straightforward but the technical round had a surprise system design question.", sentiment: "Neutral" },
                                        { text: "The process was long — 5 rounds over 2 weeks. Be prepared for the wait.", sentiment: "Neutral" },
                                        { text: "Great company culture and the HR was very transparent about the offer timeline.", sentiment: "Positive" },
                                    ]).map((exp, i) => (
                                        <ExperienceBadge key={i} exp={exp} />
                                    ))}
                                </div>
                            </div>

                            {/* Interview Stats */}
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-slate-100 dark:border-white/5 p-10 shadow-sm">
                                    <h3 className="text-xl font-black dark:text-white text-slate-800 mb-8 flex items-center gap-3">
                                        <Trophy className="text-amber-500" size={22} /> Offer Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: "Offer Rate", value: company.acceptance, icon: <Award size={18} className="text-amber-500" /> },
                                            { label: "Avg. CTC", value: company.salary, icon: <Briefcase size={18} className="text-emerald-500" /> },
                                            { label: "Avg. Rounds", value: company.rounds, icon: <Target size={18} className="text-indigo-500" /> },
                                            { label: "Process Days", value: company.processDays || "14–21", icon: <Calendar size={18} className="text-rose-500" /> },
                                        ].map(s => (
                                            <div key={s.label} className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                                {s.icon}
                                                <p className="text-2xl font-black dark:text-white text-slate-800 mt-2">{s.value}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-[40px] border border-amber-200/50 dark:border-amber-500/20 p-8">
                                    <h3 className="text-base font-black text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                                        <AlertTriangle size={16} /> Common Pitfalls
                                    </h3>
                                    <div className="space-y-2">
                                        {(company.pitfalls || [
                                            "Not explaining thought process while coding",
                                            "Skipping edge cases in solutions",
                                            "Not asking clarifying questions upfront",
                                        ]).map((p, i) => (
                                            <div key={i} className="flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400/80 font-semibold">
                                                <ChevronRight size={14} className="shrink-0 mt-0.5" /> {p}
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