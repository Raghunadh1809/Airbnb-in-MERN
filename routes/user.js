const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router
  .route("/signUp")
  .get(userController.rendersignupForm)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );

router.get("/logout", userController.Logout);

module.exports = router;

// // Sign Up
// router.get("/signUp", userController.rendersignupForm);

// router.post("/signUp", wrapAsync(userController.signUp));

// // Login page

// router.get("/login", userController.renderLoginForm);
// // .authenticate() – For authenticating users during login.
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login", // After failed login, redirect to given URL.
//     failureFlash: true, // True to flash failure messages or a string to use as a flash message for failures (overrides any from the strategy itself).
//   }),
//   userController.Login
// );

// // Logout

// router.get("/logout", userController.Logout);

// module.exports = router;
