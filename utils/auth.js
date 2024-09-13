const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const User = require("../models/user");

const auth = {
  verifyToken: async (req, res, next) => {
    // get the token from the cookie
    //const token = req.cookies.token;
    // Extract the token from the Authorization header
    const authHeader = req.headers["Authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    console.log("token", token);
    if (token == null) return res.sendStatus(401); // No token provided

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, userId) => {
      if (err) return res.sendStatus(403); // Forbidden if token is invalid
      req.userId = userId; // Attach decoded user
    });

    // call the next middleware
    next();
  },

  isAdmin: async (req, res, next) => {
    try {
      // get the user id from the request object
      const userId = req.userId;

      // query the database to get the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      // call the next middleware
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = auth;
