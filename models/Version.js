const mongoose = require("mongoose");

const versionschema = new mongoose.Schema({
  name: {
    type: Number,
    required: true,
    default:1
  },
  
});

module.exports = mongoose.model("Version", versionschema);
