import express from 'express';

const router = express.Router();

router.get("/", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.json({ success: false, status: "Something went wrong." })
        }
        res.json({ success: true, status: "Logged out successfully." })
    })
})

export default router;
