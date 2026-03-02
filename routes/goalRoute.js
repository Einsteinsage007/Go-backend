const express = require("express");
const {
  createGoal,
  getAllGoals,
  getCompletedGoals,
  getOngoingGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/allgoals", protect, getAllGoals);
router.get("/ongoing", protect, getOngoingGoals);
router.get("/completed", protect, getCompletedGoals);

router.get("/:id", protect, getGoalById);
router.put("/update/:id", protect, updateGoal);
router.delete("/delete/:id", protect, deleteGoal);

module.exports = router;
