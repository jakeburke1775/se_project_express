const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("connected to DB"))
  .catch(console.error);

app.use(express.json());

// Temporary middleware to simulate logged-in user for testing
app.use((req, res, next) => {
  req.user = {
    _id: "507f1f77bcf86cd799439011", // Temporary user ID for testing
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
