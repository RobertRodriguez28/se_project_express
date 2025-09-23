const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./Routes/index");
// const usersRouter = require("./Routes/users");

const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());
app.use(cors());
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`List on Port ${PORT}`);
});
