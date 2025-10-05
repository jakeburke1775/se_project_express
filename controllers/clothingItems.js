const ClothingItem = require("../models/clothingItem");
const { CREATED, SERVER_ERROR, SUCCESS } = require("../utils/errors");

const createItem = (req, res) => {
  // console.log("Request body:", req.body); // Add this line to debug

  const { name, weather, imageUrl, owner } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner }) // changed from URL to Url
    .then((item) => {
      // console.log(item);  // Optional: log the created item for debugging
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((err) => {
      // console.error(err); // Uncomment this line to log the error for debugging
      res.status(SERVER_ERROR).send({ message: "Error from getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.status(SUCCESS).send({ data: item });
    })
    .catch((err) => {
      // console.error(err); // Uncomment this line to log the error for debugging
      res.status(SERVER_ERROR).send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  // console.log("Deleting item with ID:", itemId); // Debugging line
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(SUCCESS).send({ data: item });
    })
    .catch((err) => {
      // console.error(err); // Uncomment this line to log the error for debugging
      res.status(SERVER_ERROR).send({ message: "Error from deleteItem", err });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
