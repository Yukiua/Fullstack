export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("login or sign in first")
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/performer/login');
}