const express = require("express");
const router = express.Router();
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const {isLoggedIn, saveOriginalUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

router.get("/signup", userController.renderSigupForm);

router.post("/signup", userController.addNewUser);

router.get("/login", userController.renderLoginForm);

router.post("/login",saveOriginalUrl, passport.authenticate("local", {
    failureRedirect : "/users/login",
    failureFlash: true,
}),userController.login);

router.get("/logout",isLoggedIn, userController.logout);




module.exports = router;