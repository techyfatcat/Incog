import { useState, useEffect, useCallback } from "react";
import { getAllPosts, votePost, reportPost as reportPostService } from "../services/postsService";

export const usePosts = (searchQuery, activeFilters) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [debouncedQuery, setDebouncedQuery] = useState("");

    // 🔥 Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 🔥 Reset when filters/search change
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [
        debouncedQuery,
        activeFilters?.sort,
        JSON.stringify(activeFilters?.types || [])
    ]);

    // 🔥 Fetch posts (pagination)
    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const params = {
                page,
                limit: 10,
            };

            if (debouncedQuery) params.search = debouncedQuery;
            if (activeFilters?.types?.length)
                params.types = activeFilters.types.join(",");
            if (activeFilters?.sort) params.sort = activeFilters.sort;

            const data = await getAllPosts(params);

            const newPosts = Array.isArray(data) ? data : data.posts || [];

            setPosts((prev) => {
                // 🔥 prevent duplicates
                const existingIds = new Set(prev.map(p => p._id));
                const filtered = newPosts.filter(p => !existingIds.has(p._id));
                return [...prev, ...filtered];
            });

            // 🔥 stop if no more data
            if (newPosts.length < 10) {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Feed error:", error);
        } finally {
            setLoading(false);
        }
    }, [
        page,
        debouncedQuery,
        activeFilters?.sort,
        JSON.stringify(activeFilters?.types || []),
        hasMore,
        loading
    ]);

    // 🔥 Trigger fetch
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // 🔥 Load more (infinite scroll trigger)
    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    // 🚀 Optimistic Vote
    const handleVote = useCallback(async (postId, voteType) => {
        const originalPosts = [...posts];

        setPosts(prev =>
            prev.map(post => {
                if (post._id === postId) {
                    const change = voteType === "up" ? 1 : -1;
                    return { ...post, hp: (post.hp || 0) + change };
                }
                return post;
            })
        );

        try {
            await votePost(postId, voteType);
        } catch (error) {
            console.error("Vote failed:", error);
            setPosts(originalPosts);
        }
    }, [posts]);

    // 🚩 Report
    const handleReport = useCallback(async (postId, reason) => {
        try {
            await reportPostService(postId, reason);

            setTimeout(() => {
                setPosts(prev => prev.filter(p => p._id !== postId));
            }, 1200);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Failed"
            };
        }
    }, []);

    return {
        posts,
        loading,
        hasMore,
        loadMore,
        handleVote,
        handleReport,
    };
};