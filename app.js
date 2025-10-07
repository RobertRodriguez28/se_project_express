require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./Routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

// Middleware setup
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.error(" DB connection error:", err));
app.use(express.json());
app.use(cors());

app.use(requestLogger);

// Routes
app.use("/", mainRouter);

app.use(errorLogger);

// Global error handler
app.use(errors()); // celebrate error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`List on Port ${PORT}`);
});
