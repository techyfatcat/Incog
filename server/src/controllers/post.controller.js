import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/User.model.js";

/**
 * 🚀 CREATE POST: Includes Title, PostType, and +20 HP Reward
 */
export const createPost = async (req, res) => {
    try {
        const { title, content, postType, image, isAnonymous } = req.body;

        if (!content || !title || !postType) {
            return res.status(400).json({ message: "Title, content, and post type are required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const post = await Post.create({
            author: req.user.id,
            username: isAnonymous ? "Anonymous" : user.username,
            title,
            content,
            postType,
            image: image || null,
            isAnonymous: !!isAnonymous
        });

        // Reward user for contributing
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { "stats.hp": 20 },
        });

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

/**
 * 📡 GET ALL POSTS: Handles Search, Type Filtering, and Sorting
 */
export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, types, sort } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }

        if (types) {
            const typeArray = types.split(',');
            query.postType = { $in: typeArray };
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'Most Upvoted') sortOption = { hp: -1 };
        if (sort === 'Most Commented') sortOption = { commentsCount: -1 };

        const posts = await Post.find(query)
            .populate("author", "username avatarSeed")
            .sort(sortOption)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

/**
 * 🗳️ VOTE POST (Combined Up/Down Logic)
 */
export const handleVote = async (req, res) => {
    try {
        const { postId } = req.params;
        const { voteType } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const change = voteType === 'up' ? 1 : -1;
        const authorReward = voteType === 'up' ? 2 : -1;

        const post = await Post.findByIdAndUpdate(
            postId,
            { $inc: { hp: change } },
            { new: true }
        );

        if (!post) return res.status(404).json({ message: "Post not found" });

        await User.findByIdAndUpdate(post.author, {
            $inc: { "stats.hp": authorReward },
        });

        res.json({ hp: post.hp, message: "Vote registered" });
    } catch (error) {
        res.status(500).json({ message: "Vote failed" });
    }
};

/**
 * 🗑️ DELETE POST: Removes post and deducts 20 HP
 */
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await post.deleteOne();

        await User.findByIdAndUpdate(req.user.id, {
            $inc: { "stats.hp": -20 },
        });

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};

/**
 * 🔍 GET SINGLE POST: For PostDetail page
 */
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("author", "username avatarSeed");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * 👤 GET POSTS BY USER: For profile pages
 */
export const getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ author: userId })
            .populate("author", "username avatarSeed")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user posts" });
    }
};

/**
 * 💬 ADD COMMENT: +5 HP Reward
 */
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const user = await User.findById(req.user.id);

        const newComment = {
            authorId: user._id,
            authorName: user.username,
            authorAvatar: user.avatarSeed,
            text,
            likes: [],
            createdAt: new Date()
        };

        const post = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: newComment }, $inc: { commentsCount: 1 } },
            { new: true }
        ).populate("author", "username avatarSeed");

        await User.findByIdAndUpdate(req.user.id, { $inc: { "stats.hp": 5 } });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment" });
    }
};

/**
 * ❤️ TOGGLE COMMENT LIKE
 */
export const toggleCommentLike = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);
        const comment = post.comments.id(commentId);

        const index = comment.likes.indexOf(userId);
        if (index === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(index, 1);
        }

        await post.save();
        res.json({ likes: comment.likes });
    } catch (error) {
        res.status(500).json({ message: "Failed to toggle like" });
    }
};

/**
 * 👤 GET ALL COMMENTS BY USER: Aggregation for Profile Activity
 */
export const getUserComments = async (req, res) => {
    try {
        const userId = req.user.id;
        const results = await Post.aggregate([
            { $unwind: "$comments" },
            { $match: { "comments.authorId": new mongoose.Types.ObjectId(userId) } },
            { $sort: { "comments.createdAt": -1 } },
            {
                $project: {
                    _id: "$comments._id",
                    text: "$comments.text",
                    createdAt: "$comments.createdAt",
                    likes: "$comments.likes",
                    postId: "$_id",
                    postTitle: "$title"
                }
            }
        ]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch activity" });
    }
};

/**
 * 🗑️ DELETE COMMENT
 */
export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const post = await Post.findById(id);
        const comment = post.comments.id(commentId);

        if (comment.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        post.comments.pull(commentId);
        post.commentsCount = Math.max(0, post.commentsCount - 1);
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete comment" });
    }
};