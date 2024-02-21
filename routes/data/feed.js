
import express from 'express'
import User from '../../models/User.js';
import Post from '../../models/Post.js';

const router = express.Router();

const limit = 5;

router.get('/:offset', async (req, res) => {

    try {

        const offset = Number(req.params.offset);

        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id);
            const followingIds = currentUser.following;
            let feedPosts = await Post.find({ author: { $in: followingIds } })
                .sort({ createdAt: -1, likes: -1 })
                .populate('author')
                .limit(limit)
                .skip(offset * limit)

            if (feedPosts.length === 0) {
                feedPosts = await Post.find({ author: { $ne: req.user._id } })
                    .sort({ likes: -1, createdAt: -1 })
                    .populate('author')
                    .limit(limit)
                    .skip(offset * limit);
            }
            res.json({ success: true, feed: feedPosts });
        }

        else {
            const feedPosts = await Post.find()
                .sort({ likes: -1, createdAt: -1 })
                .populate('author')
                .limit(limit)
                .skip(offset * limit)

            res.json({ success: true, feed: feedPosts });
        }
    }

    catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Something went wrong.' });
    }
});

export default router;
