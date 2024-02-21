import express from 'express'
import Post from '../../models/Post.js';
import User from '../../models/User.js';

const router = express.Router();

router.get('/:offset', async (req, res) => {
    try {
        const offset = Number(req.params.offset);

        if (req.isAuthenticated()) {
            const currentUser = await User.findById(req.user._id);
            const likedPostIds = currentUser.liked;

            const likedPosts = await Post.find({ _id: { $in: likedPostIds } })
                .sort({ createdAt: -1, liked: -1 })
                .limit(6)
                .skip(offset * 6);

            res.json({ success: true, liked: likedPosts });
        } else {
            res.json({ success: false, liked: "Log in to continue." });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Something went wrong.' });
    }
});

export default router;
