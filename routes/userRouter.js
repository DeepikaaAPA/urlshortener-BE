const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/UserController");
userRouter.post("/signUp", userController.register);
userRouter.patch("/getResetLink", userController.getResetLink);
userRouter.post("/verifyReset/:token", userController.verifyReset);
userRouter.put("/resetPassword", userController.resetPassword);

module.exports = userRouter;
