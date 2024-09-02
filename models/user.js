const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  id: String,
  password: String,
  token: {
    type: String,
    default: null,
  },
  useBefore: {
    type: Date,
    default: null,
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema, "users");
