import express from 'express'
import User from '../../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { full, username } = req.query;
    try {
        if (username) {
            const usernameRegex = new RegExp(username, 'i');
            if (full === "false") {
                const user = await User.findOne({
                    username: {
                        $regex: usernameRegex
                    }
                });

                if (user) {
                    res.json({ success: true, user });
                }
                else {
                    res.json({ success: false });
                }
            } else {
                const user = await User.findOne({
                    username: {
                        $regex: usernameRegex
                    }
                }).populate("posts");

                if (user) {
                    res.json({ success: true, user });
                }
                else {
                    res.json({ success: false });
                }
            }
        }
        else {
            res.json({ success: true, status: "Not found." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, status: "Something went wrong....." });
    }
});

export default router;
