import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigUp, ArrowBigDown, MinusSquare, PlusSquare, CornerDownRight } from "lucide-react";

export default function Comment({ comment, depth = 0 }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [votes, setVotes] = useState(Math.floor(Math.random() * 50)); // Dummy vote state

    return (
        <div className={`relative ${depth > 0 ? "ml-6 md:ml-10 mt-4" : "mt-6"}`}>
            {/* Thread Line */}
            {depth > 0 && (
                <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-white/10 rounded-full" />
            )}

            <div className="bg-white/50 dark:bg-white/[0.02] border border-white/10 dark:border-white/5 p-4 rounded-2xl">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-400 hover:text-blue-500 transition-colors">
                        {isCollapsed ? <PlusSquare size={16} /> : <MinusSquare size={16} />}
                    </button>
                    <span className="text-[13px] font-bold dark:text-white">User_{comment.id}</span>
                    <span className="text-[11px] text-slate-400">• 2h ago</span>
                </div>

                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            {comment.text}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-full px-2 py-0.5">
                                <button onClick={() => setVotes(v => v + 1)} className="hover:text-orange-500 dark:text-slate-400"><ArrowBigUp size={18} /></button>
                                <span className="text-xs font-bold dark:text-white">{votes}</span>
                                <button onClick={() => setVotes(v => v - 1)} className="hover:text-indigo-500 dark:text-slate-400"><ArrowBigDown size={18} /></button>
                            </div>
                            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 uppercase tracking-tighter">
                                <CornerDownRight size={14} /> Reply
                            </button>
                        </div>

                        {/* Recursive Replies Container */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-2">
                                {comment.replies.map(reply => (
                                    <Comment key={reply.id} comment={reply} depth={depth + 1} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}