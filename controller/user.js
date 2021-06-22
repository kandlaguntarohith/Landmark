const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const catchError = require("../utils/catch-error");
const ExpressError = require("../utils/express-error");

module.exports.renderRegister = async (req, res, next) => {
  res.render("user/register");
};
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully created a user !!");
      res.redirect("/landmarks");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};
module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};
module.exports.login = (req, res) => {
  req.flash("success", "Welcome, back");
  const redirectUrl = req.session.returnTo || "/landmarks";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
  req.logOut();
  req.flash("success", "GoodBye!");
  res.redirect("/landmarks");
};
