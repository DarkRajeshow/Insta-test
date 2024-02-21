import express from 'express'
import upload from '../../utility/multer.js'
import User from '../../models/User.js'
import Post from '../../models/Post.js'

const router = express.Router();

router.post('/', upload.single("file"), async function (req, res) {
    if (!req.isAuthenticated()) {
        res.json({ success: false, status: "To upload the post, you must first log in." })
    }

    if (!req.file) {
        res.json({ success: false, status: "Media field is required." })
    }

    try {
        const { caption, type, username, name, tags } = req.body;

        const tagsArray = tags.split(",");
        const newPost = await Post.create({
            caption,
            type,
            username,
            name,
            tags: tagsArray,
            author: req.user._id,
            media: req.file.filename,
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                posts: newPost._id
            }
        })

        res.json({ success: true, status: "The post has been created." })
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, status: "Sorry, something went wrong." })
    }
});

export default router;
