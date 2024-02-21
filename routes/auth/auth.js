
import User from '../../models/User.js';
import { hashPassword, comparePasswords } from './bcrypt.js';

export function initializeSession(req, res, next) {
    if (!req.session.user) {
        req.session.user = {};
    }
    next();
}

export async function serializeUser(req, res, next) {
    if (req.session.user && req.session.user._id) {
        try {
            const user = await User.findById(req.session.user._id);
            if (user) {
                req.user = user;
            }
        } catch (error) {
            console.error('Error deserializing user:', error);
        }
    }
    next();
}

export function isLoggedIn(req, res, next) {
    if (req.user._id) {
        return res.json({ success: true });
    }
    res.json({ success: false, status: "Login to continue" });
}

export function isAuthenticated(req, res, next) {
    req.isAuthenticated = () => {
        return req.user !== undefined;
    };
    next();
}


export async function registerUser(req, res, next) {
    const { email, password, username, name, gender } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.json({ success: true, message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        user = new User({
            email,
            password: hashedPassword,
            username,
            name,
            gender
        });

        await user.save();

        req.session.user = { _id: user._id };
        req.user = user;
        console.log(req.user);

        res.cookie('userId', req.user._id.toString());

        res.json({ status: 'User registered and logged in successfully', user, success: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.json({ success: false, status: 'Internal Server Error' });
    }
}


// Route handler for user login
export async function loginUser(req, res, next) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.json({ success: false, status: 'Invalid email or password' });
        }

        const passwordMatch = await comparePasswords(password, user.password);
        console.log(password);
        console.log(user.password);
        console.log(passwordMatch);

        if (!passwordMatch) {
            return res.json({ success: false, status: 'Invalid email or password' });
        }

        req.session.user = { _id: user._id };
        req.user = user;
        console.log(req.user);

        res.cookie('userId', req.user._id.toString());
        res.json({ success: true, status: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.json({ success: false, status: 'Internal Server Error' });
    }
}

// Route handler for user logout
export function logoutUser(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.json({ success: false, status: "Something went wrong." });
        }

        res.user = undefined;
        res.clearCookie('userId');
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ success: true, status: "Logged out successfully." });
    });
}


