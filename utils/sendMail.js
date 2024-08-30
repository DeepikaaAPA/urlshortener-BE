var nodemailer = require("nodemailer");
var { FROM, PASS } = require("./config");
var transporter = nodemailer.createTransport({
  service: "Gmail",
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: FROM,
    pass: PASS,
  },
});

module.exports = transporter;
