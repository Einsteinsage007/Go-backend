const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// register a user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    // 1. Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(404).json({ message: "Password Missmatch" });
    }
    // Check if user exist
    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (exists) {
      return res.status(400).json({ message: "This user already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // identifier = username or email

    // Validate Input
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // find user by username or email
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // Response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
