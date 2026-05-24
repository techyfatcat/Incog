import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap, ChevronRight } from 'lucide-react';

const TIER_CONFIG = {
    "FAANG": { label: "FAANG", color: "#a78bfa", glow: "139,92,246" },
    "FAANG-Adjacent": { label: "FAANG+", color: "#818cf8", glow: "99,102,241" },
    "Top Tech": { label: "Top Tech", color: "#60a5fa", glow: "59,130,246" },
    "Top Startup": { label: "Startup", color: "#fbbf24", glow: "245,158,11" },
    "Enterprise Tech": { label: "Enterprise", color: "#94a3b8", glow: "100,116,139" },
};

const DIFF_COLOR = {
    "Easy": "#10b981",
    "Easy-Medium": "#14b8a6",
    "Medium": "#f59e0b",
    "Medium-Hard": "#f97316",
    "Hard": "#f43f5e",
};

export default function CompanyCard({ company, onClick, solvedCount = 0 }) {
    const [hovered, setHovered] = useState(false);

    const tier = TIER_CONFIG[company.tier] || TIER_CONFIG["Enterprise Tech"];
    const diffColor = DIFF_COLOR[company.difficulty] || "#f59e0b";
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
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={() => onClick(company)}
            className="group relative cursor-pointer rounded-[24px] overflow-hidden
                       bg-white dark:bg-[#13131f]
                       border border-slate-200 dark:border-white/[0.08]
                       shadow-sm hover:shadow-lg dark:hover:shadow-black/40
                       transition-shadow duration-300"
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 pointer-events-none rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(ellipse at 30% 0%, rgba(${tier.glow},0.08) 0%, transparent 65%)` }}
            />

            {/* Difficulty strip */}
            <div className="h-[3px] w-full flex overflow-hidden">
                <div className="bg-emerald-500" style={{ width: `${easyPct}%` }} />
                <div className="bg-amber-500" style={{ width: `${medPct}%` }} />
                <div className="bg-rose-500" style={{ width: `${hardPct}%` }} />
            </div>

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    {/* Logo */}
                    <div className="relative">
                        <div
                            className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center p-2"
                            style={{
                                background: `rgba(${tier.glow},0.08)`,
                                border: `1px solid rgba(${tier.glow},0.2)`,
                            }}
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-contain"
                                onError={e => { e.target.style.display = "none"; }}
                            />
                        </div>
                        {company.isHiring && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#13131f] animate-pulse" />
                        )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col items-end gap-1.5">
                        <span
                            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                            style={{
                                background: `rgba(${tier.glow},0.12)`,
                                border: `1px solid rgba(${tier.glow},0.28)`,
                                color: tier.color,
                            }}
                        >
                            {tier.label}
                        </span>
                        <span
                            className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg"
                            style={{
                                background: `${diffColor}18`,
                                border: `1px solid ${diffColor}38`,
                                color: diffColor,
                            }}
                        >
                            {company.difficulty}
                        </span>
                    </div>
                </div>

                {/* Name + category */}
                <h3 className="text-[16px] font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-0.5">
                    {company.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-white/35 uppercase tracking-widest mb-4">
                    {company.category}
                </p>

                {/* Stats — fixed equal width columns */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { val: company.rounds, sub: "Rounds", cls: "text-slate-800 dark:text-white/90" },
                        { val: company.salary, sub: "Salary", cls: "text-emerald-600 dark:text-emerald-400" },
                        { val: company.acceptance, sub: "Rate", cls: "text-rose-500 dark:text-rose-400" },
                    ].map(({ val, sub, cls }) => (
                        <div
                            key={sub}
                            className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl
                                       bg-slate-50 dark:bg-white/[0.04]
                                       border border-slate-100 dark:border-white/[0.06]"
                        >
                            <p className={`text-[12px] font-black leading-tight text-center ${cls}`}>{val}</p>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-white/25 uppercase mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-white/30 flex items-center gap-1">
                            <Zap size={9} className="text-indigo-500" /> Progress
                        </span>
                        <span className="text-[10px] font-black text-slate-600 dark:text-white/55">
                            {solvedCount}/{totalQ} · {progress}%
                        </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-white/[0.07]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: `rgba(${tier.glow},0.85)` }}
                        />
                    </div>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {(company.topicFrequency || []).slice(0, 3).map(t => (
                        <span
                            key={t.name}
                            className="text-[9px] font-black uppercase px-2 py-1 rounded-lg
                                       bg-indigo-50 dark:bg-indigo-500/10
                                       text-indigo-600 dark:text-indigo-400
                                       border border-indigo-200 dark:border-indigo-500/20"
                        >
                            {t.name}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3.5
                                border-t border-slate-100 dark:border-white/[0.07]">
                    <div className="flex items-center gap-1.5">
                        <Code2 size={12} className="text-slate-400 dark:text-white/25" />
                        <span className="text-[10px] font-black text-slate-400 dark:text-white/25">
                            {totalQ} problems
                        </span>
                    </div>
                    <motion.div
                        animate={{ x: hovered ? 3 : 0 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex items-center gap-1 text-[10px] font-black"
                        style={{ color: tier.color }}
                    >
                        View Intel <ChevronRight size={13} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}