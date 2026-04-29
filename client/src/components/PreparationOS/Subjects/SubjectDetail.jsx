// src/components/PreparationOS/Subjects/SubjectDetail.jsx

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Zap, RotateCcw } from 'lucide-react';
import ProgressRing from './ProgressRing';
import RoadmapFlow from './RoadmapFlow';
import TopicDetail from './TopicDetail';

const COLOR_MAP = {
    indigo: { ring: '#6366f1', accent: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500', badge: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
    cyan: { ring: '#06b6d4', accent: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500', badge: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' },
    emerald: { ring: '#10b981', accent: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    blue: { ring: '#3b82f6', accent: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500', badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    violet: { ring: '#8b5cf6', accent: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500', badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400' },
    orange: { ring: '#f97316', accent: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500', badge: 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400' },
};

const STATUS_META = {
    completed: { label: 'Done', cls: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    'in-progress': { label: 'Active', cls: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    pending: { label: 'Next', cls: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400' },
    locked: { label: 'Locked', cls: 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600' },
};

const DIFF_DOT = {
    Easy: 'bg-emerald-400',
    Medium: 'bg-amber-400',
    Hard: 'bg-red-400',
};

function TopicCard({ topic, onClick, color }) {
    const c = COLOR_MAP[color] || COLOR_MAP.indigo;
    const st = STATUS_META[topic.status] || STATUS_META.pending;
    const isLocked = topic.status === 'locked';
    const prog = topic.problems > 0 ? Math.round((topic.solved / topic.problems) * 100) : 0;

    return (
        <button
            onClick={() => !isLocked && onClick(topic)}
            disabled={isLocked}
            className={`
        group w-full text-left bg-white dark:bg-white/[0.03] 
        border border-slate-200/80 dark:border-white/[0.07]
        rounded-xl p-4 transition-all duration-200
        ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-white/15 cursor-pointer'}
        focus:outline-none
      `}
        >
            <div className="flex items-start justify-between mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${DIFF_DOT[topic.difficulty] || DIFF_DOT.Medium}`} />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">{topic.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[180px]">{topic.description}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${st.cls}`}>{st.label}</span>
            </div>

            <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{topic.solved}/{topic.problems} problems</span>
                    <span className={c.accent + ' font-bold'}>{prog}%</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${prog}%`, backgroundColor: c.ring }}
                    />
                </div>
            </div>
        </button>
    );
}

export default function SubjectDetail({ subject, onBack }) {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const { name, shortName, icon, color, totalProblems, solvedProblems, totalHours, topics, roadmap, nextTopic, mostAsked } = subject;
    const percent = Math.round((solvedProblems / totalProblems) * 100);
    const completedTopics = topics.filter(t => t.status === 'completed').length;
    const c = COLOR_MAP[color] || COLOR_MAP.indigo;

    if (selectedTopic) {
        return (
            <TopicDetail
                topic={selectedTopic}
                subject={subject}
                onBack={() => setSelectedTopic(null)}
            />
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-400">
            {/* Back + Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">{name}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT SIDEBAR */}
                <aside className="lg:col-span-1 space-y-4">
                    {/* Progress card */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.07] flex flex-col items-center text-center">
                        <ProgressRing percent={percent} size={96} strokeWidth={8} color={c.ring} className="mb-4" />
                        <p className="font-black text-slate-800 dark:text-white">{shortName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Overall Progress</p>

                        <div className="w-full border-t border-slate-100 dark:border-white/[0.06] mt-4 pt-4 space-y-2.5">
                            {[
                                { icon: CheckCircle2, label: 'Topics done', val: `${completedTopics}/${topics.length}`, color: 'text-emerald-500' },
                                { icon: Clock, label: 'Hours invested', val: `${totalHours}h`, color: 'text-blue-400' },
                                { icon: Zap, label: 'Problems solved', val: `${solvedProblems}/${totalProblems}`, color: 'text-amber-400' },
                            ].map(({ icon: Icon, label, val, color: ic }) => (
                                <div key={label} className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                        <Icon size={12} className={ic} />
                                        {label}
                                    </span>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next up card */}
                    {nextTopic && (
                        <div
                            onClick={() => {
                                const t = topics.find(t => t.id === nextTopic);
                                if (t) setSelectedTopic(t);
                            }}
                            className={`cursor-pointer bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 text-white group hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200`}
                        >
                            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Next Up</p>
                            <p className="font-black text-base">{topics.find(t => t.id === nextTopic)?.name}</p>
                            <p className="text-indigo-200 text-xs mt-0.5 mb-3">Recommended next topic</p>
                            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-200 group-hover:text-white transition-colors">
                                <RotateCcw size={11} />
                                Resume here →
                            </div>
                        </div>
                    )}

                    {/* Most asked at */}
                    {mostAsked?.length > 0 && (
                        <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-4 border border-slate-200/80 dark:border-white/[0.07]">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Most asked at</p>
                            <div className="flex flex-wrap gap-1.5">
                                {mostAsked.map(c => (
                                    <span key={c} className="text-[11px] font-semibold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* RIGHT MAIN */}
                <main className="lg:col-span-3 space-y-6">
                    {/* Roadmap */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.07]">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-5 flex items-center gap-2">
                            <span>📍</span> Learning Roadmap
                        </h3>
                        <RoadmapFlow topics={topics} roadmap={roadmap} onTopicClick={setSelectedTopic} />
                    </div>

                    {/* Topic Grid */}
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
                            <span>📚</span> All Topics
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {topics.map(topic => (
                                <TopicCard key={topic.id} topic={topic} onClick={setSelectedTopic} color={subject.color} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}