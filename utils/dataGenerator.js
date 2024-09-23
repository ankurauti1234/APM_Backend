const TempData = require("../models/tempModel");
const { DateTime } = require("luxon");

// Function to generate synthetic data
async function generateSyntheticData(limit = 200) {
  let temperature = 200;
  let conveyorSpeed = 1.2;
  const upperLimit = 210;
  const lowerLimit = 190;

  let dataCounter = 0;
  let inIncreasingTrend = false;
  let inDecreasingTrend = false;

  const generateDataPoint = async () => {
    if (dataCounter >= limit) {
      console.log("Data generation completed.");
      return;
    }

    const newTimestamp = DateTime.now();

    if (inIncreasingTrend) {
      temperature += 0.4;
      if (temperature >= upperLimit) {
        inIncreasingTrend = false;
      }
    } else if (inDecreasingTrend) {
      temperature -= 0.4;
      if (temperature <= lowerLimit) {
        inDecreasingTrend = false;
      }
    } else if (20 <= dataCounter && dataCounter < 28) {
      temperature += 0.5;
      if (dataCounter === 27) {
        inIncreasingTrend = true;
      }
    } else if (50 <= dataCounter && dataCounter < 56) {
      temperature -= 0.4;
      if (dataCounter === 55) {
        inDecreasingTrend = true;
      }
    } else if (90 <= dataCounter && dataCounter < 96) {
      temperature += 0.5;
    } else if (130 <= dataCounter && dataCounter < 136) {
      if (dataCounter % 2 === 0) {
        temperature += 0.3;
      } else {
        temperature -= 0.1;
      }
    } else if (170 <= dataCounter && dataCounter < 176) {
      temperature += 0.3;
      conveyorSpeed -= 0.02;
    } else {
      temperature += Math.random() * 0.2 - 0.1;
      conveyorSpeed += Math.random() * 0.02 - 0.01;
    }

    dataCounter += 1;

    const dataPoint = new TempData({
      Timestamp: newTimestamp.toJSDate(),
      Temperature: temperature,
      Conveyor_Speed: conveyorSpeed,
    });

    await dataPoint.save();
    console.log(dataPoint);

    setTimeout(generateDataPoint, 1000);
  };

  generateDataPoint();
}

module.exports = { generateSyntheticData };