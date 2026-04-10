import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiSearch, FiBriefcase, FiRefreshCw } from 'react-icons/fi';
import { useInternships } from '../../../hooks/useInternships';
import InternshipCard from './InternshipCard';
import InternshipFilters from './InternshipFilters';

const InternshipGrid = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setFilter] = useState('all');
    const [isRemote, setIsRemote] = useState(false);

    // Custom hook manages the API lifecycle
    const { internships, loading, error, refresh } = useInternships();
    const gridRef = useRef(null);

    // Consolidated Search/Filter logic
    const performSearch = () => {
        let finalQuery = searchTerm.trim() || 'Software Engineering Intern';
        if (isRemote) finalQuery += ' remote';
        if (activeFilter !== 'all') finalQuery += ` ${activeFilter}`;

        refresh(finalQuery);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        performSearch();
    };

    // Auto-refresh when toggles change
    useEffect(() => {
        performSearch();
    }, [isRemote, activeFilter]);

    // GSAP Entrance Animation
    useEffect(() => {
        if (!loading && internships.length > 0 && gridRef.current) {
            gsap.fromTo(
                gridRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.08,
                    duration: 0.6,
                    ease: "power3.out",
                    clearProps: "all"
                }
            );
        }
    }, [loading, internships]);

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
            {/* Header & Search Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-600/10 dark:bg-blue-500/20 rounded-lg">
                            <FiBriefcase className="text-indigo-600 dark:text-blue-500" />
                        </div>
                        Internship Hub
                    </h2>
                    <p className="text-slate-600 dark:text-gray-400 mt-1 font-medium text-lg">
                        Real-time opportunities curated for your career.
                    </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 group">
                    <input
                        type="text"
                        placeholder="Search roles (e.g. React, Backend...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl py-3.5 px-12 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all group-hover:border-slate-400 dark:group-hover:border-white/20 shadow-sm dark:shadow-none"
                    />
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-indigo-600/20 dark:shadow-blue-900/20"
                    >
                        Find
                    </button>
                </form>
            </div>

            {/* Modern Interactive Filters */}
            <InternshipFilters
                activeFilter={activeFilter}
                setFilter={setFilter}
                isRemote={isRemote}
                setIsRemote={setIsRemote}
            />

            {/* State Management: Loading */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 w-full bg-white/50 dark:bg-white/5 rounded-2xl animate-pulse border border-slate-200 dark:border-white/5 backdrop-blur-sm shadow-sm" />
                    ))}
                </div>
            )}

            {/* State Management: Error */}
            {error && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 shadow-sm">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <FiRefreshCw className="text-red-500 dark:text-red-400 text-2xl" />
                    </div>
                    <p className="text-slate-700 dark:text-gray-300 font-bold mb-6">{error}</p>
                    <button
                        onClick={performSearch}
                        className="flex items-center gap-2 text-white bg-indigo-600 dark:bg-blue-600 px-8 py-3 rounded-full hover:bg-indigo-700 dark:hover:bg-blue-500 transition-all shadow-xl shadow-indigo-600/20 dark:shadow-blue-900/20 font-bold"
                    >
                        Retry Connection
                    </button>
                </div>
            )}

            {/* State Management: Data Grid */}
            {!loading && !error && internships.length > 0 && (
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {internships.map((job, index) => (
                        <InternshipCard key={job.job_id || index} job={job} />
                    ))}
                </div>
            )}

            {/* State Management: Empty */}
            {!loading && internships.length === 0 && !error && (
                <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <p className="text-slate-500 dark:text-gray-500 italic font-medium">No matching internships found for "{searchTerm}".</p>
                    <button onClick={() => { setSearchTerm(''); setFilter('all'); }} className="text-indigo-600 dark:text-blue-400 mt-2 font-bold hover:underline">Clear all filters</button>
                </div>
            )}
        </div>
    );
};

export default InternshipGrid;