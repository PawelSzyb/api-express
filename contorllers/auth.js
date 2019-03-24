const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secret = require("../config/keys").secret;

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  if (!errors.isEmpty()) {
    const error = new Error({ msg: "Validation failed" });
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  bcrypt
    .hash(password, 12)
    .then(hash => {
      const newUser = new User({
        email: email,
        name: name,
        password: hash
      });
      return newUser.save();
    })
    .then(result => {
      res.status(201).json({ msg: "User registred", user_id: result._id });
    })
    .catch(error => {
      if (!errors.statusCode) {
        errors.statusCode = 500;
      }

      next(error);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userData;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error("There is no user with this email");
        error.statusCode = 401;
        throw error;
      }
      userData = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isMatch => {
      if (!isMatch) {
        const error = new Error("Wrong password");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: userData.email,
          user_id: userData._id
        },
        secret,
        {
          expiresIn: "1h"
        }
      );
      res.status(200).json({ token, userId: userData._id.toString() });
    })
    .catch(error => {
      if (!errors.statusCode) {
        errors.statusCode = 500;
      }

      next(error);
    });
};
