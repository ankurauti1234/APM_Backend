const mqttService = require("../services/mqttService");
const Config = require("../models/configModel");
const Sensor = require("../models/sensorModel");
const Proximity = require("../models/proximityModel");

exports.publishMessage = async (req, res) => {
  try {
    const { topic, message, deviceId } = req.body;

    // Publish the message to the MQTT topic
    await mqttService.publishMessage(topic, message);

    // Store the message, topic, and device ID in MongoDB
    const newConfig = new Config({
      deviceId,
      topic,
      config: message,
    });
    await newConfig.save();

    res
      .status(200)
      .json({ message: "Message published and stored successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.sendOneToApmData = async (req, res) => {
  try {
    const topic = "apm/factoryreset";
    const message = req.body.message; // Retrieve the message from request body

    // Publish the message to the MQTT topic
    await mqttService.publishMessage(topic, message);

    res.status(200).json({ message: "Message sent to apm/data successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSensorData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sensorData = await Sensor.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Sensor.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      data: sensorData,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProximityData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const proximityData = await Proximity.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Proximity.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      data: proximityData,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};