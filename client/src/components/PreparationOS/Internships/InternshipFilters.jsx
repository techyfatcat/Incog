import React, { useState } from 'react';
import { FiSearch, FiX, FiSliders } from 'react-icons/fi';
import { CITIES, JOB_TYPES } from './internshipsData';

const InternshipFilters = ({ filters, onChange, totalCount, filteredCount }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const set = (key, value) => onChange({ ...filters, [key]: value });
    const toggleTag = (tag) => {
        const tags = filters.tags || [];
        set('tags', tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
    };
    const clearAll = () => onChange({ search: '', city: 'All', type: 'All', remote: false, fresher: false, tags: [] });
    const hasActiveFilters = filters.search || filters.city !== 'All' || filters.type !== 'All' || filters.remote || filters.fresher || (filters.tags || []).length > 0;

    const POPULAR_TAGS = ['React', 'Python', 'Java', 'Node.js', 'TypeScript', 'Go', 'AWS', 'Machine Learning', 'DSA', 'Kotlin'];

    return (
        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4">
            {/* Search + count */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search role, company, or skill..."
                        value={filters.search || ''}
                        onChange={e => set('search', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 ring-indigo-500/40 transition-all"
                    />
                    {filters.search && (
                        <button onClick={() => set('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <FiX size={13} />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowAdvanced(s => !s)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${showAdvanced
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-indigo-500/40'
                        }`}
                >
                    <FiSliders size={13} /> Filters
                    {hasActiveFilters && <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />}
                </button>
            </div>

            {/* Quick pills */}
            <div className="flex flex-wrap gap-2">
                <QuickFilter label="🔥 Fresher OK" active={filters.fresher} onClick={() => set('fresher', !filters.fresher)} />
                <QuickFilter label="🌐 Remote" active={filters.remote} onClick={() => set('remote', !filters.remote)} />
                {CITIES.filter(c => c !== 'All').slice(0, 5).map(city => (
                    <QuickFilter key={city} label={city} active={filters.city === city} onClick={() => set('city', filters.city === city ? 'All' : city)} />
                ))}
            </div>

            {/* Advanced panel */}
            {showAdvanced && (
                <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-3">
                        <Select label="City" value={filters.city} options={CITIES} onChange={v => set('city', v)} />
                        <Select label="Type" value={filters.type} options={JOB_TYPES} onChange={v => set('type', v)} />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Skills</label>
                        <div className="flex flex-wrap gap-1.5">
                            {POPULAR_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${(filters.tags || []).includes(tag)
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-indigo-500/40'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Result count + clear */}
            <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-400 font-medium">
                    Showing <span className="font-black text-slate-700 dark:text-white">{filteredCount}</span> of <span className="font-bold">{totalCount}</span> roles
                </p>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-indigo-500 font-bold hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                        <FiX size={11} /> Clear all
                    </button>
                )}
            </div>
        </div>
    );
};

const QuickFilter = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${active
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
            : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-indigo-500/30'
            }`}
    >
        {label}
    </button>
);

const Select = ({ label, value, options, onChange }) => (
    <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-white outline-none focus:ring-2 ring-indigo-500/40 transition-all"
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default InternshipFilters;