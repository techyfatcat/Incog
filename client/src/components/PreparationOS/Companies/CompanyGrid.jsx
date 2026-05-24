import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Code2, Flame, Zap,
    ChevronDown, SlidersHorizontal, Building2,
} from 'lucide-react';
import CompanyCard from './CompanyCard';
import { COMPANIES, CATEGORIES, TIERS, DIFFICULTIES } from './DataEngine';

const DIFF_ORDER = { "Easy": 0, "Easy-Medium": 1, "Medium": 2, "Medium-Hard": 3, "Hard": 4 };

/* ── Pill ────────────────────────────────────────────────────────────────── */
const Pill = ({ label, active, onClick, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black
                    uppercase tracking-wider whitespace-nowrap transition-all duration-200
                    ${active
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-transparent'
                : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-500/30'
            }`}
    >
        {label}
        {count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black
                ${active ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/35'}`}>
                {count}
            </span>
        )}
    </button>
);

/* ── Hero Stat ───────────────────────────────────────────────────────────── */
const HeroStat = ({ icon, label, value, color }) => (
    <div className="flex items-center gap-3 p-4 rounded-2xl
                    bg-white dark:bg-[#13131f]
                    border border-slate-200 dark:border-white/[0.08]
                    shadow-sm hover:scale-[1.02] transition-transform duration-200">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}18` }}>
            {React.cloneElement(icon, { size: 15, color })}
        </div>
        <div>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
            <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
        </div>
    </div>
);

/* ── Sort Select ─────────────────────────────────────────────────────────── */
const SortSelect = ({ value, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl text-[10px] font-black uppercase
                       tracking-wider outline-none cursor-pointer transition-all
                       bg-slate-100 dark:bg-white/[0.06]
                       border border-slate-200 dark:border-white/[0.08]
                       text-slate-600 dark:text-white/50"
        >
            <option value="default">Default</option>
            <option value="name">A → Z</option>
            <option value="questions">Most Questions</option>
            <option value="difficulty-asc">Easiest First</option>
            <option value="difficulty-desc">Hardest First</option>
            <option value="salary">Highest Salary</option>
        </select>
        <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

/* ── Main Grid ───────────────────────────────────────────────────────────── */
export default function CompanyGrid({ onSelectCompany }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [tier, setTier] = useState("All");
    const [difficulty, setDifficulty] = useState("All");
    const [sort, setSort] = useState("default");
    const [showFilters, setShowFilters] = useState(false);
    const [activeOnly, setActiveOnly] = useState(false);
    const [solvedMap, setSolvedMap] = useState({});

    useEffect(() => {
        const map = {};
        COMPANIES.forEach(c => {
            try {
                const saved = JSON.parse(localStorage.getItem(`solved_${c.id}`) || "[]");
                map[c.id] = saved.filter(t => c.questions?.some(q => q.title === t)).length;
            } catch { map[c.id] = 0; }
        });
        setSolvedMap(map);
    }, []);

    const totalSolved = Object.values(solvedMap).reduce((a, b) => a + b, 0);
    const totalQuestions = COMPANIES.reduce((a, c) => a + (c.questionCount || 0), 0);
    const hiringCount = COMPANIES.filter(c => c.isHiring).length;

    const filtered = useMemo(() => {
        let list = COMPANIES.filter(c => {
            const s = search.toLowerCase();
            return (
                (c.name.toLowerCase().includes(s) || c.category.toLowerCase().includes(s)) &&
                (category === "All" || c.category === category) &&
                (tier === "All" || c.tier === tier) &&
                (difficulty === "All" || c.difficulty === difficulty) &&
                (!activeOnly || c.isHiring)
            );
        });

        // ── FIX: salary sort — was referencing undefined `s` ──
        switch (sort) {
            case "name":
                list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "questions":
                list.sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0));
                break;
            case "difficulty-asc":
                list.sort((a, b) => (DIFF_ORDER[a.difficulty] || 0) - (DIFF_ORDER[b.difficulty] || 0));
                break;
            case "difficulty-desc":
                list.sort((a, b) => (DIFF_ORDER[b.difficulty] || 0) - (DIFF_ORDER[a.difficulty] || 0));
                break;
            case "salary":
                list.sort((a, b) => {
                    const parse = str => parseInt((str || "0").split("–").pop().replace(/\D/g, "")) || 0;
                    return parse(b.salary) - parse(a.salary);
                });
                break;
            default:
                break;
        }
        return list;
    }, [search, category, tier, difficulty, sort, activeOnly]);

    const activeFilterCount = [
        category !== "All", tier !== "All", difficulty !== "All", activeOnly, !!search,
    ].filter(Boolean).length;
    const hasFilters = activeFilterCount > 0;

    const clearAll = () => {
        setSearch(""); setCategory("All"); setTier("All");
        setDifficulty("All"); setActiveOnly(false); setSort("default");
    };

    return (
        <div className="pb-24">

            {/* Page Header */}
            <div className="mb-10">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-3"
                >
                    Company Intelligence
                </motion.p>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none"
                    >
                        Interview Prep<br />
                        <span style={{
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"
                        }}>
                            Decoded.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs text-slate-400 dark:text-white/30 font-medium text-right max-w-[220px] hidden md:block leading-relaxed"
                    >
                        Real LeetCode questions · Sourced from{" "}
                        <a
                            href="https://github.com/snehasishroy/leetcode-companywise-interview-questions"
                            target="_blank" rel="noreferrer"
                            className="text-indigo-500 hover:underline"
                        >
                            snehasishroy/leetcode
                        </a>
                    </motion.p>
                </div>
            </div>

            {/* Stats Strip */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7"
            >
                <HeroStat icon={<Code2 />} label="Total Questions" value={totalQuestions} color="#6366f1" />
                <HeroStat icon={<Zap />} label="Problems Solved" value={totalSolved} color="#f59e0b" />
                <HeroStat icon={<Building2 />} label="Companies" value={COMPANIES.length} color="#10b981" />
                <HeroStat icon={<Flame />} label="Actively Hiring" value={hiringCount} color="#f43f5e" />
            </motion.div>

            {/* Search + Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="rounded-[22px] p-4 mb-6
                           bg-white dark:bg-[#13131f]
                           border border-slate-200 dark:border-white/[0.08]
                           shadow-sm"
            >
                <div className="flex gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search companies…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm font-semibold outline-none transition-all
                                       bg-slate-100 dark:bg-white/[0.05]
                                       border border-slate-200 dark:border-white/[0.08]
                                       text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/25
                                       focus:border-indigo-400 dark:focus:border-indigo-500/50"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white/60"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    <SortSelect value={sort} onChange={setSort} />

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(p => !p)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black
                                    uppercase tracking-wider transition-all shrink-0
                                    ${showFilters || hasFilters
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-transparent'
                                : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-white/40 border border-slate-200 dark:border-white/[0.08]'
                            }`}
                    >
                        <SlidersHorizontal size={13} />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-white/25 text-white text-[9px] font-black">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expandable filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 space-y-4
                                            border-t border-slate-100 dark:border-white/[0.07]">
                                {[
                                    {
                                        label: "Category", options: CATEGORIES,
                                        value: category, set: setCategory,
                                        count: c => c === "All"
                                            ? COMPANIES.length
                                            : COMPANIES.filter(co => co.category === c).length,
                                    },
                                    { label: "Tier", options: TIERS, value: tier, set: setTier },
                                    { label: "Difficulty", options: DIFFICULTIES, value: difficulty, set: setDifficulty },
                                ].map(group => (
                                    <div key={group.label}>
                                        <p className="text-[9px] font-black text-slate-400 dark:text-white/25
                                                       uppercase tracking-widest mb-2">
                                            {group.label}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {group.options.map(opt => (
                                                <Pill
                                                    key={opt}
                                                    label={opt}
                                                    active={group.value === opt}
                                                    onClick={() => group.set(opt)}
                                                    count={group.count ? group.count(opt) : undefined}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center gap-4 pt-1">
                                    <button
                                        onClick={() => setActiveOnly(p => !p)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black
                                                    uppercase tracking-wider transition-all
                                                    ${activeOnly
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30'
                                                : 'bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white/35 border border-slate-200 dark:border-white/[0.07]'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${activeOnly ? "bg-emerald-400 animate-pulse" : "bg-slate-300 dark:bg-white/20"
                                            }`} />
                                        Actively Hiring Only
                                    </button>

                                    {hasFilters && (
                                        <button
                                            onClick={clearAll}
                                            className="text-[10px] font-black text-rose-500 hover:text-rose-600
                                                       flex items-center gap-1 transition-colors ml-auto"
                                        >
                                            <X size={11} /> Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Results meta */}
            <div className="flex items-center justify-between mb-5 px-1">
                <p className="text-sm font-black text-slate-400 dark:text-white/30">
                    <span className="text-indigo-500">{filtered.length}</span>{" "}
                    {filtered.length === 1 ? "company" : "companies"}
                    {hasFilters && <span className="text-slate-400 dark:text-white/25"> (filtered)</span>}
                </p>
                {totalSolved > 0 && (
                    <p className="text-[11px] font-black text-emerald-500">
                        ✓ {totalSolved} solved across all companies
                    </p>
                )}
            </div>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((company, i) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.3 }}
                            >
                                <CompanyCard
                                    company={company}
                                    onClick={onSelectCompany}
                                    solvedCount={solvedMap[company.id] || 0}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 rounded-[28px]
                                   bg-slate-50 dark:bg-white/[0.02]
                                   border-2 border-dashed border-slate-200 dark:border-white/[0.07]"
                    >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                                        bg-slate-100 dark:bg-white/[0.05]">
                            <Search size={22} className="text-slate-300 dark:text-white/20" />
                        </div>
                        <p className="text-slate-400 dark:text-white/30 font-black uppercase tracking-widest text-xs mb-2">
                            No companies match
                        </p>
                        <p className="text-slate-300 dark:text-white/15 text-xs mb-6">
                            Try adjusting your filters
                        </p>
                        <button
                            onClick={clearAll}
                            className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider
                                       text-white transition-all hover:scale-105
                                       bg-indigo-600 shadow-md shadow-indigo-500/25"
                        >
                            Clear All Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}