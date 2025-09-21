const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./Routes/index");
const usersRouter = require("./Routes/users");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
// app.use((req, res, next) => {
//   req.user = { _id: "6314fedbc7e41a78406cf828" };
//   next();
// });
app.use("/", mainRouter);
app.use("/users", usersRouter);
app.use(cors());

app.listen(PORT, () => {
  console.log(`List on Port ${PORT}`);
});
