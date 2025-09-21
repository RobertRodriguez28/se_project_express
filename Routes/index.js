const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRouter = require("./users");
const { createUser, signIn } = require("../Controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.post("/signup", createUser);
router.post("/signin", signIn);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
