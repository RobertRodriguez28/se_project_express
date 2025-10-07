const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { createUser, signIn } = require("../Controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, signIn);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
