require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const JWT_ACTIVATION_KEY = process.env.JWT_ACTIVATION_KEY;

const JWT_SECRET = process.env.JWT_SECRET;

const FORNTEND_LINK = process.env.FORNTEND_LINK;
const FROM = process.env.FROM;
const PASS = process.env.PASS;

module.exports = {
  MONGODB_URI,
  PORT,

  JWT_ACTIVATION_KEY,
  FORNTEND_LINK,
  FROM,
  PASS,
  JWT_SECRET,
};
