import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, votePost } from '../services/postsService';

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
            const params = {
                search: debouncedQuery,
                types: activeFilters?.types?.join(','),
                sort: activeFilters?.sort
            };

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
        // Keep a snapshot for rollback if API fails
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

        // Persist change to database
        try {
            await votePost(postId, voteType);
        } catch (error) {
            console.error("Vote failed, rolling back:", error);
            setPosts(originalPosts);
        }
    }, [posts]);

    return {
        posts,
        loading,
        debouncedQuery,
        handleVote,
        refreshFeed: fetchPosts
    };
};