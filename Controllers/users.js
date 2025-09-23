const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isJWT } = require("validator");
const { JWT_SECRET } = require("../utils/config");

console.log(JWT_SECRET);

const createUser = (req, res) => {
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
        return res.status(400).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: "Conflict Error" });
      }
      res.status(500).send({ error: "There has been an error " });
    });
};

const signIn = (req, res) => {
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
      return res.status(400).send({ message: err.message });
    });
};
const getUsers = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

const updateUserData = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, updateUserData, signIn };
