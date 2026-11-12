// backend/routes/match.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch current user
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Find matches: people who have the skill you want and want the skill you have
    const matches = await User.find({
      skills: { $in: currentUser.desiredSkills },
      desiredSkills: { $in: currentUser.skills }
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
