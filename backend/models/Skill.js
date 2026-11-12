// backend/models/Skill.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillOffered: String,
  wantsToLearn: String,
  user: String,
});

module.exports = mongoose.model('Skill', skillSchema);
