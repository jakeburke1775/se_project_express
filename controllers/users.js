// CONTROLLERS/users.js
const User = require("../models/user");
// import error codes
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
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
      return res.status(SERVER_ERROR).send({ message: "Server error" });
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
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res.status(SERVER_ERROR).send({ message: "Server error" });
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
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

module.exports = { getUsers, createUser, getUser };
