const User = require("../models/user.js");

module.exports.signupform = async (req, res) => {
    res.render("signup.ejs");
}

module.exports.signupPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const NewUser = User({
            email: email,
            username: username,
        });
        const registeredUser = await User.register(NewUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            else {
                req.flash("success", "Welcome to WanderLust!");
                res.redirect("/listings");
            }
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.loginform = async (req, res) => {
    res.render("login.ejs");
}

module.exports.loginPost = async (req, res) => {

    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // or operator is here to address a flaw
    if (redirectUrl.includes("/delete")) {
        safeUrl = redirectUrl.replace("/delete", '');
        res.redirect(safeUrl);
    }
    else {
        res.redirect(redirectUrl);
    }
}

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        else {
            req.flash("success", "User logged out!");
            res.redirect("/listings");
        }
    })
}