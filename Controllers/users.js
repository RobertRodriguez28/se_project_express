// const { isJWT } = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../Errors/BadRequestError");
const NotFoundError = require("../Errors/NotFoundError");
const ConflictError = require("../Errors/ConflictError");
const UnauthorizedError = require("../Errors/UnauthorizedError");
const InternalServerError = require("../Errors/InternalServerError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((newUser) => {
      const {
        _id,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
      } = newUser;
      res.status(200).send({
        _id,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Invalid data provided for user registration")
        );
        // return res.status(400).send({ message: err.message });
      }
      if (err.code === 11000) {
        return next(new ConflictError("User with this email already exists"));
        // res.status(409)
        // .send({ message: "Conflict Error, such a user already exists" });
      }
      // return res.status(500).send({ error: "There has been an error " });
      next(err);
    });
};

const signIn = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("JWT >>>", JWT_SECRET);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.log("Error: ", err);
      return next(new BadRequestError("There has been an error"));
      // return res.status(400).send({ message: err.message });
    });
};
const getUsers = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      return next(new InternalServerError("There has been an error"));
      // return res.status(500).send({ message: err.message });
    });
};

const updateUserData = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(404).send({ message: err.message });
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
      // return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, updateUserData, signIn };
