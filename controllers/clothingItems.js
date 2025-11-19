const ClothingItem = require("../models/clothingItem");
const { CREATED, SERVER_ERROR, SUCCESS, NOT_FOUND, BAD_REQUEST } = require("../utils/errors");

const createItem = (req, res) => {
  // console.log("Request body:", req.body); // Add this line to debug

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner }) // changed from URL to Url
    .then((item) => {
      // console.log(item);  // Optional: log the created item for debugging
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
      }
      
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  // console.log("Deleting item with ID:", itemId); // Uncomment this line to log the error for debugging
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(SUCCESS).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

const updateItemLikes = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(SUCCESS).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

const removeItemLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(SUCCESS).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

module.exports = { createItem, getItems, deleteItem, updateItemLikes, removeItemLike };