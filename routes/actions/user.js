import express from 'express'
import upload from '../../utility/multer.js'
import User from '../../models/User.js'

const router = express.Router();

router.get('/', async (req, res) => {
    const full = req.query.full;

    try {
        console.log("req.user : " + req.user);
        console.log(req.session);
        console.log(req.cookies);


        if (req.isAuthenticated()) {
            if (full === "true") {
                const user = await User.findById(req.user._id).populate("posts");
                res.json({ success: true, user });
            } else {
                res.json({ success: true, user: req.user });
            }
        } else {
            res.json({ success: false, user: null });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, status: "Something went wrong....." });
    }
});

router.get('/following', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user._id).populate("following");
            res.json({ success: true, user });
        } else {
            res.json({ success: false, status: "Login to continue" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, status: "Something went wrong....." });
    }
});


router.put('/', upload.single("file"), async function (req, res) {

    if (!req.isAuthenticated()) {
        res.json({ success: false, status: "User Session expired." })
    }
    try {
        const newUserData = req.body;

        if (req.file) {
            await User.findByIdAndUpdate(req.user._id, {
                ...newUserData,
                dp: req.file.filename,
            }, {
                new: true
            });
        }

        else {
            await User.findByIdAndUpdate(req.user._id, newUserData, { new: true })
        }

        res.json({ success: true, status: "Profile updated successfully." })
    }

    catch (err) {
        console.log(err);
        res.json({ success: true, status: "Something went wrong..." })
    }
});

export default router;
