// import mongoose
const mongoose = require("mongoose");

// create  a new schema
const urlSchema = new mongoose.Schema({
  userId: String,
  longUrl: String,
  shortnerCode: Number,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// create a new model and export it
module.exports = mongoose.model("Url", urlSchema, "urls");
