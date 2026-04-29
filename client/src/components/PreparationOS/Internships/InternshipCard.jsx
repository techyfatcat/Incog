import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FiExternalLink, FiMapPin, FiClock, FiZap, FiWifi } from 'react-icons/fi';

const InternshipCard = ({ job, index = 0 }) => {
    const cardRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 24, scale: 0.97 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.45,
                ease: 'power2.out',
                delay: (index % 9) * 0.04, // stagger within a page
            }
        );
    }, [index]);

    const logoUrl = (!imgError && job.employer_logo)
        ? job.employer_logo
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer_name)}&background=4f46e5&color=fff&bold=true&size=64`;

    const postedAgo = (() => {
        const diff = Date.now() - new Date(job.job_posted_at).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        return `${Math.floor(days / 30)}mo ago`;
    })();

    return (
        <div
            ref={cardRef}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:-translate-y-0.5 hover:border-indigo-500/30 dark:hover:border-indigo-500/20"
        >
            {/* Hot glow */}
            {job.is_hot && (
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/15 blur-2xl pointer-events-none dark:opacity-100 opacity-0" />
            )}

            {/* Top: logo + title + badges */}
            <div className="p-5 pb-3 flex gap-4 items-start">
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-white/10 p-1.5 flex-shrink-0 border border-slate-100 dark:border-white/5 shadow-sm">
                    <img
                        src={logoUrl}
                        alt={job.employer_name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>

                {/* Title + company */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                            {job.job_title}
                        </h3>
                        {job.is_hot && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-500/20 shrink-0">
                                <FiZap size={8} className="fill-current" /> Hot
                            </span>
                        )}
                        {job.is_remote && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20 shrink-0">
                                <FiWifi size={8} /> Remote
                            </span>
                        )}
                        {job.is_fresher && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md border border-violet-500/20 shrink-0">
                                Fresher OK
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                        {job.employer_name}
                    </p>
                </div>
            </div>

            {/* Meta row */}
            <div className="px-5 pb-3 flex flex-wrap gap-2">
                <MetaChip icon={<FiMapPin size={10} className="text-indigo-500" />} label={job.job_city} />
                <MetaChip icon={<FiClock size={10} className="text-purple-500" />} label={job.job_employment_type} />
                {job.salary && (
                    <MetaChip
                        icon={<span className="text-[9px] font-black text-emerald-500">₹</span>}
                        label={job.salary}
                        highlight
                    />
                )}
            </div>

            {/* Skill tags */}
            <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                {job.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-white/[0.06]">
                        {tag}
                    </span>
                ))}
                {job.tags.length > 4 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200/70 dark:border-white/[0.06]">
                        +{job.tags.length - 4}
                    </span>
                )}
            </div>

            {/* Description — collapsible */}
            {job.description && (
                <div className="px-5 pb-3">
                    <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-all ${expanded ? '' : 'line-clamp-2'}`}>
                        {job.description}
                    </p>
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 mt-1 transition-colors"
                    >
                        {expanded ? 'Show less ↑' : 'Read more ↓'}
                    </button>
                </div>
            )}

            {/* Footer */}
            <div className="mt-auto px-5 py-4 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.06]">
                <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest block">Posted</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">{postedAgo}</span>
                </div>

                <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black py-2.5 px-5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                    Apply Now <FiExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};

const MetaChip = ({ icon, label, highlight }) => (
    <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border ${highlight
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-transparent'
        }`}>
        {icon}
        <span>{label}</span>
    </div>
);

export default InternshipCard;