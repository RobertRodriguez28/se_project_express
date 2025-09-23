const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getUsers, updateUserData } = require("../Controllers/users");

router.patch("/me", auth, updateUserData);
router.get("/me", auth, getUsers);

module.exports = router;
