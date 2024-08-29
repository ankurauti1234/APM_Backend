const mongoose = require("mongoose");

const selfInstallationSchema = new mongoose.Schema(
  {
    device_id: { type: Number, default: 100001 },
    HHID: { type: Number },
    "SIM{current_sim}_IMSI": { type: String },
    "SIM{current_sim}_PASS": { type: Boolean },
    "SIM{other_sim}_PASS": { type: Boolean },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("SelfInstall", selfInstallationSchema);
