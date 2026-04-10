import React from 'react';
import { FiFilter, FiGlobe, FiMap, FiClock } from 'react-icons/fi';

const InternshipFilters = ({ activeFilter, setFilter, isRemote, setIsRemote }) => {
    const filterOptions = [
        { id: 'all', label: 'All Roles', icon: <FiFilter /> },
        { id: 'fulltime', label: 'Full-time', icon: <FiClock /> },
        { id: 'contract', label: 'Contract', icon: <FiMap /> },
    ];

    return (
        <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Category Toggles */}
            <div className="flex bg-white dark:bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setFilter(option.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === option.id
                                ? 'bg-indigo-600 dark:bg-blue-600 text-white shadow-lg shadow-indigo-600/20 dark:shadow-blue-900/40'
                                : 'text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Remote Toggle */}
            <button
                onClick={() => setIsRemote(!isRemote)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all backdrop-blur-md ${isRemote
                        ? 'bg-purple-600/10 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-white/20 shadow-sm'
                    }`}
            >
                <FiGlobe className={isRemote ? 'animate-pulse' : ''} />
                Remote Only
            </button>
        </div>
    );
};

export default InternshipFilters;