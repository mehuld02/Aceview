const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Mutual Match API
router.post("/match", async (req, res) => {
  const { userId } = req.body;

  const currentUser = await User.findById(userId);
  const allUsers = await User.find({ _id: { $ne: userId } });

  const matches = allUsers.filter((user) => {
    const teachMatch = user.skillsWanted.some((skill) =>
      currentUser.skillsOffered.includes(skill),
    );

    const learnMatch = user.skillsOffered.some((skill) =>
      currentUser.skillsWanted.includes(skill),
    );

    return teachMatch && learnMatch;
  });

  res.json(matches);
});

module.exports = router;
