import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Target, Briefcase, PieChart, BarChart3,
    BrainCircuit, Sparkles, CheckCircle2, ExternalLink,
    Zap, Bookmark, Search, Filter
} from 'lucide-react';

// --- Sub-Components from the "Good" Overview ---
const StatBox = ({ label, value, icon, color = "dark:text-white" }) => (
    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[28px] border border-slate-100 dark:border-white/5">
        <div className="mb-4">{icon}</div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
);

const DifficultyRow = ({ label, percent, color }) => (
    <div className="space-y-2 text-left">
        <div className="flex justify-between text-[10px] font-black uppercase">
            <span className="text-slate-500">{label}</span>
            <span className="dark:text-white">{percent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={`h-full ${color}`} />
        </div>
    </div>
);

export default function CompanyIntelligence({ company, onBack }) {
    // --- Functional Logic (Filters & Persistence) ---
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [solvedQuestions, setSolvedQuestions] = useState(() => {
        const saved = localStorage.getItem(`solved_${company?.id}`);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (company?.id) {
            localStorage.setItem(`solved_${company.id}`, JSON.stringify(solvedQuestions));
        }
    }, [solvedQuestions, company?.id]);

    const toggleSolved = (title) => {
        setSolvedQuestions(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    const filteredQuestions = useMemo(() => {
        return company.questions.filter(q => {
            const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDiff = difficultyFilter === "All" || q.difficulty === difficultyFilter;
            return matchesSearch && matchesDiff;
        });
    }, [company.questions, searchQuery, difficultyFilter]);

    const progress = Math.round((solvedQuestions.length / company.questions.length) * 100);

    if (!company) return null;

    return (
        <div className="pb-20 text-left animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <button onClick={onBack} className="group flex items-center gap-2 text-slate-500 hover:text-indigo-500 font-bold transition-all">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Companies
                </button>

                {/* Preparation Score Indicator */}
                <div className="flex items-center gap-4 bg-white dark:bg-white/5 px-6 py-2 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prep Score</p>
                        <p className="text-sm font-black dark:text-white">{progress}%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-white/10 flex items-center justify-center relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100 dark:text-white/5" />
                            <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="106.8" strokeDashoffset={106.8 - (progress / 100) * 106.8} className="text-indigo-500 transition-all duration-700" />
                        </svg>
                        <Zap size={14} className="text-indigo-500" />
                    </div>
                </div>
            </div>

            {/* DASHBOARD HERO (Oversized & Premium) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-[40px] p-10 border border-white dark:border-white/10 shadow-xl">
                    <div className="flex items-center gap-8 mb-10">
                        <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-600/40 p-5">
                            <img src={company.logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
                        </div>
                        <div>
                            <h1 className="text-6xl font-black dark:text-white leading-none mb-3 tracking-tighter">{company.name}</h1>
                            <div className="flex gap-3">
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-xs font-black uppercase">{company.category}</span>
                                <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-black uppercase">Level: {company.difficulty}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <StatBox label="Avg. Rounds" value={company.rounds} icon={<Target size={20} className="text-indigo-500" />} />
                        <StatBox label="Salary (LPA)" value={company.salary} icon={<Briefcase size={20} className="text-emerald-500" />} />
                        <StatBox label="Acceptance" value={company.acceptance} icon={<PieChart size={20} className="text-rose-500" />} />
                    </div>
                </div>

                <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-white dark:border-white/10 shadow-xl">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Difficulty Mix</h4>
                    <div className="space-y-8">
                        <DifficultyRow label="Easy" percent={company.difficultySplit.easy} color="bg-emerald-500" />
                        <DifficultyRow label="Medium" percent={company.difficultySplit.medium} color="bg-amber-500" />
                        <DifficultyRow label="Hard" percent={company.difficultySplit.hard} color="bg-rose-500" />
                    </div>
                </div>
            </div>

            {/* TOPIC INTEL & STRATEGY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-white dark:bg-[#0a0a0a] rounded-[40px] p-10 border border-slate-200 dark:border-white/5">
                    <h3 className="text-2xl font-black mb-10 flex items-center gap-3 dark:text-white"><BarChart3 className="text-indigo-500" size={28} /> Topic Frequency</h3>
                    <div className="space-y-6">
                        {company.topicFrequency.map((topic, i) => (
                            <div key={topic.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black dark:text-white/80">{topic.name}</span>
                                    <span className="text-xs font-black text-indigo-500">{topic.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${topic.value}%` }} className="h-full bg-indigo-500 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                    <Sparkles className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12" size={250} />
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><BrainCircuit size={28} /> Strategic Insights</h3>
                    <div className="space-y-4 relative z-10">
                        {/* Dynamic Smart Insights based on data */}
                        <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <p className="text-sm font-bold leading-relaxed">
                                {company.difficultySplit.hard > 30
                                    ? "⚠️ Complex Problem Solving: This company prioritizes Hard-level LeetCode patterns. Master DP and Graphs."
                                    : "🚀 Efficiency is Key: Focus on optimizing O(n) solutions for Medium difficulty problems."}
                            </p>
                        </div>
                        {company.insights.slice(0, 2).map((insight, i) => (
                            <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                                <p className="text-sm font-bold leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* QUESTION BANK (Improved Functional UI) */}
            <div className="bg-white dark:bg-white/5 rounded-[40px] p-10 border border-white dark:border-white/10 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <h3 className="text-3xl font-black dark:text-white tracking-tight">Question Intelligence</h3>

                    {/* Integrated Search & Filter Row */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-indigo-500/20 transition-all dark:text-white"
                            />
                        </div>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer dark:text-white"
                        >
                            <option value="All">All Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredQuestions.map((q, idx) => {
                            const isSolved = solvedQuestions.includes(q.title);
                            const leetcodeUrl = `https://leetcode.com/problems/${q.title.toLowerCase().replace(/ /g, "-")}/`;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={q.title}
                                    className={`group flex items-center justify-between p-6 rounded-[28px] border transition-all duration-300 ${isSolved
                                        ? 'bg-emerald-500/5 border-emerald-500/20 shadow-inner'
                                        : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-indigo-500/20 shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => toggleSolved(q.title)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSolved
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 rotate-[360deg]'
                                                : 'bg-white dark:bg-white/10 text-slate-300 border border-slate-100 dark:border-white/5'
                                                }`}
                                        >
                                            <CheckCircle2 size={24} />
                                        </button>
                                        <div>
                                            <h4 className={`text-lg font-bold transition-all ${isSolved ? 'text-emerald-600 dark:text-emerald-400 opacity-60 line-through' : 'dark:text-white'}`}>
                                                {q.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{q.topic}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Frequently Asked</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl ${q.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-500' :
                                            q.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                        <div className="flex gap-2 border-l border-slate-200 dark:border-white/10 pl-6">
                                            <a href={leetcodeUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white dark:bg-white/5 rounded-xl text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 shadow-sm">
                                                <ExternalLink size={20} />
                                            </a>
                                            <button className="p-2.5 bg-white dark:bg-white/5 rounded-xl text-slate-400 hover:text-rose-500 transition-all hover:scale-110 shadow-sm">
                                                <Bookmark size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[40px] border border-dashed border-slate-300 dark:border-white/10">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No results found for your search</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}