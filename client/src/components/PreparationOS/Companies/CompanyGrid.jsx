import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, SlidersHorizontal, X, TrendingUp, Code2,
    Flame, Award, ChevronDown, LayoutGrid, List,
    Zap, Target, Filter
} from 'lucide-react';
import CompanyCard from './CompanyCard';
import { COMPANIES, CATEGORIES, TIERS, DIFFICULTIES } from './DataEngine';

// ─── Pill Filter Button ───────────────────────────────────────────────────────
const PillButton = ({ label, active, onClick, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "bg-white dark:bg-white/5 text-slate-500 dark:text-white/40 border border-slate-100 dark:border-white/10 hover:text-indigo-500 hover:border-indigo-500/30"
            }`}
    >
        {label}
        {count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${active ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
                {count}
            </span>
        )}
    </button>
);

// ─── Sort Select ──────────────────────────────────────────────────────────────
const SortSelect = ({ value, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-white/40 outline-none cursor-pointer hover:border-indigo-500/30 transition-all"
        >
            <option value="default">Default Order</option>
            <option value="name">A → Z</option>
            <option value="questions">Most Questions</option>
            <option value="difficulty-asc">Easiest First</option>
            <option value="difficulty-desc">Hardest First</option>
            <option value="salary">Highest Salary</option>
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

// ─── Hero Stats Strip ─────────────────────────────────────────────────────────
const HeroStat = ({ icon, label, value, sub }) => (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex-1 min-w-0">
        <div className="p-2 rounded-xl bg-indigo-500/10 shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-xl font-black dark:text-white text-slate-800 leading-none">{value}</p>
            <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest truncate">{label}</p>
        </div>
    </div>
);

// ─── Difficulty ordering for sort ─────────────────────────────────────────────
const DIFF_ORDER = { "Easy": 0, "Easy-Medium": 1, "Medium": 2, "Medium-Hard": 3, "Hard": 4 };

// ─── Main Grid ────────────────────────────────────────────────────────────────
export default function CompanyGrid({ onSelectCompany }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [tier, setTier] = useState("All");
    const [difficulty, setDifficulty] = useState("All");
    const [sort, setSort] = useState("default");
    const [showFilters, setShowFilters] = useState(false);
    const [activeOnly, setActiveOnly] = useState(false);

    // Load all solved counts from localStorage
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
            const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.category.toLowerCase().includes(search.toLowerCase());
            const matchCat = category === "All" || c.category === category;
            const matchTier = tier === "All" || c.tier === tier;
            const matchDiff = difficulty === "All" || c.difficulty === difficulty;
            const matchHire = !activeOnly || c.isHiring;
            return matchSearch && matchCat && matchTier && matchDiff && matchHire;
        });

        switch (sort) {
            case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
            case "questions": list.sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0)); break;
            case "difficulty-asc": list.sort((a, b) => (DIFF_ORDER[a.difficulty] || 0) - (DIFF_ORDER[b.difficulty] || 0)); break;
            case "difficulty-desc": list.sort((a, b) => (DIFF_ORDER[b.difficulty] || 0) - (DIFF_ORDER[a.difficulty] || 0)); break;
            case "salary": list.sort((a, b) => {
                const getMax = s => parseInt((s || "0").split("–").pop().replace(/\D/g, "")) || 0;
                return getMax(b.salary) - getMax(a.salary);
            }); break;
        }
        return list;
    }, [search, category, tier, difficulty, sort, activeOnly]);

    const hasActiveFilters = category !== "All" || tier !== "All" || difficulty !== "All" || activeOnly || search;

    const clearFilters = () => {
        setSearch(""); setCategory("All"); setTier("All");
        setDifficulty("All"); setActiveOnly(false); setSort("default");
    };

    return (
        <div className="pb-20">
            {/* ── Page Header ── */}
            <div className="mb-10">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.25em] mb-2">Company Intelligence</p>
                        <h1 className="text-4xl lg:text-5xl font-black dark:text-white text-slate-900 tracking-tighter leading-none">
                            Interview Prep<br />
                            <span className="text-indigo-500">Decoded.</span>
                        </h1>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-white/30 font-medium text-right max-w-xs hidden md:block">
                        Real LeetCode questions from Feb 2026 · Sourced from{" "}
                        <a href="https://github.com/snehasishroy/leetcode-companywise-interview-questions" target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">snehasishroy/leetcode</a>
                    </p>
                </div>
            </div>

            {/* ── Global Stats Strip ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <HeroStat icon={<Code2 size={16} className="text-indigo-500" />} label="Total Questions" value={totalQuestions} />
                <HeroStat icon={<Zap size={16} className="text-amber-500" />} label="Problems Solved" value={totalSolved} />
                <HeroStat icon={<Target size={16} className="text-emerald-500" />} label="Companies" value={COMPANIES.length} />
                <HeroStat icon={<Flame size={16} className="text-rose-500" />} label="Actively Hiring" value={hiringCount} />
            </div>

            {/* ── Search + Filter Bar ── */}
            <div className="bg-white dark:bg-white/[0.03] rounded-[28px] border border-slate-100 dark:border-white/5 p-4 mb-6 shadow-sm">
                <div className="flex gap-3 mb-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={15} />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-semibold text-slate-700 dark:text-white outline-none focus:ring-2 ring-indigo-500/20 placeholder-slate-400 dark:placeholder-white/20 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <SortSelect value={sort} onChange={setSort} />

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(p => !p)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${showFilters || hasActiveFilters
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                                : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/40 border border-slate-100 dark:border-white/10 hover:text-indigo-500"
                            }`}
                    >
                        <Filter size={14} />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[9px] font-black">
                                {[category !== "All", tier !== "All", difficulty !== "All", activeOnly, !!search].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Expandable Filters ── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-4">
                                {/* Category */}
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-2">Category</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(c => (
                                            <PillButton
                                                key={c}
                                                label={c}
                                                active={category === c}
                                                onClick={() => setCategory(c)}
                                                count={c === "All" ? COMPANIES.length : COMPANIES.filter(co => co.category === c).length}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Tier */}
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-2">Tier</p>
                                    <div className="flex flex-wrap gap-2">
                                        {TIERS.map(t => (
                                            <PillButton key={t} label={t} active={tier === t} onClick={() => setTier(t)} />
                                        ))}
                                    </div>
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-2">Interview Difficulty</p>
                                    <div className="flex flex-wrap gap-2">
                                        {DIFFICULTIES.map(d => (
                                            <PillButton key={d} label={d} active={difficulty === d} onClick={() => setDifficulty(d)} />
                                        ))}
                                    </div>
                                </div>

                                {/* Quick toggles */}
                                <div className="flex items-center gap-4 pt-1">
                                    <button
                                        onClick={() => setActiveOnly(p => !p)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${activeOnly
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                                : "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10"
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${activeOnly ? "bg-emerald-400 animate-pulse" : "bg-slate-300"}`} />
                                        Actively Hiring Only
                                    </button>

                                    {hasActiveFilters && (
                                        <button onClick={clearFilters} className="text-[11px] font-black text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors">
                                            <X size={12} /> Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Results Header ── */}
            <div className="flex items-center justify-between mb-5 px-1">
                <p className="text-sm font-black text-slate-400 dark:text-white/30">
                    <span className="text-indigo-500 dark:text-indigo-400">{filtered.length}</span> {filtered.length === 1 ? "company" : "companies"} found
                    {hasActiveFilters && <span className="text-slate-400"> (filtered)</span>}
                </p>
                {totalSolved > 0 && (
                    <p className="text-[11px] font-black text-emerald-500">
                        ✓ {totalSolved} solved across all companies
                    </p>
                )}
            </div>

            {/* ── Company Grid ── */}
            <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                        {filtered.map((company, i) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onClick={onSelectCompany}
                                solvedCount={solvedMap[company.id] || 0}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 rounded-[40px] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-4">
                            <Search size={28} className="text-slate-300 dark:text-white/20" />
                        </div>
                        <p className="text-slate-400 dark:text-white/30 font-black uppercase tracking-widest text-xs mb-2">No companies match</p>
                        <p className="text-slate-300 dark:text-white/15 text-xs mb-6">Try adjusting your filters</p>
                        <button
                            onClick={clearFilters}
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}