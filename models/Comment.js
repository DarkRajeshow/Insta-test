import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ]
});

commentSchema.virtual('timePassed').get(function () {
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
commentSchema.set('toJSON', { virtuals: true });

// Ensure virtuals are included in Object output (e.g., res.send)
commentSchema.set('toObject', { virtuals: true });

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export default Comment;
