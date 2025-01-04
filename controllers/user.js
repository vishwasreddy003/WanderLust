const User = require("../models/user");

module.exports.signupform = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = { username, email };

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WanderLust :)");
            res.redirect("/listings");

        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome Traveller :)");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }

        req.flash("success", "Logged out Successfully");
        res.redirect("/listings");
    })
};