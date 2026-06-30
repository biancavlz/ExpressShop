const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6a3e4de333135a8302288e37")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.user = user._id;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.redirect("/");
  });
};
