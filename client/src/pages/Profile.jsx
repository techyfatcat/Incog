import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Edit2, FileText, MessageSquare, Bookmark, Heart, Check, X, Trash2, AlertCircle, MessageCircle } from 'lucide-react';
import api from '../utils/api';
import { deletePost } from '../services/postsService';

// Reusable Production-Level Confirm Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-[#161B2E] rounded-[2.5rem] p-8 shadow-2xl border border-black/5 dark:border-white/10 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500"><AlertCircle size={32} /></div>
                    <h3 className="text-xl font-black dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">Cancel</button>
                        <button onClick={onConfirm} className="flex-1 py-4 font-bold bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Confirm</button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

export default function ProductionProfile() {
    const [userData, setUserData] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    useEffect(() => { fetchProfileData(); }, []);

    const fetchProfileData = async () => {
        try {
            const res = await api.get('/profile/me');
            const data = {
                profile: {
                    username: res.data.username,
                    bio: res.data.bio || "",
                    avatarSeed: res.data.avatarSeed || "default",
                },
                stats: {
                    hp: res.data.stats?.hp || 0,
                    maxHp: 1000,
                    levelName: `Level ${res.data.stats?.level || 1} Hero`
                }
            };
            setUserData(data);
            setOriginalData(JSON.parse(JSON.stringify(data)));

            // Fetch Posts and Comments in parallel
            const [postsRes, commentsRes] = await Promise.all([
                api.get(`/posts/user/${res.data._id}`),
                api.get(`/profile/comments`) // Assuming backend has a route for user's own comments
            ]);

            setPosts(postsRes.data);
            setComments(commentsRes.data || []);
        } catch (err) { console.error("Failed to fetch profile", err); }
    };

    const hasChanges = useMemo(() => {
        if (!userData || !originalData) return false;
        return JSON.stringify(userData.profile) !== JSON.stringify(originalData.profile);
    }, [userData, originalData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await api.put('/profile/me', {
                username: userData.profile.username,
                bio: userData.profile.bio,
                avatarSeed: userData.profile.avatarSeed
            });
            localStorage.setItem("userName", res.data.username);
            localStorage.setItem("userAvatar", res.data.avatarSeed);
            setOriginalData(JSON.parse(JSON.stringify(userData)));
        } catch (err) { alert(err.response?.data?.message || "Update failed"); }
        finally { setIsSaving(false); }
    };

    const confirmDeletePost = async () => {
        if (!deleteTargetId) return;
        try {
            await deletePost(deleteTargetId);
            setPosts(prev => prev.filter(p => p._id !== deleteTargetId));
            setUserData(prev => ({
                ...prev,
                stats: { ...prev.stats, hp: prev.stats.hp - 20 }
            }));
            setDeleteTargetId(null);
        } catch (err) { console.error("Delete failed", err); }
    };

    if (!userData) return (
        <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] dark:bg-[#0B0F1A]">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-indigo-500 font-black tracking-[0.3em]">SYNCHRONIZING HERO...</motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#E5E5E5] dark:bg-[#0B0F1A] text-slate-600 dark:text-slate-400 font-sans transition-colors duration-300">
            <div className="max-w-6xl mx-auto pt-32 pb-32 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* IDENTITY CARD */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="text-center">
                            <div className="relative w-44 h-44 mx-auto mb-8">
                                <motion.div animate={isGenerating ? { rotate: 360 } : { rotate: 0 }} transition={{ type: 'spring', damping: 10 }} className="relative w-full h-full rounded-full p-1 z-10">
                                    <div className="relative w-full h-full rounded-full bg-white dark:bg-[#161B2E] overflow-hidden p-2 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.profile.avatarSeed}`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>
                                <button onClick={() => {
                                    setIsGenerating(true);
                                    const newSeed = Math.random().toString(36).substring(7);
                                    setUserData(prev => ({ ...prev, profile: { ...prev.profile, avatarSeed: newSeed } }));
                                    setTimeout(() => setIsGenerating(false), 600);
                                }} className="absolute bottom-2 right-2 z-20 p-3 bg-indigo-600 text-white rounded-full shadow-lg border-4 border-[#E5E5E5] dark:border-[#0B0F1A] hover:scale-110 active:scale-95 transition-all">
                                    <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""} />
                                </button>
                            </div>

                            <UsernameInput value={userData.profile.username} onChange={(v) => setUserData(prev => ({ ...prev, profile: { ...prev.profile, username: v } }))} />
                            <BioInput value={userData.profile.bio} onChange={(v) => setUserData(prev => ({ ...prev, profile: { ...prev.profile, bio: v } }))} />
                        </div>

                        {/* HP BAR */}
                        <div className="px-6 py-8 bg-white/50 dark:bg-white/[0.02] rounded-[2.5rem] border border-black/5 dark:border-white/5 backdrop-blur-md">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-indigo-500">
                                    <Heart size={16} fill="currentColor" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Vitality</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-500">{userData.stats.hp} HP</span>
                            </div>
                            <div className="h-3 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(userData.stats.hp / userData.stats.maxHp) * 100}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]" />
                            </div>
                            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter text-center">{userData.stats.levelName}</p>
                        </div>
                    </aside>

                    {/* ACTIVITY FEED */}
                    <main className="lg:col-span-8">
                        <section className="bg-white dark:bg-[#161B2E] ring-1 ring-black/5 dark:ring-white/5 rounded-[3rem] p-8 sm:p-10 shadow-xl overflow-hidden min-h-[500px]">
                            <div className="flex gap-10 border-b border-black/5 dark:border-white/5 mb-10 pb-2">
                                <ActivityTab label="Posts" icon={<FileText size={18} />} active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
                                <ActivityTab label="Comments" icon={<MessageSquare size={18} />} active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} />
                                <ActivityTab label="Saved" icon={<Bookmark size={18} />} active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
                            </div>

                            <AnimatePresence mode="popLayout">
                                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">

                                    {/* POSTS TAB */}
                                    {activeTab === 'posts' && (
                                        posts.length > 0 ? posts.map(post => (
                                            <motion.div layout key={post._id} className="group p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 flex justify-between items-center transition-all hover:ring-1 hover:ring-indigo-500/30">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{post.title}</h4>
                                                    <p className="text-sm dark:text-slate-400 line-clamp-1 mb-2">{post.content}</p>
                                                    <div className="flex gap-4 text-[10px] uppercase font-black text-slate-400">
                                                        <span className="flex items-center gap-1 text-indigo-500"><Heart size={10} fill="currentColor" /> {post.hp || 0} HP</span>
                                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setDeleteTargetId(post._id)} className="p-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all rounded-full hover:bg-red-500/10">
                                                    <Trash2 size={18} />
                                                </button>
                                            </motion.div>
                                        )) : <ActivityPlaceholder text="You haven't posted any thoughts yet." />
                                    )}

                                    {/* COMMENTS TAB */}
                                    {activeTab === 'comments' && (
                                        comments.length > 0 ? comments.map(comment => (
                                            <motion.div layout key={comment._id} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-white/[0.03]">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MessageCircle size={14} className="text-indigo-500" />
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Replied to: {comment.postTitle || "A Discussion"}</span>
                                                </div>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-3">"{comment.text}"</p>
                                                <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                                                    <span className="flex items-center gap-1"><Heart size={10} /> {comment.likes?.length || 0} Likes</span>
                                                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </motion.div>
                                        )) : <ActivityPlaceholder text="Your discussion history is empty." />
                                    )}

                                    {/* SAVED TAB */}
                                    {activeTab === 'saved' && <ActivityPlaceholder text="Saved content is coming in a future update." />}
                                </motion.div>
                            </AnimatePresence>
                        </section>
                    </main>
                </div>
            </div>

            {/* FLOATING SAVE BAR */}
            <AnimatePresence>
                {hasChanges && (
                    <motion.div initial={{ y: 100, x: '-50%' }} animate={{ y: 0, x: '-50%' }} exit={{ y: 100, x: '-50%' }} className="fixed bottom-10 left-1/2 z-[100] w-[90%] max-w-lg bg-slate-900 dark:bg-indigo-600 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10">
                        <p className="ml-4 text-xs font-bold">Unsaved hero changes!</p>
                        <div className="flex gap-2">
                            <button onClick={() => setUserData(JSON.parse(JSON.stringify(originalData)))} className="px-4 py-2 text-xs font-bold hover:bg-white/10 rounded-xl">Discard</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-white text-slate-900 text-xs font-black rounded-xl hover:scale-105 transition-all">
                                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : "Save Changes"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={confirmDeletePost}
                title="Erase Post?"
                message="This will permanently remove your content and cost 20 Vitality (HP). Proceed?"
            />
        </div>
    );
}

// Sub-components
function UsernameInput({ value, onChange }) {
    const [isEdit, setIsEdit] = useState(false);
    const [temp, setTemp] = useState(value);
    return (
        <div className="mb-2 group min-h-[50px] flex items-center justify-center">
            {!isEdit ? (
                <div onClick={() => { setTemp(value); setIsEdit(true); }} className="flex items-center gap-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-4 py-1 rounded-xl transition-all">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">@{value}</h1>
                    <Edit2 size={14} className="opacity-0 group-hover:opacity-30 transition-all" />
                </div>
            ) : (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-1 pr-3 border border-indigo-500">
                    <input autoFocus className="bg-transparent text-xl font-black text-indigo-600 outline-none px-4 py-1" value={temp} onChange={(e) => setTemp(e.target.value.toLowerCase().replace(/\s/g, ''))} onKeyDown={(e) => e.key === 'Enter' && onChange(temp) || e.key === 'Escape' && setIsEdit(false)} />
                    <button onClick={() => { onChange(temp); setIsEdit(false); }} className="p-1.5 bg-indigo-500 text-white rounded-lg"><Check size={16} /></button>
                </div>
            )}
        </div>
    );
}

function BioInput({ value, onChange }) {
    const [isEdit, setIsEdit] = useState(false);
    const [temp, setTemp] = useState(value);
    return (
        <div className="min-h-[40px] flex items-center justify-center mb-8">
            {!isEdit ? (
                <p onClick={() => { setTemp(value); setIsEdit(true); }} className="text-sm font-medium italic text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer px-6">
                    {value || "Add a bio to your legend..."}
                </p>
            ) : (
                <textarea autoFocus onBlur={() => { onChange(temp); setIsEdit(false); }} className="bg-white dark:bg-slate-800 p-4 rounded-xl text-sm border border-indigo-500 outline-none w-full max-w-xs resize-none" value={temp} onChange={(e) => setTemp(e.target.value)} />
            )}
        </div>
    );
}

function ActivityTab({ label, icon, active, onClick }) {
    return (
        <button onClick={onClick} className={`relative pb-4 flex items-center gap-2 text-sm font-black transition-all ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-500'}`}>
            {icon} {label}
            {active && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />}
        </button>
    );
}

function ActivityPlaceholder({ text }) {
    return (
        <div className="w-full h-48 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2.5rem] flex items-center justify-center opacity-40">
            <p className="text-sm font-bold text-center px-6">{text}</p>
        </div>
    );
}