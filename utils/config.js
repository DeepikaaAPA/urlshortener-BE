require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const JWT_TOKEN = process.env.JWT_TOKEN;
const SALT = process.env.SALT;

const FORNTEND_LINK = process.env.FORNTEND_LINK;
const FROM = process.env.FROM;
const PASS = process.env.PASS;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_TOKEN,
  SALT,
  FORNTEND_LINK,
  FROM,
  PASS,
};
