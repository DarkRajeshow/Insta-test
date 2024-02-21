import express from 'express'
import passport from 'passport';
import localStrategy from 'passport-local'
import User from '../models/User.js';

passport.use(new localStrategy(User.authenticate()))

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, email, name, gender } = req.body;
    const userData = new User({ username, email, name, gender });

    await User.register(userData, req.body.password);

    passport.authenticate("local")(req, res, () => {
      // res.cookie('userId', req.user._id.toString());
      res.cookie('userId', req.user._id.toString());
      res.json({ success: true, status: "Your account has been created successfully.", user: req.user })
    });
  }

  catch (err) {
    console.error(err);
    const errorMessage = (err.name === 'UserExistsError') ? 'User already exists.' : 'Username or email already exists.';
    res.json({ status: errorMessage, success: false });
  }
});

export default router;