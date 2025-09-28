const ClothingItem = require("../models/clothingItem");
const { CREATED, SERVER_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { createItem };
