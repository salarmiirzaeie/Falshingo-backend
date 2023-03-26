const mongoose = require("mongoose");

const commentsSchmea = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  comment: {
    type: String,
  },
  reply: {
    type: mongoose.Schema.Types.ObjectId,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", commentsSchmea);
