// CONTROLERS/users.js
const User = require("../models/user");

// GET all users
const getUsers = (req, res) => {
  // console.log("IN CONTROLLER getUsers");
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { getUsers };
