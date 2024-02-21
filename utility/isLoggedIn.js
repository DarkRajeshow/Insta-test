const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.json({ success: false, loggedIn: false })
}

export default isLoggedIn;