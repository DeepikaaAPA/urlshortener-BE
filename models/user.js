// import mongoose
const mongoose = require("mongoose");

// create  a new schema
const userSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname:String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  token: {
    type: String,
    default: null,
  },
  useBefore: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// create a new model and export it
module.exports = mongoose.model("User", userSchema, "users");
