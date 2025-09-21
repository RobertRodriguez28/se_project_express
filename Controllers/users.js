const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

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
//   if (err.name === "ValidationError") {
//     return res.status(400).send({ message: err.message });
//   }
//   return res.status(500).send({ message: err.message });
// });

// Login function
const signIn = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      // authentication error
      return res.status(400).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
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

module.exports = { getUsers, createUser, getUser, signIn };

//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({ error: "User not found" });
//       }
//       return bcrypt.compare(password, user.password).then((isMatch) => {
//         if (!isMatch) {
//           return res.status(401).send({ error: "Authentication failed" });
//         }

//         const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//           expiresIn: "7d",
//         });

//         return res.send({ token });
//       });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send({ error: "Internal server error" });
//     });
// };
