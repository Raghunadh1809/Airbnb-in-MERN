const User = require("../models/user.js");

module.exports.rendersignupForm = (req, res) => {
  res.render("./User/signUp.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      username: username,
      email: email,
    });
    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        console.log(err);
      }
      req.flash("success", "Welcome to the site!");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signUp");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./User/login.ejs");
};

module.exports.Login = async (req, res) => {
  req.flash("success", "Welcome to WanderLust !");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.Logout = (req, res) => {
  req.logout((err) => {
    // Terminate an existing login session.
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
};
