const { DateTime } = require("luxon");

function generateSyntheticData(limit = 200) {
  // Variables to simulate changes
  let temperature = 200;
  let conveyorSpeed = 1.2;
  const upperLimit = 210; // Define upper and lower limits for alerts
  const lowerLimit = 190;

  let dataCounter = 0;
  let inIncreasingTrend = false; // Flags for controlling sustained trends
  let inDecreasingTrend = false;

  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const newTimestamp = DateTime.now();

      // Simulate increasing trend after triggering the first alert
      if (inIncreasingTrend) {
        temperature += 0.4; // Continue the upward trend
        if (temperature >= upperLimit) {
          // Stop when it crosses upper limit
          inIncreasingTrend = false;
        }
      }
      // Simulate decreasing trend after triggering the second alert
      else if (inDecreasingTrend) {
        temperature -= 0.4; // Continue the downward trend
        if (temperature <= lowerLimit) {
          // Stop when it crosses lower limit
          inDecreasingTrend = false;
        }
      }
      // Controlled variations to trigger alerts spaced further apart
      else if (20 <= dataCounter && dataCounter < 28) {
        // Simulate a mean temperature increase over 8 points (1st alert at datapoint 20)
        temperature += 0.5;
        if (dataCounter === 27) {
          inIncreasingTrend = true; // Continue the increase after alert
        }
      } else if (50 <= dataCounter && dataCounter < 56) {
        // Simulate a mean temperature decrease over 6 points (2nd alert at datapoint 50)
        temperature -= 0.4;
        if (dataCounter === 55) {
          inDecreasingTrend = true; // Continue the decrease after alert
        }
      } else if (90 <= dataCounter && dataCounter < 96) {
        // Simulate a gradual increase of 0.5°C over 5 consecutive points (3rd alert at datapoint 90)
        temperature += 0.5;
      } else if (130 <= dataCounter && dataCounter < 136) {
        // Simulate a fluctuating pattern (4th alert at datapoint 130)
        if (dataCounter % 2 === 0) {
          temperature += 0.3;
        } else {
          temperature -= 0.1;
        }
      } else if (170 <= dataCounter && dataCounter < 176) {
        // Simulate combined effect of increasing temperature and decreasing conveyor speed (5th alert at datapoint 170)
        temperature += 0.3;
        conveyorSpeed -= 0.02;
      } else {
        // Random noise during "normal" operation between alerts
        temperature += Math.random() * 0.2 - 0.1;
        conveyorSpeed += Math.random() * 0.02 - 0.01;
      }

      // Increment the counter for each data point generated
      dataCounter += 1;

      // Create the data point with timestamp, temperature, and conveyor speed
      const dataPoint = {
        Timestamp: newTimestamp.toISO(),
        Temperature: temperature,
        Conveyor_Speed: conveyorSpeed,
      };

      // Send the data point to the monitoring engine (for demo purposes)
      console.log(dataPoint);

      // Simulate time delay for real-time data generation (e.g., 1 second)
      if (dataCounter >= limit) {
        clearInterval(intervalId);
        resolve();
      }
    }, 1000);
  });
}

// Example: Data generation loop for demo purposes
generateSyntheticData().then(() => {
  console.log("Data generation completed.");
});
