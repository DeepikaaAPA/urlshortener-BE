const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { FORNTEND_LINK, FROM, JWT_SECRET } = require("../utils/config");
const transporter = require("../utils/sendMail");

const userController = {
  getResetLink: async (request, response) => {
    /**
     * 
     * token => random string generated using email for password reset
     * 
     **/
    try {
      const { email } = request.body;

      const user = await User.findOne({ email });

      if (!user) {
        return response.json({ message: "User does not exist" });
      }
      //generate random string
      const randomString = jwt.sign({ email }, process.env.JWT_SECRET);

      //generate the link
      const resetLink = FORNTEND_LINK + "/reset";

      var mailOptions = {
        from: FROM,
        to: [email, "deepikaudt@gmail.com"],
        subject: "Password reset request - reg",
        text: `Use the link : ${resetLink}/${randomString} \n\n or \n
        \n Link:${resetLink} \nCode:${randomString} `,
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
              { email },
              { $set: { token: randomString, useBefore: date } }
            );
          } catch (err) {
            console.log(err);
          }
          console.log("Email sent: " + info.response);
          response.status(200).json({
            message:
              "The code to reset your password has been sent to the registered email id.Please use the link within 1 hour to reset your password.",
          });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  verifyReset: async (req, res) => {
    const { token } = req.params;
    // console.log(token);
    try {
      const storedToken = await User.findOne({ token });
      if (!storedToken)
        return res
          .status(404)
          .json({ message: "Token not found", status: "invalid" });
    } catch (err) {
      console.log(err);
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const decoded_email = decodedToken.email;
    const { email } = req.body;

    if (email !== decoded_email)
      return res.status(404).json({ message: "Invalid ID", status: "invalid" });
    //console.log(decoded_email);

    const userDocument = await User.findOne({ email });
    if (!userDocument)
      return res
        .status(404)
        .json({ message: "User does not exist.", status: "invalid" });

    if (!userDocument.token)
      return res.status(404).json({
        message: "Reset request has not been raised.",
        status: "invalid",
      });

    if (Date.now() > userDocument.useBefore)
      return res
        .status(404)
        .json({ message: "Token timed out.", status: "invalid" });

    if (userDocument.token === token)
      return res.status(200).json({ message: "Token valid", status: "valid" });
    else
      return res
        .status(404)
        .json({ message: "Wrong token.", status: "invalid" });
  },
  resetPassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            token: null,
            useBefore: null,
            updatedAt: new Date(),
          },
        }
      );
      res.status(200).json({ message: "Password reset success." });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
module.exports = userController;
