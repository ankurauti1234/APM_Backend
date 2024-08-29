const express = require("express");
const mqttController = require("../controllers/mqttController");
const router = express.Router();

router.post("/publish", mqttController.publishMessage);
router.post("/factory-reset", mqttController.sendOneToApmData);

module.exports = router;
