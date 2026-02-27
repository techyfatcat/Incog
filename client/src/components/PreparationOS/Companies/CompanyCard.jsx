import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function CompanyCard({ company, onClick }) {
    return (
        <div
            onClick={() => onClick(company)}
            className="group relative bg-white dark:bg-[#111111] rounded-[32px] p-7 border border-slate-200 dark:border-white/5 hover:border-indigo-500 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 text-left overflow-hidden"
        >
            {/* Header Section with Logo and Name */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    {/* Logo Container */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 p-2.5 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <span className="text-2xl font-black text-indigo-500">{company.name[0]}</span>
                        )}
                    </div>

                    <div>
                        <h3 className="text-2xl font-black dark:text-white group-hover:text-indigo-500 transition-colors leading-tight">
                            {company.name}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-indigo-400 transition-colors">
                            {company.category}
                        </span>
                    </div>
                </div>

                {/* Difficulty Badge */}
                <div className={`px-3 py-1 ${company.difficulty === 'Elite'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                    } rounded-full text-[10px] font-black uppercase border`}>
                    {company.difficulty}
                </div>
            </div>

            {/* Tags / Topics Section */}
            <div className="flex flex-wrap gap-2 mb-8">
                {company.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-[11px] font-bold text-slate-500 dark:text-slate-300 border border-transparent dark:group-hover:border-white/10 transition-colors">
                        {topic}
                    </span>
                ))}
            </div>

            {/* Data & Visualizer Section */}
            <div className="space-y-4">
                <div className="flex justify-between text-[12px] font-bold">
                    <span className="text-slate-400">Acceptance Rate</span>
                    <span className="dark:text-white font-black">{company.acceptance}</span>
                </div>

                {/* Multi-Segment Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${company.difficultySplit.easy}%` }} />
                    <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${company.difficultySplit.medium}%` }} />
                    <div className="h-full bg-rose-500 transition-all duration-700" style={{ width: `${company.difficultySplit.hard}%` }} />
                </div>

                {/* Footer Stats */}
                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-1.5 text-indigo-500 font-black text-sm">
                        {company.rounds} Rounds <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <span className="text-sm font-black dark:text-white/90 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg">
                        {company.salary}
                    </span>
                </div>
            </div>

            {/* Subtle Bottom Glow Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}