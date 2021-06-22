const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catch-error");
const user = require("../controller/user");

router
  .route("/register")
  .get(catchError(user.renderRegister))
  .post(catchError(user.register));
router
  .route("/login")
  .get(user.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );
router.get("/logout", user.logout);
module.exports = router;
