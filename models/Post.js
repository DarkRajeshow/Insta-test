import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ["video", "image"],
        required: true
    },
    media: {
        type: String,
        required: true,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    saved: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

    //for searching.
    caption: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tags: [String]
});

// Indexes
postSchema.index({ username: 'text', name: 'text', caption: 'text', tags: 'text' });

// Virtuals
postSchema.virtual('timePassed').get(function () {
    const currentDate = new Date();
    const postDate = this._id.getTimestamp();

    const timeDifference = currentDate - postDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else {
        return `${seconds}s`;
    }
});

// Ensure virtuals are included in JSON output
postSchema.set('toJSON', { virtuals: true });

// Ensure virtuals are included in Object output (e.g., res.send)
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
