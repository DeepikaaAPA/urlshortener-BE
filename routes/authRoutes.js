const express = require("express");
const authController = require("../controllers/authController");
const shortenerController = require("../controllers/shortenerController");
const auth = require("../utils/auth");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.get("/activate/:token", authController.activate);
authRouter.post("/login", authController.login);
authRouter.post("/logout", auth.verifyToken, authController.logout);
authRouter.get("/me", auth.verifyToken, authController.me);
authRouter.post("/shorten", auth.verifyToken, shortenerController.shorten);
authRouter.get(
  "/shorts/:code",
  auth.verifyToken,
  shortenerController.retrieveUrl
),
  (module.exports = authRouter);
