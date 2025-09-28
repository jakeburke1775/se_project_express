// CONTROLLERS/users.js
const User = require("../models/user");
// import error codes
const {
  NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  CAST_ERROR,
  SERVER_ERROR,
  SUCCESS,
  CREATED,
} = require("../utils/errors");

//
//
// GET all users
const getUsers = (req, res) => {
  // console.log("IN CONTROLLER getUsers");
  User.find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

//
//
// CREATE a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

//
//
// GET a user by ID
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR).send({ message: "Invalid user ID" });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
