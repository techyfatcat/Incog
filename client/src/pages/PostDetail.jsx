import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowLeft, Send, Trash2, CornerDownRight, X, AlertCircle, Heart } from 'lucide-react';
import api from '../utils/api';
import PostCard from '../components/feed/PostCard';

// Custom Confirmation Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-[#161B2E] rounded-[2.5rem] p-8 shadow-2xl border border-black/5 dark:border-white/10 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500"><AlertCircle size={32} /></div>
                    <h3 className="text-xl font-black dark:text-white mb-2">Erase Comment?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">This action is permanent. This thought will be removed from the discussion forever.</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">Cancel</button>
                        <button onClick={onConfirm} className="flex-1 py-4 font-bold bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Delete</button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

export default function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => { fetchPost(); }, [id]);

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data);
        } catch (err) { navigate('/feed'); }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const payload = { text: commentText, parentId: replyingTo?._id || null };
            const res = await api.post(`/posts/${id}/comment`, payload);
            setPost(res.data);
            setCommentText("");
            setReplyingTo(null);
        } catch (err) { alert("Failed to post"); } finally { setSubmitting(false); }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const res = await api.post(`/posts/${id}/comment/${commentId}/like`);
            setPost(res.data); // Assuming backend returns updated post
        } catch (err) { console.error("Like failed"); }
    };

    const confirmDelete = async () => {
        try {
            const res = await api.delete(`/posts/${id}/comment/${deleteId}`);
            setPost(res.data);
            setDeleteId(null);
        } catch (err) { console.error("Delete failed"); }
    };

    if (!post) return (
        <div className="min-h-screen flex items-center justify-center bg-[#e5e5e5] dark:bg-[#080B16]">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-blue-500 font-black tracking-widest">LOADING DISCUSSION...</motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] py-24 transition-colors selection:bg-blue-500/30">
            <div className="max-w-3xl mx-auto px-4">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-8 transition-colors font-bold text-sm">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
                </button>

                <PostCard post={post} isFullView={true} onVote={async (pid, type) => {
                    const res = await api.post(`/posts/${pid}/vote`, { type });
                    setPost(prev => ({ ...prev, hp: res.data.hp }));
                }} />

                <div className="mt-12 space-y-8">
                    <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
                        <MessageSquare className="text-blue-500" size={20} />
                        <h3 className="text-xl font-black dark:text-white">Discussion <span className="text-sm font-medium text-gray-400 ml-1">{post.comments?.length || 0}</span></h3>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {replyingTo && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-between bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                                    <span className="text-xs font-bold text-blue-500 flex items-center gap-2">
                                        <CornerDownRight size={14} /> Replying to @{replyingTo.authorName}
                                    </span>
                                    <button onClick={() => setReplyingTo(null)} className="text-blue-500 p-1 hover:bg-blue-500/10 rounded-lg"><X size={14} /></button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleAddComment} className="relative group">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={replyingTo ? "Write a reply..." : "Add your thoughts..."}
                                className="w-full bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 pr-16 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm dark:text-white shadow-sm resize-none min-h-[100px]"
                            />
                            <button disabled={submitting || !commentText.trim()} className="absolute bottom-4 right-4 p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6 pb-20">
                        <AnimatePresence mode="popLayout">
                            {post.comments?.filter(c => !c.parentId).map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    allComments={post.comments}
                                    currentUserId={currentUserId}
                                    onReply={setReplyingTo}
                                    onDelete={setDeleteId}
                                    onLike={handleLikeComment}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
        </div>
    );
}

function CommentItem({ comment, allComments, currentUserId, onReply, onDelete, onLike, depth = 0 }) {
    const replies = allComments.filter(c => c.parentId === comment._id);
    const isLiked = comment.likes?.includes(currentUserId);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`space-y-4 ${depth > 0 ? 'ml-6 sm:ml-12 border-l-2 border-blue-500/10 dark:border-white/5 pl-4 sm:pl-6' : ''}`}
        >
            <div className="bg-white dark:bg-[#0A0C14]/50 border border-black/5 dark:border-white/5 p-5 rounded-[1.8rem] relative group shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorAvatar || comment.authorName}`} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5" alt="avatar" />
                        <div className="flex flex-col">
                            <span className="text-sm font-black dark:text-white">@{comment.authorName}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => { onReply(comment); window.scrollTo({ top: 150, behavior: 'smooth' }); }} className="text-[10px] font-black uppercase text-blue-500 hover:bg-blue-500/10 px-3 py-1.5 rounded-full transition-colors">
                            Reply
                        </button>
                        {currentUserId === comment.authorId && (
                            <button onClick={() => onDelete(comment._id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 pl-11 mb-4 leading-relaxed">
                    {comment.text}
                </p>

                <div className="pl-11 flex items-center gap-4">
                    <button
                        onClick={() => onLike(comment._id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
                    >
                        <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                        {comment.likes?.length || 0}
                    </button>
                </div>
            </div>

            {replies.length > 0 && (
                <div className="space-y-4 mt-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            allComments={allComments}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onDelete={onDelete}
                            onLike={onLike}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}