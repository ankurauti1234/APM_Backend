// controllers/dataController.js
const TempData = require("../models/tempModel");
const { generateSyntheticData } = require("../utils/dataGenerator");


exports.startDataGeneration = (req, res) => {
  const limit = req.body.limit || 200;
  generateSyntheticData(limit);
  res.json({ message: "Data generation started" });
};

exports.getTempData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await TempData.find()
      .sort({ Timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TempData.countDocuments();

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};