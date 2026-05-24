import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronUp, ChevronDown, MessageSquare, Share2,
    MoreHorizontal, Trash2, Flag, CheckCircle2, AlertTriangle, ChevronRight
} from 'lucide-react';
import Highlight from './Highlight';

const PostCard = ({ post, searchQuery, onVote, onDelete, onReport, isFullView = false }) => {
    const navigate = useNavigate();

    // ─── Vote state: null | 'up' | 'down'
    // Initialise from post data if the current user's id is tracked
    const currentUserId = localStorage.getItem("userId");
    const getInitialVote = () => {
        if (!currentUserId) return null;
        if (post.upvotes?.includes(currentUserId)) return 'up';
        if (post.downvotes?.includes(currentUserId)) return 'down';
        return null;
    };

    const [vote, setVote] = useState(getInitialVote);
    const [localHp, setLocalHp] = useState(post.hp || 0);
    const [showOptions, setShowOptions] = useState(false);
    const [reportStep, setReportStep] = useState('menu'); // 'menu' | 'reasons' | 'success'
    const [isReporting, setIsReporting] = useState(false);
    const [isReportedSuccessfully, setIsReportedSuccessfully] = useState(false);

    const reportReasons = ["Spam", "Harassment", "Inappropriate", "Misinformation"];

    const goToPost = () => {
        if (isFullView) return; // Don't navigate if already on detail page
        const existing = JSON.parse(localStorage.getItem("recentPosts")) || [];
        const newPost = { _id: post._id, title: post.title, postType: post.postType };
        const updated = [newPost, ...existing.filter(p => p._id !== post._id)].slice(0, 5);
        localStorage.setItem("recentPosts", JSON.stringify(updated));
        // Custom event so same-tab listeners in CommunityPage can pick it up
        window.dispatchEvent(new CustomEvent("recentPostsUpdated"));
        navigate(`/post/${post._id}`);
    };

    // ─── Vote handler: toggle off if same vote, switch if different, enforce one-vote limit
    const handleVote = async (e, type) => {
        e.stopPropagation();

        let newVote;
        let hpDelta;

        if (vote === type) {
            // Clicking the same button → undo vote
            newVote = null;
            hpDelta = type === 'up' ? -1 : 1;
        } else if (vote === null) {
            // No existing vote → apply new vote
            newVote = type;
            hpDelta = type === 'up' ? 1 : -1;
        } else {
            // Switching vote (up→down or down→up) → reverse by 2
            newVote = type;
            hpDelta = type === 'up' ? 2 : -2;
        }

        // Optimistic UI update
        setVote(newVote);
        setLocalHp(prev => prev + hpDelta);

        if (onVote) {
            try {
                await onVote(post._id, type, vote);
            } catch {
                // Revert on failure
                setVote(vote);
                setLocalHp(prev => prev - hpDelta);
            }
        }
    };

    const handleReportSubmit = async (e, reason) => {
        e.stopPropagation();
        setIsReporting(true);
        const result = await onReport(post._id, reason);
        if (result.success) {
            setReportStep('success');
            setTimeout(() => setIsReportedSuccessfully(true), 1200);
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
        "Interview Experience": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "OA Experience": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        "Final Offer Story": "bg-green-500/10 text-green-400 border-green-500/20",
        "Rejection Experience": "bg-red-500/10 text-red-400 border-red-500/20",
        "Salary Reveal": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        "Market Trend": "bg-pink-500/10 text-pink-400 border-pink-500/20",
        "Study Resource": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
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
                    className={`relative group w-full mb-6 ${!isFullView ? 'cursor-pointer' : ''}`}
                    onClick={!isFullView ? goToPost : undefined}
                >
                    {/* Glassmorphism Border Glow — only on feed cards */}
                    {!isFullView && (
                        <div className="absolute -inset-[1px] rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/50 via-white/20 to-purple-500/50 blur-[2px]" />
                    )}

                    <div className="relative w-full bg-white dark:bg-[#121624] border border-gray-200 dark:border-white/5 rounded-[24px] overflow-hidden shadow-sm transition-all duration-300 group-hover:bg-white/95 dark:group-hover:bg-[#161B2E]">
                        <div className="p-6">

                            {/* Report Success Overlay */}
                            <AnimatePresence>
                                {reportStep === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 z-40 bg-white/90 dark:bg-[#080B16]/95 backdrop-blur-md flex flex-col items-center justify-center gap-3"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/10"
                                        >
                                            <CheckCircle2 size={32} />
                                        </motion.div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Reported</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Removing from feed...</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.isAnonymous
                                            ? "/incognito-avatar.png"
                                            : `${import.meta.env.VITE_API_URL}/avatar/${post.author?.avatarSeed || post.author?._id}`}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-white/10 p-[1px]"
                                    />
                                    <div className="flex flex-col text-left">
                                        <span className="text-[14px] font-bold text-gray-900 dark:text-white/90">
                                            <Highlight
                                                text={post.isAnonymous ? "Anonymous" : post.author?.username || post.username}
                                                query={searchQuery}
                                            />
                                        </span>
                                        <span className="text-[11px] text-gray-400 font-medium tracking-wide">
                                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {!isFullView && (
                                    <button
                                        onClick={(e) => handleAction(e, 'options')}
                                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-3 text-left">
                                <div>
                                    <span className={`inline-block text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-lg border ${tagColors[post.postType] || "bg-gray-500/10 text-gray-400"}`}>
                                        {post.postType}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-[19px] font-black text-gray-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-500 transition-colors">
                                        <Highlight text={post.title} query={searchQuery} />
                                    </h2>

                                    {/* ✅ FIX: Only clamp on feed cards, show full content on detail page */}
                                    <p className={`text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap ${!isFullView ? 'line-clamp-2' : ''}`}>
                                        <Highlight text={post.content} query={searchQuery} />
                                    </p>
                                </div>
                            </div>

                            {/* Interaction Bar */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
                                    {/* ✅ FIX: Vote buttons with proper one-vote-limit UI */}
                                    <button
                                        onClick={(e) => handleVote(e, 'up')}
                                        className={`p-2 transition-all hover:scale-110 active:scale-95 rounded-lg ${vote === 'up' ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}
                                        title={vote === 'up' ? 'Remove upvote' : 'Upvote'}
                                    >
                                        <ChevronUp
                                            size={20}
                                            className={vote === 'up' ? "text-blue-500 stroke-[3px]" : "text-gray-400"}
                                        />
                                    </button>
                                    <div className="px-1 text-center min-w-[28px]">
                                        <span className={`text-[12px] font-black ${vote ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                            {localHp}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => handleVote(e, 'down')}
                                        className={`p-2 transition-all hover:scale-110 active:scale-95 rounded-lg ${vote === 'down' ? 'bg-red-50 dark:bg-red-500/10' : ''}`}
                                        title={vote === 'down' ? 'Remove downvote' : 'Downvote'}
                                    >
                                        <ChevronDown
                                            size={20}
                                            className={vote === 'down' ? "text-red-500 stroke-[3px]" : "text-gray-400"}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[12px] font-bold">
                                        <MessageSquare size={15} />
                                        <span>{post.commentsCount || 0}</span>
                                    </div>
                                    {!isFullView && (
                                        <button
                                            onClick={(e) => handleAction(e, 'share')}
                                            className="p-2.5 rounded-xl text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:text-blue-500 transition-all active:scale-90"
                                        >
                                            <Share2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Options Dropdown */}
                    <AnimatePresence>
                        {showOptions && !isFullView && reportStep !== 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-6 top-16 w-56 bg-white dark:bg-[#1A1F35] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {reportStep === 'menu' && (
                                    <div className="p-1.5">
                                        <button
                                            onClick={() => setReportStep('reasons')}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 group/btn transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Flag size={14} className="text-orange-500" />
                                                <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">Report</span>
                                            </div>
                                            <ChevronRight size={14} className="text-gray-400 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(post._id); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            <span className="text-[12px] font-bold">Delete</span>
                                        </button>
                                    </div>
                                )}

                                {reportStep === 'reasons' && (
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-3 px-1">
                                            <AlertTriangle size={14} className="text-orange-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason</h3>
                                        </div>
                                        <div className="space-y-1">
                                            {reportReasons.map((reason) => (
                                                <button
                                                    key={reason}
                                                    disabled={isReporting}
                                                    onClick={(e) => handleReportSubmit(e, reason)}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-[12px] font-bold text-gray-600 dark:text-gray-300 hover:bg-blue-500/10 hover:text-blue-500 transition-all disabled:opacity-50"
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