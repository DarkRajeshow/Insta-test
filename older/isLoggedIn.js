import express from "express";
const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    console.log(`is authenticated ${req.isAuthenticated()}`);
    if (req.isAuthenticated()) {
        res.json({ success: true })
    }
    else {
        res.json({ success: false, status: "To continue you need to login!" })
    }
});

export default router;
