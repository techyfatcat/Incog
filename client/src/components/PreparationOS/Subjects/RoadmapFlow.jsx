// src/components/PreparationOS/Subjects/RoadmapFlow.jsx

import React from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

const STATUS_STYLES = {
    completed: { dot: 'bg-emerald-500 border-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, line: 'bg-emerald-500' },
    'in-progress': { dot: 'bg-indigo-500 border-indigo-500 animate-pulse', text: 'text-indigo-600 dark:text-indigo-400', icon: Circle, line: 'bg-slate-200 dark:bg-white/10' },
    pending: { dot: 'bg-slate-300 dark:bg-white/20 border-slate-300 dark:border-white/20', text: 'text-slate-500 dark:text-slate-400', icon: Circle, line: 'bg-slate-200 dark:bg-white/10' },
    locked: { dot: 'bg-slate-200 dark:bg-white/10 border-slate-200 dark:border-white/10', text: 'text-slate-400 dark:text-slate-600', icon: Lock, line: 'bg-slate-200 dark:bg-white/10' },
};

export default function RoadmapFlow({ topics, roadmap, onTopicClick }) {
    const orderedTopics = roadmap.map(id => topics.find(t => t.id === id)).filter(Boolean);

    return (
        <div className="relative overflow-x-auto pb-2">
            <div className="flex items-center gap-0 min-w-max">
                {orderedTopics.map((topic, i) => {
                    const s = STATUS_STYLES[topic.status] || STATUS_STYLES.pending;
                    const Icon = s.icon;
                    const isLast = i === orderedTopics.length - 1;

                    return (
                        <div key={topic.id} className="flex items-center">
                            {/* Node */}
                            <button
                                onClick={() => topic.status !== 'locked' && onTopicClick(topic)}
                                disabled={topic.status === 'locked'}
                                className={`
                  flex flex-col items-center gap-2 group
                  ${topic.status === 'locked' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
                `}
                            >
                                {/* Circle */}
                                <div className={`
                  relative w-10 h-10 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${s.dot}
                  ${topic.status !== 'locked' ? 'group-hover:scale-110 group-hover:shadow-lg' : ''}
                `}>
                                    {topic.status === 'locked'
                                        ? <Lock size={14} className="text-slate-400 dark:text-slate-600" />
                                        : topic.status === 'completed'
                                            ? <CheckCircle2 size={16} className="text-white" />
                                            : <span className="w-2 h-2 rounded-full bg-white" />
                                    }
                                    {topic.status === 'in-progress' && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-[#080B16]" />
                                    )}
                                </div>

                                {/* Label */}
                                <span className={`text-[11px] font-semibold max-w-[72px] text-center leading-tight ${s.text}`}>
                                    {topic.name}
                                </span>
                            </button>

                            {/* Connector line */}
                            {!isLast && (
                                <div className={`h-[2px] w-10 mx-1 mt-[-14px] rounded ${s.line}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}