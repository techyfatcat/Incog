import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CompanyCard from './CompanyCard';
import { COMPANIES_DATA } from './DataEngine';

export default function CompanyGrid({ onSelect }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCompanies = COMPANIES_DATA.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Wide, Thin, and Glow-Bordered Search Bar */}
            <div className="relative w-full group">
                {/* Your Favorite Gradient Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[22px] blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>

                <div className="relative flex items-center bg-white/90 dark:bg-[#0d0d0d]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[20px] px-6 py-1.5 shadow-2xl transition-all">
                    <Search className="text-indigo-500 mr-4 shrink-0" size={20} />

                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Intelligence Engine..."
                        className="w-full bg-transparent border-none outline-none py-3 text-base font-bold dark:text-white placeholder:text-slate-400 focus:ring-0"
                    />

                    <div className="flex items-center gap-3 ml-2">
                        <button className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2 shrink-0">
                            <span className="hidden md:block text-[10px] font-black uppercase tracking-widest pl-1">Filters</span>
                            <SlidersHorizontal size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCompanies.map((company, index) => (
                    <div
                        key={company.id}
                        className="animate-in fade-in zoom-in-95 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <CompanyCard
                            company={company}
                            onClick={() => onSelect(company)}
                        />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCompanies.length === 0 && (
                <div className="text-center py-24 bg-white/40 dark:bg-white/5 rounded-[40px] border border-dashed border-slate-300 dark:border-white/10">
                    <h3 className="text-xl font-bold dark:text-white mb-2 text-slate-400">No Intelligence Matches Found</h3>
                </div>
            )}
        </section>
    );
}