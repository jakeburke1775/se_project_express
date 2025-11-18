const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  updateItemLikes,
  removeItemLike,
} = require("../controllers/clothingItems");

// CRUD operations for items
// Create item
router.post("/", createItem);
// Read
router.get("/", getItems);
// Delete
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", updateItemLikes);

router.delete("/:itemId/likes", removeItemLike);

module.exports = router;
