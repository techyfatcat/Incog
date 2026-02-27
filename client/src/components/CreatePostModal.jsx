import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Send, ShieldCheck, UserCircle, Zap } from 'lucide-react';
import { createNewPost } from '../services/postsService';

const POST_TYPES = [
    'Interview Experience', 'OA Experience', 'Final Offer Story',
    'Rejection Experience', 'Salary Reveal', 'Market Trend',
    'Study Resource', 'Placement Strategy'
];

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // 🆕 Reward animation
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        postType: 'Interview Experience',
        isAnonymous: false,
        image: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newPost = await createNewPost(formData);
            if (newPost) {
                // 🎁 Show success state/HP reward before closing
                setShowSuccess(true);
                setTimeout(() => {
                    onPostCreated(newPost); // Update feed
                    onClose();
                    setShowSuccess(false);
                    setFormData({ title: '', content: '', postType: 'Interview Experience', isAnonymous: false, image: '' });
                }, 1500);
            }
        } catch (error) {
            console.error("Creation error:", error);
            alert("Failed to create post. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0A0C14] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl"
                    >
                        {/* Success Overlay */}
                        <AnimatePresence>
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-blue-600 flex flex-col items-center justify-center text-white"
                                >
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                        <Zap size={60} fill="white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black mt-4">EXPERIENCE SHARED!</h3>
                                    <p className="font-bold opacity-80">+20 HP GAINED</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Send className="text-blue-500" size={20} />
                                Create New Post
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input
                                type="text"
                                placeholder="Catchy title for your experience..."
                                className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-gray-600 focus:ring-0 border-none"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div className="flex flex-wrap gap-2 py-2">
                                {POST_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, postType: type })}
                                        className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-black transition-all ${formData.postType === type
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Share the details (questions asked, tips, process)..."
                                className="w-full min-h-[200px] bg-transparent text-gray-300 outline-none resize-none placeholder:text-gray-600 border-none focus:ring-0 text-sm leading-relaxed"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${formData.isAnonymous ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:bg-white/5'
                                            }`}
                                    >
                                        {formData.isAnonymous ? <ShieldCheck size={18} /> : <UserCircle size={18} />}
                                        <span className="text-xs font-black uppercase tracking-tighter">
                                            {formData.isAnonymous ? 'Anonymous Mode' : 'Public Post'}
                                        </span>
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Transmitting...' : 'Post Experience'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreatePostModal;