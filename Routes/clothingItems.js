const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../Controllers/clothingItems");
// CRUD(create,read,update,delete)

// Create(post)
router.post("/", auth, validateCardBody, createItem);

// Read(get)
router.get("/", getItems);

// Update(put)
router.put("/:itemId", auth, validateId, updateItem);
router.put("/:itemId/likes", auth, validateId, likeItem);

// Delete(delete)
router.delete("/:itemId", auth, validateId, deleteItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
