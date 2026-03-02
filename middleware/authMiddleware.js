const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  // check for token in authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify tokem
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token payload (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not Authorized, user not found",
    });
  }
};

module.exports = protect;
