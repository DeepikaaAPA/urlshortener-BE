const User = require("../models/user");
const bcrypt = require("bcrypt");
const { FORNTEND_LINK, FROM } = require("../utils/config");
const transporter = require("../utils/sendMail");
const userController = {
  passwordReset: async (request, response) => {
    try {
      const { email } = request.body;
      const user = await User.findOne({ id: email });

      if (!user) {
        return response.send("User does not exist");
      }
      //generate random string
      const randomString = await bcrypt.hash(email + new Date(), 10);

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
          response.send("link sent");
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  register: async (req, res) => {
    try {
      // get the user input
      console.log(req.body);
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
