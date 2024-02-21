import express from 'express'
import User from '../../models/User.js'

const router = express.Router();

router.put('/', async (req, res) => {

    if (!req.isAuthenticated()) {
        return res.json({ success: false, status: 'Login to continue.' });
    }

    const { userIdToFollow } = req.body;

    try {
        const currentUser = await User.findById(req.user._id);

        const userToFollow = await User.findById(userIdToFollow);

        if (!userToFollow) {
            return res.json({ success: false, status: 'Something went wrong.' });
        }

        const isFollowing = req.user.following.includes(userToFollow._id);

        if (isFollowing) {
            currentUser.following.pull(userToFollow._id);
            userToFollow.followers.pull(currentUser._id);
        }

        else {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({ success: true, status: isFollowing ? `Unfollowed ${userToFollow.username}` : `Followed ${userToFollow.username}` });
    } catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Internal server error' });
    }
});

export default router;
