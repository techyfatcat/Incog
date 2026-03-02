import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: { type: String, required: true },
    authorAvatar: { type: String },
    text: { type: String, required: true },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }], // Support for comment likes
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    postType: {
        type: String,
        required: true,
        enum: [
            'Interview Experience', 'OA Experience', 'Final Offer Story',
            'Rejection Experience', 'Salary Reveal', 'Market Trend',
            'Study Resource', 'Placement Strategy'
        ]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    hp: {
        type: Number,
        default: 0
    },
    // Tracking arrays to prevent double-voting
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Embedded Comments
    comments: [commentSchema],
    commentsCount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: null
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Text index for high-performance searching
postSchema.index({ title: 'text', content: 'text' });

export const Post = mongoose.model('Post', postSchema);