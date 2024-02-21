import mongoose from 'mongoose';
import plm from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "Hey, I am using Instagram!"
    },
    dp: {
        type: String,
        default: 'default-profile.jpg',
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    liked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    conversations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
    ],
});

// Virtual for calculating time passed since user creation
userSchema.virtual('timePassed').get(function () {
    const currentDate = new Date();
    const userCreationDate = this._id.getTimestamp();

    const timeDifference = currentDate - userCreationDate;

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
userSchema.set('toJSON', { virtuals: true });

// Ensure virtuals are included in Object output (e.g., res.send)
userSchema.set('toObject', { virtuals: true });

userSchema.plugin(plm);

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User;
