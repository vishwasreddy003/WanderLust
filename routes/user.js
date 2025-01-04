const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const UserController = require("../controllers/user");

router.route("/signup")
    .get(UserController.signupform)
    .post(wrapAsync(UserController.signupUser));

router.route("/login")
    .get(UserController.loginform)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }),
        UserController.loginUser
    );

router.get("/logout", UserController.logoutUser);


module.exports = router;