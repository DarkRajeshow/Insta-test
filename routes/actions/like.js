import express from 'express'
import User from '../../models/User.js';
import Post from '../../models/Post.js';

const router = express.Router();

/* GET users listing. */
router.put('/', async function (req, res) {

    if (!req.isAuthenticated()) {
        res.json({ success: false, status: "To add the post, you must log in." })
    }

    try {
        const { postId } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        const userLiked = post.likes.indexOf(userId) >= 0;

        if (userLiked) {
            // If the user has already liked the post, remove the like
            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    likes: userId
                }
            });

            // Remove post from user's liked array
            await User.findByIdAndUpdate(userId, {
                $pull: {
                    liked: postId
                }
            });
            res.json({ success: true, status: "Like removed." });
        } else {
            // If the user hasn't liked the post, add the like
            await Post.findByIdAndUpdate(postId, {
                $push: {
                    likes: userId
                }
            });

            // Add post to user's liked array
            await User.findByIdAndUpdate(userId, {
                $push: {
                    liked: postId
                }
            });
            res.json({ success: true, status: "post Liked." });
        }
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, status: "Something went wrong." });
    }
});

export default router;
