const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/UserController");
userRouter.post("/signUp", userController.register);
userRouter.patch("/passwordReset", userController.passwordReset);

module.exports = userRouter;
