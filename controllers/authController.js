const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  FROM,
  JWT_SECRET,
  JWT_ACTIVATION_KEY,
  FORNTEND_LINK,
} = require("../utils/config");
const transporter = require("../utils/sendMail");
const authController = {
  register: async (req, res) => {
    try {
      const now = new Date();
      // get the user input
      const { firstname, lastname, email, password } = req.body;

      // check if the user already exists
      const user = await User.findOne({ email });

      if (user && user.activationStatus === "active") {
        return res.status(400).json({ message: "User already exists" });
      }

      if (user && user.activateBefore && user.activateBefore > now) {
        return res.status(400).json({
          message:
            "Activation link has already been sent.Use link in mail to activate the account.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const activateToken = jwt.sign({ email }, JWT_ACTIVATION_KEY);

      var mailOptions = {
        from: FROM,
        to: [email, "deepikaudt@gmail.com"],
        subject: "URL Shortener new account activation - reg",
        text: `Click the link to activate your account: \n\n${FORNTEND_LINK}/activate/${activateToken}`,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
          res.status(400).json({ message: error.message });
        } else {
          const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            activateToken,
            activationStatus: "inactive",
            activateBefore: now.setHours(now.getHours() + 1),
          });
          //user already exists but activation time is over.
          if (user) {
            await User.updateOne(
              { email },
              {
                $set: {
                  firstname,
                  lastname,
                  password: hashedPassword,
                  activateToken,
                  activationStatus: "inactive",
                  activateBefore: now.setHours(now.getHours() + 1),
                  updatedAt: new Date(),
                },
              }
            );
          } else {
            //new user
            await newUser.save();
          }
          console.log("Email sent: " + info.response);
        }
      });

      // create a new user in db with inactive status

      res.status(201).json({
        message:
          "Activation link has been sent to the email id. Activate within 1 hour.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  activate: async (req, res) => {
    try {
      const token = req.params.token;
      const { email } = jwt.verify(token, JWT_ACTIVATION_KEY);
      console.log("token , email :", token, email);
      const user_found = await User.findOne({
        email,
        activateToken: token,
        activateBefore: { $gt: new Date() },
      });
      if (!user_found) {
        console.log("user not found");
        return res.status(400).json({ message: "Invalid link" });
      }
      await User.updateOne(
        { email },
        {
          $set: {
            activationStatus: "active",
            activateToken: null,
            activateBefore: null,
          },
        }
      );
      console.log("account activated");
      return res.status(200).json({ message: "Account activated." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      // get the user inputs - username and password
      const { email, password } = req.body;

      // check if the user exists in the database
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (user.activationStatus === "inactive")
        return res
          .status(400)
          .json({ message: "Account must be activated before logging in." });

      // compare the password
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // generate a token
      const token = jwt.sign({ id: user._id }, JWT_SECRET);

      // store the token in the cookie
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.json({ message: "Logged in.", token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res
        .clearCookie("token", { path: "/" })
        .json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  me: async (req, res) => {
    // get the user id from the request object
    const userId = req.userId;

    // get the user details from the database
    const user = await User.findById(userId).select(
      "-password -__v -created_at -updated_at -_id -role"
    );

    res.json(user);
  },
};

module.exports = authController;
