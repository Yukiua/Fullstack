export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("login or sign in first")
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/performer/login');
}
export function ensureAuthenticatedCustomer(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("login or sign in first")
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/user/login');
}

export function ensureAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("login or sign in first")
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/admin/login');
}