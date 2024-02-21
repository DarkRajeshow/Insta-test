import express from 'express'
import User from '../../models/User.js';

const router = express.Router();

/* GET users listing. */
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userWhomFollowing = await User.findById(id).populate("followers");

        const followers = userWhomFollowing.followers;
        res.json({ success: true, users: followers })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, status: "Something went wrong....." })
    }
});

export default router;
