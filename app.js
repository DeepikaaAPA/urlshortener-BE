const express = require("express");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const corsOptions = {
  origin: "https://password-reset-flow-react-app.netlify.app",
  credentials: true,
};

// create a new express app
const app = express();

// use the cors middleware
app.use(cors(corsOptions));
// use the express json middleware for parsing json data
app.use(express.json());

app.use("/api/v1", userRouter);

module.exports = app;
