const mongoose = require("mongoose");

const tempDataSchema = new mongoose.Schema({
  Timestamp: { type: String, required: true },
  Temperature: { type: Number, required: true },
  Conveyor_Speed: { type: Number, required: true },
});

module.exports = mongoose.model("TempData", tempDataSchema);
