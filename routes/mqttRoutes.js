const express = require("express");
const mqttController = require("../controllers/mqttController");
const router = express.Router();

router.post("/publish", mqttController.publishMessage);
router.post("/factory-reset", mqttController.sendOneToApmData);
router.get("/sensor-data", mqttController.getSensorData);
router.get("/proximity-data", mqttController.getProximityData);

module.exports = router;
