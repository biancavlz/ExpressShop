const path = require("../utils/path");

exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page not found",
    path: req.url,
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};
