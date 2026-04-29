// src/components/PreparationOS/Subjects/SubjectCard.jsx

import React from 'react';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import ProgressRing from './ProgressRing';

const COLOR_MAP = {
    indigo: { ring: '#6366f1', badge: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400', glow: 'hover:shadow-indigo-500/20', border: 'hover:border-indigo-400/40' },
    cyan: { ring: '#06b6d4', badge: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400', glow: 'hover:shadow-cyan-500/20', border: 'hover:border-cyan-400/40' },
    emerald: { ring: '#10b981', badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', glow: 'hover:shadow-emerald-500/20', border: 'hover:border-emerald-400/40' },
    blue: { ring: '#3b82f6', badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', glow: 'hover:shadow-blue-500/20', border: 'hover:border-blue-400/40' },
    violet: { ring: '#8b5cf6', badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400', glow: 'hover:shadow-violet-500/20', border: 'hover:border-violet-400/40' },
    orange: { ring: '#f97316', badge: 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400', glow: 'hover:shadow-orange-500/20', border: 'hover:border-orange-400/40' },
};

export default function SubjectCard({ subject, onClick }) {
    const { name, shortName, tagline, icon, color, totalProblems, solvedProblems, totalHours, topics } = subject;
    const percent = Math.round((solvedProblems / totalProblems) * 100);
    const completedTopics = topics.filter(t => t.status === 'completed').length;
    const c = COLOR_MAP[color] || COLOR_MAP.indigo;

    return (
        <button
            onClick={onClick}
            className={`
        group relative w-full text-left
        bg-white dark:bg-white/[0.03] 
        border border-slate-200/80 dark:border-white/[0.07]
        rounded-2xl p-5
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl ${c.glow}
        ${c.border}
        focus:outline-none focus:ring-2 focus:ring-indigo-500/40
      `}
        >
            {/* Category badge */}
            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${c.badge}`}>
                {subject.category}
            </span>

            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight">{shortName}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5 max-w-[160px]">{tagline}</p>
                    </div>
                </div>
                <ProgressRing percent={percent} size={52} strokeWidth={5} color={c.ring} />
            </div>

            {/* Progress bar */}
            <div className="mb-3">
                <div className="h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%`, backgroundColor: c.ring }}
                    />
                </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {solvedProblems}/{totalProblems} problems
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={12} className="text-blue-400" />
                    {totalHours}h invested
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    {completedTopics}/{topics.length} topics
                </span>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: c.ring }}>
                    {percent === 0 ? 'Start learning' : percent === 100 ? 'Completed ✓' : 'Continue →'}
                </span>
                <span className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/[0.06] group-hover:bg-indigo-600 transition-colors duration-200">
                    <ArrowRight size={13} className="text-slate-500 dark:text-slate-300 group-hover:text-white transition-colors" />
                </span>
            </div>
        </button>
    );
}