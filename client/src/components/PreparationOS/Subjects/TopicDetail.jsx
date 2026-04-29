// src/components/PreparationOS/Subjects/TopicDetail.jsx

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Code2, Lightbulb, BarChart2, Building2, Flame } from 'lucide-react';
import InsightPanel from './InsightPanel';

const DIFF_STYLES = {
    Easy: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    Medium: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    Hard: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400',
};

const TABS = [
    { id: 'theory', icon: BookOpen, label: 'Theory' },
    { id: 'practice', icon: Code2, label: 'Practice' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'progress', icon: BarChart2, label: 'Progress' },
];

function ProblemRow({ problem }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/[0.05] last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-xl px-2 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-indigo-500 transition-colors" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{problem.title}</span>
            </div>
            <div className="flex items-center gap-2">
                {problem.companies?.slice(0, 2).map(c => (
                    <span key={c} className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 rounded-full px-2 py-0.5">
                        <Building2 size={9} />
                        {c}
                    </span>
                ))}
                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                    <Flame size={10} />
                    {problem.frequency}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFF_STYLES[problem.difficulty] || DIFF_STYLES.Medium}`}>
                    {problem.difficulty}
                </span>
            </div>
        </div>
    );
}

export default function TopicDetail({ topic, subject, onBack }) {
    const [activeTab, setActiveTab] = useState('theory');
    const percent = topic.problems > 0 ? Math.round((topic.solved / topic.problems) * 100) : 0;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-400">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="mt-1 p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">{topic.name}</h2>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${DIFF_STYLES[topic.difficulty] || DIFF_STYLES.Medium}`}>
                            {topic.difficulty}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{topic.description}</p>
                </div>
                {/* Completion badge */}
                <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{percent}%</div>
                    <div className="text-xs text-slate-400">{topic.solved}/{topic.problems} done</div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6 h-2 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl mb-6 overflow-x-auto">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <Icon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">

                {/* THEORY TAB */}
                {activeTab === 'theory' && (
                    <div className="space-y-5">
                        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.07]">
                            <h4 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                <BookOpen size={16} className="text-indigo-500" />
                                Core Concept
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{topic.theory}</p>
                        </div>

                        {topic.keyFormulas?.length > 0 && (
                            <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.07]">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                    <span className="text-amber-500">⚡</span>
                                    Key Patterns & Formulas
                                </h4>
                                <ul className="space-y-2">
                                    {topic.keyFormulas.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[10px] font-black flex items-center justify-center shrink-0">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* PRACTICE TAB */}
                {activeTab === 'practice' && (
                    <div>
                        {topic.problems_list?.length > 0 ? (
                            <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-2 border border-slate-200/80 dark:border-white/[0.07]">
                                {topic.problems_list.map(p => <ProblemRow key={p.id} problem={p} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Code2 size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
                                <p className="font-semibold text-slate-500 dark:text-slate-400">Problems coming soon</p>
                                <p className="text-xs text-slate-400 mt-1">We're curating quality problems for this topic.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* INSIGHTS TAB */}
                {activeTab === 'insights' && (
                    <InsightPanel insights={topic.insights || []} />
                )}

                {/* PROGRESS TAB */}
                {activeTab === 'progress' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Solved', value: topic.solved, color: 'text-emerald-500' },
                                { label: 'Remaining', value: topic.problems - topic.solved, color: 'text-amber-500' },
                                { label: 'Completion', value: `${percent}%`, color: 'text-indigo-500' },
                            ].map(s => (
                                <div key={s.label} className="bg-white dark:bg-white/[0.03] rounded-xl p-4 border border-slate-200/80 dark:border-white/[0.07] text-center">
                                    <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                    <div className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.07]">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
                                Detailed problem-level progress tracking coming soon 🚀
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}