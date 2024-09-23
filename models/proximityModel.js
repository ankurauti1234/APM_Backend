const mongoose = require("mongoose");

const proximitySchema = new mongoose.Schema({
  object_detected: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Proximity", proximitySchema);
