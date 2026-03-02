const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// Import Routes
const userRoutes = require("./routes/userRoutes");
const goalRoutes = require("./routes/goalRoute");

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

// Initialize express app
const app = express();

// Define Port
const port = 5000;

// Mount Middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", userRoutes);
app.use("/api/goals", goalRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DATABASE CONNECTED");
    app.listen(port, () => {
      console.log(`SERVER RUNNING ON PORT ${port} `);
    });
  } catch (error) {
    console.error("FAILED TO START SERVER", error);
  }
};

start();
