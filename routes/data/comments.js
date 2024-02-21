import express from 'express'
import User from '../../models/User.js';
import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js'

const router = express.Router();

router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({
            post: postId
        })
            .populate("author")
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });

    } catch (error) {
        console.log(error);
        res.json({ success: false, status: "Something went wrong....." });
    }
});



router.post('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const text = req.body.text;
        if (req.isAuthenticated()) {
            const comment = await Comment.create({
                author: req.user._id,
                post: postId,
                text: text
            });

            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    comments: comment._id
                }
            })

            await Post.findByIdAndUpdate(postId, {
                $push: {
                    comments: comment._id
                }
            })

            res.json({ success: true, status: "Comment added." });
        }
        else {
            res.json({ success: false, status: "Login to continue." });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, status: "Something went wrong.." });
    }
});


router.delete('/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;

        // Check if the user is authenticated
        if (req.isAuthenticated()) {
            const comment = await Comment.findById(commentId);
            if (comment) {
                if (comment.author.equals(req.user._id)) {
                    await User.findByIdAndUpdate(req.user._id, {
                        $pull: {
                            comments: commentId
                        }
                    });

                    await Post.findByIdAndUpdate(comment.post, {
                        $pull: {
                            comments: commentId
                        }
                    });

                    await Comment.findByIdAndDelete(commentId);

                    console.log(true);
                    res.json({ success: true, status: 'Comment deleted.' });
                } else {
                    console.log(false);
                    res.json({ success: false, status: 'You are not authorized to delete this comment.' });
                }
            } else {
                res.json({ success: false, status: 'Comment not found.' });
            }
        } else {
            res.json({ success: false, status: 'Login to continue.' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, status: 'Something went wrong.' });
    }
});


router.put('/like', async function (req, res) {

    if (!req.isAuthenticated()) {
        res.json({ success: false, status: "Login to continue." })
    }

    try {
        const { commentId } = req.body;
        const userId = req.user._id;
        const comment = await Comment.findById(commentId);
        const userLikedComment = comment.likes.indexOf(userId) >= 0;

        if (userLikedComment) {
            await Comment.findByIdAndUpdate(commentId, {
                $pull: {
                    likes: userId
                }
            });

            res.json({ success: true, status: "Like removed." });
        }

        else {
            await Comment.findByIdAndUpdate(commentId, {
                $push: {
                    likes: userId
                }
            });

            res.json({ success: true, status: "Liked." });
        }
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, status: "Something went wrong." });
    }
});


export default router;