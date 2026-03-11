import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle2, ArrowRight, Zap, RotateCcw } from 'lucide-react';

const TestResult = ({ score, totalQuestions, timeTaken, testTitle, onRetry, onExit }) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const hpEarned = score * 10; // 10 HP per correct answer logic

    return (
        <div className="fixed inset-0 z-[250] bg-[#0B0F1A] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-2xl w-full bg-[#161B2E] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-center"
            >
                {/* Background Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

                {/* Trophy Icon */}
                <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20"
                >
                    <Trophy size={48} className="text-white" />
                </motion.div>

                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Mission Accomplished</h2>
                <p className="text-slate-400 mb-8 font-medium">{testTitle}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <StatCard icon={<CheckCircle2 size={16} />} label="Score" value={`${score}/${totalQuestions}`} />
                    <StatCard icon={<Clock size={16} />} label="Time" value={timeTaken} />
                    <StatCard icon={<Zap size={16} fill="currentColor" />} label="HP Earned" value={`+${hpEarned}`} color="text-indigo-400" />
                </div>

                {/* Accuracy Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500 mb-3 px-2">
                        <span>Accuracy</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onRetry}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5"
                    >
                        <RotateCcw size={18} /> Try Again
                    </button>
                    <button
                        onClick={onExit}
                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                        Back to Tools <ArrowRight size={18} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

function StatCard({ icon, label, value, color = "text-white" }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-center gap-2 text-slate-500 mb-1 text-[10px] font-black uppercase tracking-widest">
                {icon} {label}
            </div>
            <div className={`text-xl font-black ${color}`}>{value}</div>
        </div>
    );
}

export default TestResult;