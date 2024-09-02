const express = require("express");
const userRouter = require("./routes/userRouter");
const cors = require("cors");

// create a new express app
const app = express();

// use the cors middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// use the express json middleware for parsing json data
app.use(express.json());

app.use("/api/v1", userRouter);

module.exports = app;
