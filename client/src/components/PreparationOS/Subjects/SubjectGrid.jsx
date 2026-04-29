// src/components/PreparationOS/Subjects/SubjectGrid.jsx

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import SubjectCard from './SubjectCard';
import { SUBJECTS, CATEGORIES } from "../../../data/subjectsData.js";

export default function SubjectGrid({ onSelectSubject }) {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = useMemo(() => {
        return SUBJECTS.filter(s => {
            const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.shortName.toLowerCase().includes(query.toLowerCase());
            const matchesCat = activeCategory === 'All' || s.category === activeCategory;
            return matchesQuery && matchesCat;
        });
    }, [query, activeCategory]);

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Search + filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search subjects…"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === cat
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                                : 'bg-white dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-500/40'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(subject => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onClick={() => onSelectSubject(subject)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-bold text-slate-600 dark:text-slate-300">No subjects found</p>
                    <p className="text-sm text-slate-400 mt-1">Try a different search or filter</p>
                    <button
                        onClick={() => { setQuery(''); setActiveCategory('All'); }}
                        className="mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}