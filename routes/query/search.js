import express from 'express'
import User from '../../models/User.js';

const router = express.Router();

router.get('/:query', async (req, res) => {
    try {
        const queryString = req.params.query;
        const users = await User.find({
            $or: [
                { username: { $regex: `^${queryString}`, $options: 'i' } },
                { name: { $regex: `^${queryString}`, $options: 'i' } }
            ]
        });

        res.json({ success: true, users });
    }
    
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;
