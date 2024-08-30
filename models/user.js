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
});

module.exports = mongoose.model("User", userSchema, "users");
