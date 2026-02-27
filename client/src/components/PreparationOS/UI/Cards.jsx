import React from 'react';

export function ToolCard({ icon, title, desc, onClick, active }) {
    return (
        <div onClick={onClick} className="group p-8 rounded-[36px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-95 text-left">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{icon}</div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
        </div>
    );
}

export function SubjectCard({ title, icon, topics }) {
    return (
        <div className="p-8 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-all group cursor-pointer shadow-sm text-left">
            <div className="mb-6 p-4 w-fit rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:bg-indigo-500/10 transition-colors">{icon}</div>
            <h3 className="text-2xl font-bold mb-6 dark:text-white tracking-tight">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {topics.map(t => <span key={t} className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 uppercase tracking-wider">{t}</span>)}
            </div>
        </div>
    );
}

export function CompanyCard({ name, difficulty, difficultyColor, rounds, focus, stats }) {
    return (
        <div className="p-8 rounded-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all text-left">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-black dark:text-white mb-1">{name}</h3>
                    <span className={`text-xs font-black uppercase tracking-widest ${difficultyColor}`}>{difficulty} Difficulty</span>
                </div>
                <div className="bg-indigo-500/10 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">{rounds} Rounds</div>
            </div>
            <div className="space-y-4 mb-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Focus</h4>
                <div className="flex flex-wrap gap-2">
                    {focus.map(f => <span key={f} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 dark:text-slate-300">{f}</span>)}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/10">
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Acceptance</p><p className="text-lg font-bold dark:text-white">{stats.acceptance}</p></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Avg Salary</p><p className="text-lg font-bold dark:text-white">{stats.salary}</p></div>
            </div>
        </div>
    );
}