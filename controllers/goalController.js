const Goal = require("../models/goalModels");

// create new Goal
exports.createGoal = async (req, res) => {
  try {
    const { title, description, progress } = req.body;

    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Goal title and description are required" });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      progress: progress || 0,
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // ownership check
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOngoingGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
      progress: { $lt: 100 },
    }).sort({ createdAt: -1 });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompletedGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
      progress: 100,
    }).sort({ createdAt: -1 });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: "Goal not Found" });
    }
    // Ownership check
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, progress } = req.body;
    goal.title = title ?? goal.title;
    goal.description = description ?? goal.description;
    goal.progress = progress ?? goal.progress;

    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // ownership check
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    await goal.deleteOne();

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
