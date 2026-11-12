// Finds users where:
// (Your Offered ∩ Their Wanted) AND (Their Offered ∩ Your Wanted)
const findMutualMatches = async (currentUser) => {
  const User = require("../models/User");

  return await User.find({
    _id: { $ne: currentUser._id },
    skillsOffered: { $in: currentUser.skillsWanted },
    skillsWanted: { $in: currentUser.skillsOffered },
  }).select("-password");
};
