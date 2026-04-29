import React, { useState, useMemo } from 'react';
import InternshipCard from './InternshipCard';
import InternshipFilters from './InternshipFilters';
import { INTERNSHIPS } from './internshipsData';
import { FiTrendingUp, FiZap, FiGlobe, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'salary_high', label: 'Salary: High → Low' },
    { value: 'hot', label: 'Hot Roles First' },
    { value: 'fresher', label: 'Fresher Friendly' },
];

export default function InternshipGrid() {
    const [filters, setFilters] = useState({
        search: '', city: 'All', type: 'All', remote: false, fresher: false, tags: [],
    });
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);

    // Filter
    const filtered = useMemo(() => {
        let res = INTERNSHIPS;

        if (filters.search) {
            const q = filters.search.toLowerCase();
            res = res.filter(j =>
                j.job_title.toLowerCase().includes(q) ||
                j.employer_name.toLowerCase().includes(q) ||
                j.tags.some(t => t.toLowerCase().includes(q)) ||
                j.description?.toLowerCase().includes(q)
            );
        }
        if (filters.city && filters.city !== 'All') {
            res = res.filter(j => j.job_city === filters.city);
        }
        if (filters.type && filters.type !== 'All') {
            res = res.filter(j => j.job_employment_type === filters.type);
        }
        if (filters.remote) {
            res = res.filter(j => j.is_remote);
        }
        if (filters.fresher) {
            res = res.filter(j => j.is_fresher);
        }
        if (filters.tags?.length) {
            res = res.filter(j => filters.tags.every(tag => j.tags.includes(tag)));
        }
        return res;
    }, [filters]);

    // Sort
    const sorted = useMemo(() => {
        const arr = [...filtered];
        switch (sort) {
            case 'salary_high':
                return arr.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
            case 'hot':
                return arr.sort((a, b) => (b.is_hot ? 1 : 0) - (a.is_hot ? 1 : 0));
            case 'fresher':
                return arr.sort((a, b) => (b.is_fresher ? 1 : 0) - (a.is_fresher ? 1 : 0));
            case 'newest':
            default:
                return arr.sort((a, b) => new Date(b.job_posted_at) - new Date(a.job_posted_at));
        }
    }, [filtered, sort]);

    // Paginate
    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    // Stats
    const freshCount = INTERNSHIPS.filter(j => j.is_fresher).length;
    const remoteCount = INTERNSHIPS.filter(j => j.is_remote).length;
    const hotCount = INTERNSHIPS.filter(j => j.is_hot).length;

    return (
        <div className="px-6 pb-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-end justify-between mb-2">
                    <div>
                        <p className="text-indigo-500 font-bold text-xs uppercase tracking-widest mb-1">Internship Hub</p>
                        <h2 className="text-3xl font-black dark:text-white">
                            Curated <span className="text-indigo-600">Tech Roles</span>
                        </h2>
                    </div>
                    <p className="text-xs text-slate-400 font-medium pb-1 hidden sm:block">
                        Updated April 2025
                    </p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Hand-picked internships & new-grad roles. Heavy on fresher-friendly and tech positions.
                </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard icon={<FiZap className="text-indigo-500" />} label="Hot Roles" value={hotCount} color="indigo" />
                <StatCard icon={<FiTrendingUp className="text-violet-500" />} label="Fresher OK" value={freshCount} color="violet" />
                <StatCard icon={<FiGlobe className="text-emerald-500" />} label="Remote" value={remoteCount} color="emerald" />
            </div>

            {/* Filters */}
            <div className="mb-6">
                <InternshipFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    totalCount={INTERNSHIPS.length}
                    filteredCount={sorted.length}
                />
            </div>

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-bold text-slate-400">
                    {sorted.length} role{sorted.length !== 1 ? 's' : ''} found
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
                    <div className="flex gap-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1">
                        {SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setSort(opt.value)}
                                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${sort === opt.value
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            {paginated.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginated.map((job, i) => (
                        <InternshipCard key={job.id} job={job} index={i} />
                    ))}
                </div>
            ) : (
                <EmptyState onClear={() => handleFilterChange({ search: '', city: 'All', type: 'All', remote: false, fresher: false, tags: [] })} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                    <PaginationBtn
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        icon={<FiChevronLeft size={15} />}
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${p === page
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <PaginationBtn
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        icon={<FiChevronRight size={15} />}
                    />
                </div>
            )}

            {/* Footer note */}
            <p className="text-center text-[11px] text-slate-400 mt-8 font-medium">
                Curated from top Indian & global tech companies · Apply links go directly to company career pages ·{' '}
                <span className="text-indigo-500">Always verify before applying</span>
            </p>
        </div>
    );
}

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        indigo: 'bg-indigo-500/10 border-indigo-500/20',
        violet: 'bg-violet-500/10 border-violet-500/20',
        emerald: 'bg-emerald-500/10 border-emerald-500/20',
    };
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${colors[color]} bg-white dark:bg-white/[0.02]`}>
            <div className="text-lg">{icon}</div>
            <div>
                <p className="text-lg font-black dark:text-white leading-none">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{label}</p>
            </div>
        </div>
    );
};

const PaginationBtn = ({ onClick, disabled, icon }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >
        {icon}
    </button>
);

const EmptyState = ({ onClear }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 text-2xl">
            🔍
        </div>
        <h3 className="font-black text-slate-700 dark:text-white mb-2">No roles found</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-xs">Try adjusting your filters or search terms to find matching opportunities.</p>
        <button
            onClick={onClear}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
        >
            Clear all filters
        </button>
    </div>
);

// Utility to parse salary strings for sorting
function parseSalary(salaryStr = '') {
    const match = salaryStr.match(/[\d,.]+/);
    if (!match) return 0;
    const num = parseFloat(match[0].replace(/,/g, ''));
    if (salaryStr.includes('LPA')) return num * 100000 / 12; // convert to monthly
    return num;
}