const { request } = require("express");
const mongoose = require("mongoose");
const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Goal description is required"],
      trim: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links goal to the user
      required: true,
    },
  },
  { timestamps: true }, // createdAt & updatedAt
);

module.exports = mongoose.model("Goal", goalSchema);