module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        //redirectURL
        req.session.redirectUrl = req.path;

        req.flash("error", "You must be logged in first!");
        res.redirect("/login");

    }
    else {
        next();
    }

};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
