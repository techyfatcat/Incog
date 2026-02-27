import express from 'express';
import {
    createPost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    deletePost,
    handleVote,
    addComment,
    deleteComment,
    toggleCommentLike, // 🆕 Added
    getUserComments    // 🆕 Added
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🔓 PUBLIC ROUTES
router.get('/', getAllPosts);
router.get('/user/:userId', getPostsByUser);
// Note: /:id is moved below /profile/comments to avoid route conflicts

// 🔒 PROTECTED ROUTES (Require JWT Token)
router.post('/create', protect, createPost);

// 👤 USER ACTIVITY & PROFILE
// This matches the frontend call: api.get('/posts/profile/comments')
router.get('/profile/comments', protect, getUserComments);

// 🗳️ VOTING & SPECIFIC POSTS
router.get('/:id', getPostById);
router.patch('/:postId/vote', protect, handleVote);
router.delete('/:postId', protect, deletePost);

// 💬 COMMENT ROUTES
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.put('/:id/comment/:commentId/like', protect, toggleCommentLike); // 🆕 Added for Heart button

export default router;