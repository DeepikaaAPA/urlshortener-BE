const express = require("express");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { FORNTEND_LINK } = require("./utils/config");
const corsOptions = {
  origin: [FORNTEND_LINK, "http://localhost:5173"],
  credentials: true,
};

// create a new express app
const app = express();
app.use(cookieParser());
// use the cors middleware
app.use(cors(corsOptions));
// use the express json middleware for parsing json data
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
module.exports = app;
