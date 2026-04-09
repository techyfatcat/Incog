import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronUp, ChevronDown, MessageSquare, Share2,
    MoreHorizontal, Trash2, Flag, CheckCircle2, AlertTriangle, ChevronRight
} from 'lucide-react';
import Highlight from './Highlight';

const PostCard = ({ post, searchQuery, onVote, onDelete, onReport }) => {
    const navigate = useNavigate();
    const [vote, setVote] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [reportStep, setReportStep] = useState('menu'); // 'menu' | 'reasons' | 'success'
    const [isReporting, setIsReporting] = useState(false);
    const [isReportedSuccessfully, setIsReportedSuccessfully] = useState(false);

    const reportReasons = ["Spam", "Harassment", "Inappropriate", "Misinformation"];

    const goToPost = () => navigate(`/post/${post._id}`);

    const handleHp = async (e, type) => {
        e.stopPropagation();
        const voteType = vote === type ? null : type;
        setVote(voteType);
        if (onVote) onVote(post._id, type);
    };

    const handleReportSubmit = async (e, reason) => {
        e.stopPropagation();
        setIsReporting(true);

        const result = await onReport(post._id, reason);

        if (result.success) {
            setReportStep('success');
            // Show success UI for 1.2s then trigger the removal animation
            setTimeout(() => {
                setIsReportedSuccessfully(true);
            }, 1200);
        } else {
            setIsReporting(false);
            setReportStep('menu');
        }
    };

    const handleAction = (e, actionType) => {
        e.stopPropagation();
        if (actionType === 'options') {
            setShowOptions(!showOptions);
            setReportStep('menu');
        }
        if (actionType === 'share') {
            const url = `${window.location.origin}/post/${post._id}`;
            if (navigator.share) {
                navigator.share({ title: post.title, url });
            } else {
                navigator.clipboard.writeText(url);
            }
        }
    };

    const tagColors = {
        "Interview Experience": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "OA Experience": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Final Offer Story": "bg-green-500/10 text-green-400 border-green-500/20",
        "Rejection Experience": "bg-red-500/10 text-red-400 border-red-500/20",
        "Salary Reveal": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        "Market Trend": "bg-pink-500/10 text-pink-400 border-pink-500/20",
        "Study Resource": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        "Placement Strategy": "bg-orange-500/10 text-orange-400 border-orange-500/20"
    };

    return (
        <AnimatePresence>
            {!isReportedSuccessfully && (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, scale: 0.9, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.4, ease: "anticipate" }}
                    className="relative group w-full mb-6 cursor-pointer"
                    onClick={goToPost}
                >
                    <div className="absolute -inset-[1.5px] rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-[1px]" />

                    <div className="relative w-full bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-[24px] overflow-hidden shadow-sm transition-colors duration-300 group-hover:bg-white/95 dark:group-hover:bg-[#0D101D]">
                        <div className="p-6">
                            {/* Success Overlay inside the card */}
                            <AnimatePresence>
                                {reportStep === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-40 bg-white/90 dark:bg-[#0A0C14]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <CheckCircle2 size={32} />
                                        </motion.div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Reported Successfully</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Removing from your feed...</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main Card Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.isAnonymous ? "/incognito-avatar.png" : `http://localhost:5000/api/avatar/${post.author?.avatarSeed || post.author?._id}`}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-white/10"
                                    />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[14px] font-bold text-gray-900 dark:text-white/90">
                                            <Highlight text={post.isAnonymous ? "Anonymous" : post.author?.username || post.username} query={searchQuery} />
                                        </span>
                                        <span className="text-[11px] text-gray-400 font-medium tracking-wide">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <button onClick={(e) => handleAction(e, 'options')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col gap-4 text-left">
                                <div>
                                    <span className={`inline-block text-[10px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border ${tagColors[post.postType] || "bg-gray-500/10 text-gray-400"}`}>
                                        {post.postType}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-[20px] font-black text-gray-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-500 transition-colors">
                                        <Highlight text={post.title} query={searchQuery} />
                                    </h2>
                                    <p className="text-[14.5px] text-gray-500 dark:text-white/50 leading-relaxed line-clamp-3">
                                        <Highlight text={post.content} query={searchQuery} />
                                    </p>
                                </div>
                            </div>

                            {/* Interaction Bar */}
                            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
                                    <button onClick={(e) => handleHp(e, 'up')} className="p-2 transition-transform active:scale-125">
                                        <ChevronUp size={20} className={vote === 'up' ? "text-blue-500 stroke-[3px]" : "text-gray-400"} />
                                    </button>
                                    <div className="px-2 text-center min-w-[32px]">
                                        <span className={`text-[13px] font-black ${vote ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                            {post.hp}
                                        </span>
                                    </div>
                                    <button onClick={(e) => handleHp(e, 'down')} className="p-2 transition-transform active:scale-125">
                                        <ChevronDown size={20} className={vote === 'down' ? "text-red-500 stroke-[3px]" : "text-gray-400"} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-[12.5px] font-bold">
                                        <MessageSquare size={16} />
                                        <span>{post.commentsCount || 0}</span>
                                    </button>
                                    <button onClick={(e) => handleAction(e, 'share')} className="p-2.5 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reporting Dropdown */}
                    <AnimatePresence>
                        {showOptions && reportStep !== 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                className="absolute right-6 top-16 w-60 bg-white dark:bg-[#111629] border border-gray-200 dark:border-white/10 rounded-[20px] shadow-2xl z-50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {reportStep === 'menu' && (
                                    <div className="py-2">
                                        <button
                                            onClick={() => setReportStep('reasons')}
                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 group/btn"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                                                    <Flag size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Report Post</span>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-400 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(post._id); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/5 text-red-500 border-t border-gray-50 dark:border-white/5"
                                        >
                                            <div className="p-1.5 rounded-lg bg-red-500/10">
                                                <Trash2 size={14} />
                                            </div>
                                            <span className="text-xs font-bold">Delete Post</span>
                                        </button>
                                    </div>
                                )}

                                {reportStep === 'reasons' && (
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-3 px-1">
                                            <AlertTriangle size={14} className="text-orange-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Reason</h3>
                                        </div>
                                        <div className="space-y-1">
                                            {reportReasons.map((reason) => (
                                                <button
                                                    key={reason}
                                                    disabled={isReporting}
                                                    onClick={(e) => handleReportSubmit(e, reason)}
                                                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-500/10 hover:text-blue-500 transition-all disabled:opacity-50"
                                                >
                                                    {reason}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PostCard;