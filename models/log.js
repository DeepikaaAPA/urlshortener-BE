// import mongoose
const mongoose = require("mongoose");

// create  a new schema
const logSchema = new mongoose.Schema({
  userId: String,
  shortnerCode: Number,
  clickedAt: {
    type: Date,
    default: Date.now,
  },
  clickedMonth: String,
  clickedYear: Number,
  clickedMonthYear: String,
  clickedDay: Number,
});

// create a new model and export it
module.exports = mongoose.model("Log", logSchema, "logs");
