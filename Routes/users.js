const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getUsers, updateUserData } = require("../Controllers/users");
// const { validateId } = require("../middlewares/validation");
const { validateUpdateProfileBody } = require("../middlewares/validation");

router.get("/me", auth, validateUpdateProfileBody, getUsers);
router.patch("/me", auth, updateUserData);

module.exports = router;
