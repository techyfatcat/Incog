// src/components/PreparationOS/Subjects/InsightPanel.jsx

import React from 'react';
import { Lightbulb, AlertTriangle, Mic } from 'lucide-react';

const INSIGHT_CONFIG = {
    interview: { icon: Mic, label: 'Interview Intel', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300', iconColor: 'text-indigo-500' },
    tip: { icon: Lightbulb, label: 'Pro Tip', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', text: 'text-amber-700 dark:text-amber-300', iconColor: 'text-amber-500' },
    trap: { icon: AlertTriangle, label: 'Common Trap', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', text: 'text-red-700 dark:text-red-300', iconColor: 'text-red-500' },
};

export function InsightCard({ insight }) {
    const config = INSIGHT_CONFIG[insight.type] || INSIGHT_CONFIG.tip;
    const Icon = config.icon;

    return (
        <div className={`flex gap-3 p-3.5 rounded-xl border ${config.bg} ${config.border}`}>
            <Icon size={16} className={`mt-0.5 shrink-0 ${config.iconColor}`} />
            <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${config.iconColor}`}>{config.label}</p>
                <p className={`text-sm leading-relaxed ${config.text}`}>{insight.text}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">— {insight.author}</p>
            </div>
        </div>
    );
}

export default function InsightPanel({ insights = [], subjectId }) {
    if (!insights.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
                    <Lightbulb size={20} className="text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No insights yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Be the first to add intel for this topic!</p>
                <button className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                    + Add Insight
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400 font-medium">{insights.length} insights from the community</p>
                <button className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">+ Add yours</button>
            </div>
            {insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} />
            ))}
        </div>
    );
}