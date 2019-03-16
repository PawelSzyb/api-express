const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");
const User = require("../models/User");
const authController = require("../contorllers/auth");

// PUT /auth/register
// create new user

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Enter valid email")
      .custom((value, { req }) => {
        User.findOne({ email: value }).then(user => {
          if (user) {
            new Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("passwrod")
      .trim()
      .isLength({ min: 6 }),
    body("name")
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

module.exports = router;
