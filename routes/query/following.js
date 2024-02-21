import express from 'express'
import User from '../../models/User.js';

const router = express.Router();

/* GET users listing. */
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userWhoFollowing = await User.findById(id).populate("following");
        const following = userWhoFollowing.following;
        res.json({ success: true, users: following })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, status: "Something went wrong....." })
    }
});

export default router;
