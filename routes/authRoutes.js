const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../utils/auth");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.get("/activate/:token", authController.activate);
authRouter.post("/login", authController.login);
authRouter.post("/logout", auth.verifyToken, authController.logout);
authRouter.get("/me", auth.verifyToken, authController.me);

module.exports = authRouter;
