const express = require("express");
const router = express.Router();
const Swap = require("../models/Swap");

// Send swap request
router.post("/", async (req, res) => {
  try {
    const swap = await Swap.create(req.body);
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all swaps
router.get("/", async (req, res) => {
  const swaps = await Swap.find().populate("sender").populate("receiver");

  res.json(swaps);
});

// Accept / Reject swap
router.put("/:id", async (req, res) => {
  const swap = await Swap.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );

  res.json(swap);
});

router.put("/:id/accept", async (req, res) => {
  const roomId = "room_" + Date.now();

  const swap = await Swap.findByIdAndUpdate(
    req.params.id,
    {
      status: "accepted",
      roomId: roomId,
    },
    { new: true },
  );

  res.json(swap);
});

module.exports = router;
