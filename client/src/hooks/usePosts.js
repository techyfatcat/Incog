import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, votePost, reportPost as reportPostService } from '../services/postsService';

export const usePosts = (searchQuery, activeFilters) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // 1. Debounce Search Query to prevent excessive API calls
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Fetch Data from Backend
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};

            if (debouncedQuery) {
                params.search = debouncedQuery;
            }

            if (activeFilters?.types?.length) {
                params.types = activeFilters.types.join(',');
            }

            if (activeFilters?.sort) {
                params.sort = activeFilters.sort;
            }

            const data = await getAllPosts(params);
            // Ensure we handle both {posts: []} and [] formats
            setPosts(Array.isArray(data) ? data : data.posts || []);
        } catch (error) {
            console.error("Feed error:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, activeFilters]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // 🚀 Optimistic Vote Handler
    const handleVote = useCallback(async (postId, voteType) => {
        const originalPosts = [...posts];

        // Update UI immediately (Optimistic UI)
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === postId) {
                    const change = voteType === 'up' ? 1 : -1;
                    return { ...post, hp: (post.hp || 0) + change };
                }
                return post;
            })
        );

        try {
            await votePost(postId, voteType);
        } catch (error) {
            console.error("Vote failed, rolling back:", error);
            setPosts(originalPosts);
        }
    }, [posts]);

    // 🚩 Report Post Handler
    const handleReport = useCallback(async (postId, reason) => {
        try {
            await reportPostService(postId, reason); // Pass reason to your service

            // 🚀 THE HIDE LOGIC: Remove it from the local posts array immediately
            setTimeout(() => {
                setPosts(prev => prev.filter(post => post._id !== postId));
            }, 1600); // Matches the UI success message duration

            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || "Failed to report" };
        }
    }, []);

    return {
        posts,
        loading,
        debouncedQuery,
        handleVote,
        handleReport, // New capability
        refreshFeed: fetchPosts
    };
};