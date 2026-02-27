import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronUp,
    ChevronDown,
    MessageSquare,
    Share2,
    Bookmark,
    MoreHorizontal,
    AlertTriangle,
    Trash2,
    Flag
} from 'lucide-react';
import Highlight from './Highlight';

const PostCard = ({ post, searchQuery, onVote, onDelete }) => {
    const navigate = useNavigate();
    const [vote, setVote] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    // Navigate to post detail page
    const goToPost = () => {
        navigate(`/post/${post._id}`);
    };

    const handleHp = async (e, type) => {
        e.stopPropagation();
        const voteType = vote === type ? null : type;
        setVote(voteType);
        if (onVote) onVote(post._id, type);
    };

    const handleAction = (e, actionType) => {
        e.stopPropagation();
        if (actionType === 'options') {
            setShowOptions(!showOptions);
        } else if (actionType === 'share') {
            // Simple Web Share API implementation
            if (navigator.share) {
                navigator.share({
                    title: post.title,
                    url: `${window.location.origin}/post/${post._id}`
                });
            } else {
                alert("Link copied to clipboard!");
                navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
            }
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            whileHover={{ y: -2 }}
            className="relative group w-full mb-6"
            onClick={goToPost}
        >
            {/* Animated Gradient Border */}
            <div className="absolute -inset-[1px] rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="relative w-full bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-[24px] overflow-hidden shadow-sm">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.avatarSeed || post.username}`}
                                alt="avatar"
                                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 object-cover border border-gray-200 dark:border-white/10"
                            />
                            <div className="flex flex-col text-left">
                                <span className="text-[14px] font-bold text-gray-900 dark:text-white/90">
                                    <Highlight text={post.isAnonymous ? "Anonymous" : post.author?.username || post.username} query={searchQuery} />
                                </span>
                                <span className="text-[12px] text-gray-500 dark:text-white/40">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Options Menu (3 Dots) */}
                        <div className="relative">
                            <button
                                onClick={(e) => handleAction(e, 'options')}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            <AnimatePresence>
                                {showOptions && (
                                    <>
                                        {/* Invisible backdrop to close menu */}
                                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowOptions(false); }} />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#161B2E] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl z-20 py-2"
                                        >
                                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <Flag size={16} /> Report Post
                                            </button>
                                            {/* Show delete only if you are the author - you can add that check here */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete(post._id); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 size={16} /> Delete Post
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-4 text-left">
                        <h2 className="text-[18px] font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                            <Highlight text={post.title} query={searchQuery} />
                        </h2>
                        <p className="text-[14px] text-gray-600 dark:text-white/60 leading-relaxed line-clamp-3">
                            <Highlight text={post.content} query={searchQuery} />
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">

                        {/* HP Section */}
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/5">
                            <button onClick={(e) => handleHp(e, 'up')} className="p-1.5">
                                <motion.div animate={vote === 'up' ? { color: "#3b82f6" } : { color: "#9ca3af" }}>
                                    <ChevronUp size={22} strokeWidth={vote === 'up' ? 3 : 2} />
                                </motion.div>
                            </button>
                            <div className="px-1 text-center min-w-[35px]">
                                <span className={`text-[13px] font-black ${vote ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/50'}`}>
                                    {post.hp}
                                </span>
                                <span className="block text-[8px] font-black text-blue-500 tracking-tighter -mt-1 uppercase">HP</span>
                            </div>
                            <button onClick={(e) => handleHp(e, 'down')} className="p-1.5">
                                <motion.div animate={vote === 'down' ? { color: "#ef4444" } : { color: "#9ca3af" }}>
                                    <ChevronDown size={22} strokeWidth={vote === 'down' ? 3 : 2} />
                                </motion.div>
                            </button>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); goToPost(); }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-[13px] font-bold"
                            >
                                <MessageSquare size={16} />
                                <span>{post.commentsCount || 0}</span>
                            </button>
                            <button onClick={(e) => handleAction(e, 'share')} className="p-2 rounded-xl text-gray-500 dark:text-white/40 hover:bg-blue-500/10 hover:text-blue-500 transition-all">
                                <Share2 size={16} />
                            </button>
                            <button onClick={(e) => handleAction(e, 'bookmark')} className="p-2 rounded-xl text-gray-500 dark:text-white/40 hover:bg-orange-500/10 hover:text-orange-500 transition-all">
                                <Bookmark size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PostCard;