import express from 'express'
import User from '../../models/User.js'
import Post from '../../models/Post.js'

const router = express.Router();
/* GET users listing. */
router.put('/', async function (req, res) {

    if (!req.isAuthenticated()) {
        res.json({ success: false, status: "To add the post, you must log in." })
    }

    try {
        const { postId } = req.body;
        console.log(postId);
        const userId = req.user._id;
        const post = await Post.findById(postId);
        const userSaved = post.saved.indexOf(userId) >= 0;

        if (userSaved) {
            // If the user has already saved the post, remove the post
            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    saved: userId
                }
            });

            // Remove post from user's saved array
            await User.findByIdAndUpdate(userId, {
                $pull: {
                    saved: postId
                }
            });
            res.json({ success: true, status: "Removed successfully." });
        } else {
            // If the user hasn't saved the post, add the post
            await Post.findByIdAndUpdate(postId, {
                $push: {
                    saved: userId
                }
            });

            // Add post to user's saved array
            await User.findByIdAndUpdate(userId, {
                $push: {
                    saved: postId
                }
            });
            res.json({ success: true, status: "Saved successfully." });
        }
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, status: "Something went wrong." });
    }
});

export default router;
