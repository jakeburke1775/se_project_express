const router = require("express").Router();
const { createItem } = require("../controllers/clothingItems");

// CRUD operations for items

// Create item
router.post("/", createItem);

module.exports = router;
