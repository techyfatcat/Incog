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
    toggleCommentLike,
    getUserComments
} from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/user/:userId', getPostsByUser);

router.post('/create', protect, createPost);

router.get('/profile/comments', protect, getUserComments);

router.get('/:id', getPostById);
router.patch('/:postId/vote', protect, handleVote);
router.delete('/:postId', protect, deletePost);

router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.put('/:id/comment/:commentId/like', protect, toggleCommentLike);

export default router;