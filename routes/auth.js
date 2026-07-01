const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password", "Password needs to be valid")
      .isLength({ min: 4 })
      .withMessage("Please enter a valid password")
      .isAlphanumeric(),
  ],
  authController.postLogin,
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick another one",
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and with at least 4 characters",
    )
      .isLength({ min: 4 })
      .isAlphanumeric(),
    // body("confirmPassword").custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     throw new Error("Passwords have to match");
    //   }
    //   return true;
    // }),
  ],
  authController.postSignup,
);
router.get("/signup", authController.getSignup);
router.post("/logout", authController.postLogout);

module.exports = router;
