const User = require("../Models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("Users/register");
};
module.exports.newUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const user = await User.register(newUser, password);
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to campground");
      res.redirect("/campground");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
module.exports.renderLoginForm = (req, res) => {
  res.render("Users/login");
};
module.exports.loginUser = (req, res) => {
  const returnUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  req.flash("success", "Welcome Back!!!");
  res.redirect(returnUrl);
};
module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out!!!");
  res.redirect("/");
};
