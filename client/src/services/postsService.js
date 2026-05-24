import api from '../utils/api'; // Your Axios instance with interceptors

/**
 * 📡 Fetches posts from the database with support for 
 * Search, Filtering, and Sorting.
 */
export const getAllPosts = async (params = {}) => {
    try {
        // params: { search, types, sort, page, limit }
        const response = await api.get('/api/posts', { params });

        // Logic: Return the array of posts directly
        // Matches res.json(posts) in your controller
        return response.data;
    } catch (error) {
        console.error("Error fetching posts from server:", error);
        throw error;
    }
};

/**
 * 🚀 Creates a new post in the MongoDB database
 */
export const createNewPost = async (postData) => {
    try {
        // postData: { title, content, postType, image, isAnonymous }
        const response = await api.post('/api/posts/create', postData);
        return response.data;
    } catch (error) {
        console.error("Error creating post on server:", error);
        throw error;
    }
};

/**
 * 🗳️ Handles Upvotes/Downvotes
 * This name must match exactly what you import in usePosts.js
 */
export const votePost = async (postId, voteType) => {
    try {
        // voteType: 'up' or 'down'
        const response = await api.patch(`/api/posts/${postId}/vote`, { voteType });
        return response.data;
    } catch (error) {
        console.error("Voting failed:", error);
        throw error;
    }
};

/**
 * 🗑️ Deletes a post
 */
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/api/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

export const reportPost = async (postId, reason) => {
    const { data } = await axios.patch(`/api/posts/${postId}/report`, { reason });
    return data;
};