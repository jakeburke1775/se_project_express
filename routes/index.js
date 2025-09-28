const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");

const { SERVER_ERROR } = require("../utils/errors");

router.use("/clothing-items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res
    .status(SERVER_ERROR)
    .send({ message: "Internal Server Error: Router Not Found" });
});

module.exports = router;
