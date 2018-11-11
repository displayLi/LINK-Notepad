module.exports = {
    navIntercept(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('err_msg', 'Please login first')
        res.redirect('/users/login');
    }
}