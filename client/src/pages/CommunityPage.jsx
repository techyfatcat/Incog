import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Filter,
    Flame, History, ChevronRight, SlidersHorizontal, RotateCcw, Check
} from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/feed/PostCard';
import CreatePostModal from '../components/CreatePostModal';

export default function CommunityPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [recentPosts, setRecentPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const syncAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };
        window.addEventListener('storage', syncAuth);
        return () => window.removeEventListener('storage', syncAuth);
    }, []);

    useEffect(() => {
        const loadRecent = () => {
            const stored = JSON.parse(localStorage.getItem("recentPosts")) || [];
            setRecentPosts(stored);
        };
        loadRecent();
        window.addEventListener("storage", loadRecent);
        return () => window.removeEventListener("storage", loadRecent);
    }, []);

    const postTypes = [
        'Interview Experience', 'OA Experience', 'Final Offer Story',
        'Rejection Experience', 'Salary Reveal', 'Market Trend',
        'Study Resource', 'Placement Strategy'
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState(postTypes);
    const [sortBy, setSortBy] = useState('Newest');
    const [appliedFilters, setAppliedFilters] = useState({ types: postTypes, sort: 'Newest' });

    const { posts, loading, handleVote, refreshFeed } = usePosts(searchQuery, appliedFilters);

    const handleApplyFilters = () => {
        setAppliedFilters({
            types: selectedTypes.length === 0 ? [] : selectedTypes,
            sort: sortBy
        });
    };

    const resetFilters = () => {
        setSelectedTypes(postTypes);
        setSortBy('Newest');
        setAppliedFilters({ types: postTypes, sort: 'Newest' });
    };

    const handleCreatePostClick = () => {
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
                    <aside className="hidden lg:block lg:col-span-3 sticky top-10 px-2">
                        <div className="bg-white dark:bg-[#121624] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-white/[0.08] transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal size={16} className="text-blue-500" />
                                    <h2 className="text-[14px] font-bold text-gray-900 dark:text-white tracking-tight font-sans">
                                        Filters
                                    </h2>
                                </div>
                                <button
                                    onClick={resetFilters}
                                    className="text-[11px] font-semibold text-gray-400 hover:text-blue-500 transition-colors font-sans uppercase tracking-wider"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-3 font-sans uppercase tracking-tight">
                                    Category
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {postTypes.map(type => {
                                        const active = selectedTypes.includes(type);
                                        return (
                                            <button
                                                key={type}
                                                onClick={() =>
                                                    setSelectedTypes(prev =>
                                                        prev.includes(type)
                                                            ? prev.filter(t => t !== type)
                                                            : [...prev, type]
                                                    )
                                                }
                                                className={`
                                                    px-3 py-1.5 rounded-full text-[11px] font-medium transition-all border font-sans
                                                    ${active
                                                        ? 'bg-[#F0F7FF] dark:bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                                        : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500 hover:border-gray-300 dark:hover:border-white/20'
                                                    }
                                                `}
                                            >
                                                {type}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[12px] font-bold text-gray-400 dark:text-gray-500 mb-3 font-sans uppercase tracking-tight">
                                    Sort By
                                </p>
                                <div className="flex flex-col gap-1">
                                    {["Newest", "Most Upvoted", "Most Commented"].map((opt) => {
                                        const active = sortBy === opt;
                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => setSortBy(opt)}
                                                className={`
                                                    flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium transition-all font-sans
                                                    ${active
                                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10'
                                                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                                    }
                                                `}
                                            >
                                                <div className={`
                                                    w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0
                                                    ${active ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-white/20'}
                                                `}>
                                                    {active && <Check size={10} className="text-white" strokeWidth={4} />}
                                                </div>
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleApplyFilters}
                                className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-bold font-sans transition-all shadow-md shadow-blue-500/10 active:scale-[0.98]"
                            >
                                Apply Filters
                            </button>
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
                                        className="w-full bg-white dark:bg-[#121624] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm dark:text-white shadow-sm"
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
                                                onReport={async (postId, reason) => {
                                                    console.log(`Reporting post ${postId} for ${reason}`);
                                                    return { success: true };
                                                }}
                                                onDelete={(postId) => console.log(`Deleting post ${postId}`)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </main>

                    {/* 🚀 RIGHT SIDEBAR: TRENDS & ACTIVITY */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-10">
                        <div className="bg-white dark:bg-[#121624] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm transition-colors duration-300">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm mb-4">
                                <History size={16} className="text-green-500" />
                                <span>Recent Activity</span>
                            </div>
                            <div className="space-y-3">
                                {recentPosts.length === 0 ? (
                                    <p className="text-[11px] text-gray-400 text-center py-4">No recent posts yet</p>
                                ) : (
                                    recentPosts.map((post) => (
                                        <div
                                            key={post._id}
                                            onClick={() => navigate(`/post/${post._id}`)}
                                            className="cursor-pointer group"
                                        >
                                            <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 line-clamp-2 transition-colors">
                                                {post.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{post.postType}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#121624] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm transition-colors duration-300">
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

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPostCreated={() => {
                    refreshFeed();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}