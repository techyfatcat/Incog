import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiExternalLink, FiMapPin, FiClock } from 'react-icons/fi';

const InternshipCard = ({ job }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        // Smooth entrance animation
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 20, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
        );
    }, []);

    // Fallback logo with a professional indigo background
    const logoUrl = job.employer_logo || `https://ui-avatars.com/api/?name=${job.employer_name}&background=6366f1&color=fff`;

    return (
        <div
            ref={cardRef}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-md p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1"
        >
            {/* Decorative Glow - Visible only in Dark Mode */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-[50px] opacity-0 dark:opacity-100 group-hover:bg-blue-500/20 transition-colors" />

            <div className="flex items-start gap-4">
                {/* Company Logo Container */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 dark:bg-white/10 p-2 flex-shrink-0 border border-slate-100 dark:border-white/5 shadow-sm">
                    <img
                        src={logoUrl}
                        alt={job.employer_name}
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.job_title}
                    </h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm font-bold uppercase tracking-tight">
                        {job.employer_name}
                    </p>
                </div>
            </div>

            {/* Meta Info Tags */}
            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 text-xs font-bold bg-slate-100 dark:bg-white/5 rounded-lg px-3 py-2 border border-slate-200/50 dark:border-transparent">
                    <FiMapPin className="text-indigo-500 dark:text-blue-400" />
                    <span className="truncate">{job.job_city || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 text-xs font-bold bg-slate-100 dark:bg-white/5 rounded-lg px-3 py-2 border border-slate-200/50 dark:border-transparent">
                    <FiClock className="text-purple-500 dark:text-purple-400" />
                    <span>{job.job_employment_type?.toLowerCase() || 'Internship'}</span>
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 dark:text-gray-500 tracking-widest">Posted</span>
                    <span className="text-xs text-slate-600 dark:text-gray-300 font-mono font-bold">
                        {job.job_posted_at_datetime_utc
                            ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
                            : 'Recently'}
                    </span>
                </div>

                <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-500 text-white text-sm font-black py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20 dark:shadow-blue-900/20"
                >
                    Apply <FiExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};

export default InternshipCard;