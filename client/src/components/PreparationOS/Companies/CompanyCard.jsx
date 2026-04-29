import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, TrendingUp, Zap, ChevronRight, Star, Users, Briefcase } from 'lucide-react';

const TIER_STYLES = {
    "FAANG": { bg: "bg-violet-500/10 text-violet-500 border-violet-500/20", dot: "bg-violet-500" },
    "FAANG-Adjacent": { bg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", dot: "bg-indigo-500" },
    "Top Tech": { bg: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
    "Top Startup": { bg: "bg-amber-500/10 text-amber-500 border-amber-500/20", dot: "bg-amber-500" },
    "Enterprise Tech": { bg: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-400/20", dot: "bg-slate-500" },
};

const DIFF_COLORS = {
    "Easy": "text-emerald-500",
    "Easy-Medium": "text-teal-500",
    "Medium": "text-amber-500",
    "Medium-Hard": "text-orange-500",
    "Hard": "text-rose-500",
};

export default function CompanyCard({ company, onClick, solvedCount = 0 }) {
    const [hovered, setHovered] = useState(false);
    const tier = TIER_STYLES[company.tier] || TIER_STYLES["Enterprise Tech"];
    const totalQ = company.questionCount || company.questions?.length || 0;
    const progress = totalQ > 0 ? Math.round((solvedCount / totalQ) * 100) : 0;

    const easyPct = company.difficultySplit?.easy || 0;
    const medPct = company.difficultySplit?.medium || 0;
    const hardPct = company.difficultySplit?.hard || 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={() => onClick(company)}
            className="group relative cursor-pointer bg-white dark:bg-white/[0.04] rounded-[32px] border border-slate-100 dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-shadow"
        >
            {/* ── Hover gradient glow ── */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[32px]"
                style={{ background: `radial-gradient(ellipse at top left, ${company.color}15 0%, transparent 70%)` }}
            />

            {/* ── Top bar with difficulty strip ── */}
            <div className="h-1.5 w-full flex overflow-hidden">
                <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${easyPct}%` }} />
                <div className="bg-amber-500 transition-all duration-700" style={{ width: `${medPct}%` }} />
                <div className="bg-rose-500 transition-all duration-700" style={{ width: `${hardPct}%` }} />
            </div>

            <div className="p-6">
                {/* ── Header Row ── */}
                <div className="flex items-start justify-between mb-5">
                    {/* Logo + Active Hiring dot */}
                    <div className="relative">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm overflow-hidden p-2.5 transition-transform duration-300 group-hover:scale-105"
                            style={{ borderColor: `${company.color}30`, backgroundColor: `${company.color}10` }}
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain"
                                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                            />
                            <span
                                className="hidden w-full h-full items-center justify-center text-lg font-black"
                                style={{ color: company.color }}
                            >
                                {company.name[0]}
                            </span>
                        </div>
                        {company.isHiring && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
                        )}
                    </div>

                    {/* Tier + Difficulty badges */}
                    <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${tier.bg}`}>
                            {company.tier}
                        </span>
                        <span className={`text-[10px] font-black ${DIFF_COLORS[company.difficulty] || "text-slate-500"}`}>
                            {company.difficulty}
                        </span>
                    </div>
                </div>

                {/* ── Name + Category ── */}
                <h3 className="text-xl font-black dark:text-white text-slate-800 tracking-tight leading-none mb-1">
                    {company.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-4">
                    {company.category}
                </p>

                {/* ── Key Stats Row ── */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <p className="text-base font-black dark:text-white text-slate-800">{company.rounds}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mt-0.5">Rounds</p>
                    </div>
                    <div className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400 leading-tight">{company.salary}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mt-0.5">Salary</p>
                    </div>
                    <div className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl">
                        <p className="text-base font-black text-rose-500">{company.acceptance}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase mt-0.5">Accept</p>
                    </div>
                </div>

                {/* ── Progress Bar ── */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-wider flex items-center gap-1">
                            <Zap size={10} className="text-indigo-500" /> Prep Progress
                        </span>
                        <span className="text-[10px] font-black dark:text-white text-slate-700">
                            {solvedCount}/{totalQ} · {progress}%
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-indigo-500 rounded-full"
                        />
                    </div>
                </div>

                {/* ── Top 3 Topics ── */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {(company.topicFrequency || []).slice(0, 3).map(t => (
                        <span
                            key={t.name}
                            className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-indigo-500/8 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15"
                        >
                            {t.name}
                        </span>
                    ))}
                </div>

                {/* ── CTA Row ── */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                        <Code2 size={13} className="text-slate-400 dark:text-white/30" />
                        <span className="text-[11px] font-black text-slate-400 dark:text-white/30">{totalQ} problems</span>
                    </div>
                    <motion.div
                        animate={{ x: hovered ? 4 : 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex items-center gap-1 text-indigo-500 text-[11px] font-black"
                    >
                        View Intel <ChevronRight size={14} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}