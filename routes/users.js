// ROUTES/users.js

const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users");

router.get("/", getUsers);
// router.get("/:userId", () => console.log("GET users by Id"));
router.post("/", createUser);

module.exports = router;
