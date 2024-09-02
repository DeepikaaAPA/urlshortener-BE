const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { FORNTEND_LINK, FROM, JWT_SECRET } = require("../utils/config");
const transporter = require("../utils/sendMail");
const userController = {
  getResetLink: async (request, response) => {
    try {
      const { email } = request.body;

      const user = await User.findOne({ id: email });

      if (!user) {
        return response.json({ message: "User does not exist" });
      }
      //generate random string
      const randomString = jwt.sign({ email }, process.env.JWT_SECRET);

      //generate the link
      const resetLink = FORNTEND_LINK + "/reset/" + randomString;
      console.log(resetLink);
      var mailOptions = {
        from: FROM,
        to: "deepikaudt@gmail.com", //email
        subject: "Sending Email using Node.js",
        text: resetLink,
      };
      let date = new Date();
      date.setHours(date.getHours() + 1); // Adds 1 hour to the current date

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
          response.send(error.message);
        } else {
          try {
            //insert token into database
            await User.updateOne(
              { id: email },
              { $set: { token: randomString, useBefore: date } }
            );
          } catch (err) {
            console.log(err);
          }
          console.log("Email sent: " + info.response);
          response.status(200).json({
            message:
              "The link to reset your password has been sent to the registered email id.Please use the link within 1 hour to reset your password.",
          });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  verifyReset: async (req, res) => {
    const { token } = req.params;
    console.log(token);
    try {
      const storedToken = await User.findOne({ token });
      if (!storedToken)
        return res
          .status(404)
          .json({ message: "Invalid Token", status: "invalid" });
    } catch (err) {
      console.log(err);
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const decoded_email = decodedToken.email;
    const { email } = req.body;

    if (email !== decoded_email)
      return res.status(404).json({ message: "Invalid ID", status: "invalid" });
    console.log(decoded_email);

    const user = User.find({ id: email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User doesnot exist.", status: "invalid" });

    if (!user.token)
      return res
        .status(404)
        .json({ message: "Token invalid", status: "invalid" });

    if (Date.now() > user.useBefore)
      return res
        .status(404)
        .json({ message: "Token timed out.", status: "invalid" });

    return res.status(200).json({ message: "Token valid", status: "valid" });
  },
  resetPassword: async (req, res) => {},

  register: async (req, res) => {
    try {
      // get the user input

      const { name, email, password } = req.body;

      // check if the user already exists
      const user = await User.findOne({ id: email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // create a new user
      const newUser = new User({ name, id: email, password: hashedPassword });

      // save the user
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = userController;
