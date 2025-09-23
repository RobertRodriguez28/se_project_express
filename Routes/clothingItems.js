const router = require("express").Router();
const { auth } = require("../middlewares/auth");

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
router.post("/", auth, createItem);

// Read(get)
router.get("/", getItems);

// Update(put)
router.put("/:itemId", auth, updateItem);
router.put("/:itemId/likes", auth, likeItem);

// Delete(delete)
router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
