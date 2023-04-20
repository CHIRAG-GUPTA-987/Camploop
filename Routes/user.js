const express = require("express");
const Router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../Controllers/User");

//REGISTERING ROUTES

Router.route("/register")
  .get(User.renderRegisterForm)
  .post(catchAsync(User.newUser));

//LOGIN ROUTES

Router.route("/login")
  .get(User.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    User.loginUser
  );

//LOGOUT ROUTES

Router.route("/logout").get(User.logoutUser);

module.exports = Router;
