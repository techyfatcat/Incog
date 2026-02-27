import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Filter,
    Flame, History, ChevronRight
} from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/feed/PostCard';
import CreatePostModal from '../components/CreatePostModal';

export default function CommunityPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 🛡️ AUTH STATE: Relying on 'token' to stay in sync with ProtectedRoute
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const syncAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };
        // Listen for storage changes (like login/logout in other tabs)
        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    // 📝 FILTER CONFIG
    const postTypes = [
        'Interview Experience', 'OA Experience', 'Final Offer Story',
        'Rejection Experience', 'Salary Reveal', 'Market Trend',
        'Study Resource', 'Placement Strategy'
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState(postTypes);
    const [sortBy, setSortBy] = useState('Newest');
    const [appliedFilters, setAppliedFilters] = useState({ types: postTypes, sort: 'Newest' });

    // 🚀 THE ENGINE
    const { posts, loading, handleVote, refreshFeed } = usePosts(searchQuery, appliedFilters);

    const handleApplyFilters = () => {
        setAppliedFilters({ types: selectedTypes, sort: sortBy });
    };

    const resetFilters = () => {
        setSelectedTypes(postTypes);
        setSortBy('Newest');
        setAppliedFilters({ types: postTypes, sort: 'Newest' });
    };

    const handleCreatePostClick = () => {
        // Double-check token before opening
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/auth', { state: { from: location.pathname } });
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#080B16] py-10 transition-colors duration-500">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* 🛠️ LEFT SIDEBAR: FILTERS */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-10">
                        <div className="bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">
                                <Filter size={18} className="text-blue-500" />
                                <h2 className="font-bold">Filters</h2>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Post Type</label>
                                    <div className="space-y-2">
                                        {postTypes.map(type => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(type)}
                                                    onChange={() => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                                                    className="rounded border-gray-300 dark:border-white/10 dark:bg-white/5 text-blue-500 focus:ring-0 w-4 h-4 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Sort By</label>
                                    <div className="space-y-1">
                                        {['Newest', 'Most Upvoted', 'Most Commented'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setSortBy(opt)}
                                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${sortBy === opt ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-2 border-t border-gray-100 dark:border-white/5 mt-4">
                                    <button onClick={resetFilters} className="flex-1 py-2 text-[10px] font-bold uppercase bg-gray-100 dark:bg-white/5 rounded-xl dark:text-gray-400 hover:bg-gray-200 transition-colors">Reset</button>
                                    <button onClick={handleApplyFilters} className="flex-1 py-2 text-[10px] font-bold uppercase bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors">Apply</button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 📰 CENTER FEED */}
                    <main className="lg:col-span-6 space-y-6">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Community Feed</h1>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search discussions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm dark:text-white shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleCreatePostClick}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20 shrink-0"
                                >
                                    <Plus size={20} />
                                    <span className="font-bold text-sm hidden sm:inline">New Post</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest">Refreshing Feed...</span>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {posts.map(post => (
                                        <motion.div
                                            key={post._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <PostCard
                                                post={post}
                                                searchQuery={searchQuery}
                                                onVote={(postId, type) => handleVote(postId, type)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </main>

                    {/* 🚀 RIGHT SIDEBAR: TRENDS */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-10">
                        <div className="bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm mb-4">
                                <History size={16} className="text-green-500" />
                                <span>Recent Activity</span>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center py-4">No recent activity</p>
                        </div>

                        <div className="bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-5 text-gray-900 dark:text-white font-bold text-sm">
                                <Flame size={18} className="text-orange-500" />
                                <span>Trending Now</span>
                            </div>
                            <div className="space-y-4">
                                {["2026 hiring cycle", "Interview tips", "Salary reveal"].map((trend, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-gray-300 dark:text-white/20">0{i + 1}</span>
                                            <span className="text-xs font-bold dark:text-gray-300 group-hover:text-blue-500 transition-colors">{trend}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* THE MODAL COMPONENT */}
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPostCreated={() => {
                    refreshFeed(); // Trigger re-fetch of posts
                    setIsModalOpen(false); // Close modal
                }}
            />
        </div>
    );
}