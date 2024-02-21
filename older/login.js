import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post("/", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({ success: false, status: "Invalid username or password." });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            // res.cookie('userId', (req.user._id).toString());

            res.cookie('userId', (req.user._id).toString());

            console.log("req.user : " + req.user);
            console.log(req.session);
            console.log(req.cookies);

            res.json({ success: true, status: "Logged in successfully.", user: req.user });
        });
    })(req, res, next);
});

export default router;
