const Swap = require("../models/Swap");

exports.sendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const newSwap = new Swap({ sender: req.user.id, receiver: receiverId });
  await newSwap.save();
  res.json(newSwap);
};

exports.updateStatus = async (req, res) => {
  const { swapId, status } = req.body; // status: 'accepted' or 'rejected'

  const update = { status };
  // If accepted, generate a unique meeting room ID
  if (status === "accepted") {
    update.meetingId = `room-${swapId}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const swap = await Swap.findByIdAndUpdate(swapId, update, { new: true });
  res.json(swap);
};
