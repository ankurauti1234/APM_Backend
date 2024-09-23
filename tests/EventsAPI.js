const express = require("express");
const mongoose = require("mongoose");
const Event = require("./sampleDeviceSchema"); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://ankurauti:ankurauti02@cluster0.ng3tq.mongodb.net/TestEvents?retryWrites=true&w=majority&appName=Cluster0"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// API Endpoint to Get All Data with Search and Pagination
app.get("/api/events", async (req, res) => {
  try {
    const { DEVICE_ID, Type, page = 1, limit = 10 } = req.query;

    const query = {};
    if (DEVICE_ID) {
      if (DEVICE_ID.includes("-")) {
        const [minId, maxId] = DEVICE_ID.split("-").map(Number);
        query.DEVICE_ID = { $gte: minId, $lte: maxId };
      } else {
        query.DEVICE_ID = Number(DEVICE_ID);
      }
    }

    if (Type) {
      // Split the Type query parameter by comma to allow multiple types
      const types = Type.split(",").map(Number);
      query.Type = { $in: types };
    }

    const events = await Event.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API Endpoint to Get Latest Data for Each DEVICE_ID with Each TYPE
app.get("/api/events/latest", async (req, res) => {
  try {
    const { DEVICE_ID, Type } = req.query;

    const matchStage = {};

    // Handle DEVICE_ID filtering
    if (DEVICE_ID) {
      if (DEVICE_ID.includes("-")) {
        const [minId, maxId] = DEVICE_ID.split("-").map(Number);
        matchStage.DEVICE_ID = { $gte: minId, $lte: maxId };
      } else {
        matchStage.DEVICE_ID = Number(DEVICE_ID);
      }
    }

    // Handle Type filtering
    if (Type) {
      const typesArray = Type.split(",").map(Number); // Convert Type query parameter to an array of numbers
      matchStage.Type = { $in: typesArray }; // Match any of the types in the array
    }

    // Mapping of Type to Event Name
    const eventTypeMapping = {
      1: "LOCATION",
      2: "GUEST_REGISTRATION",
      3: "MEMBER_GUEST_DECLARATION",
      4: "CONFIGURATION",
      5: "TAMPER_ALARM",
      6: "SOS_ALARM",
      7: "BATTERY_ALARM",
      8: "METER_INSTALLATION",
      9: "VOLTAGE_STATS",
      10: "TEMPERATURE_STATS",
      11: "NTP_SYNC",
      12: "AUDIENCE_SESSION_CLOSE",
      13: "NETWORK_LATCH",
      14: "REMOTE_PAIRING",
      15: "REMOTE_ACTIVITY",
      16: "SIM_ALERT",
      17: "SYSTEM_ALARM",
      18: "SYSTEM_INFO",
      19: "CONFIG_UPDATE",
      20: "ALIVE",
      21: "METER_OTA",
      22: "BATTERY_VOLTAGE",
      23: "BOOT",
      24: "BOOT_V2",
      25: "STB",
      26: "DERIVED_TV_STATUS",
      27: "AUDIO_SOURCE",
    };

    const events = await Event.aggregate([
      { $match: matchStage },
      {
        $sort: { DEVICE_ID: 1, Type: 1, TS: -1 }, // Sort by DEVICE_ID and Type, then by timestamp in descending order
      },
      {
        $group: {
          _id: { DEVICE_ID: "$DEVICE_ID", Type: "$Type" }, // Group by DEVICE_ID and Type
          latestEvent: { $first: "$$ROOT" }, // Get the first document in each group (the latest one)
        },
      },
      {
        $replaceRoot: { newRoot: "$latestEvent" }, // Replace the root document with the latest event
      },
    ]);

    // Add eventName field based on the Type
    const eventsWithNames = events.map((event) => ({
      ...event,
      eventName: eventTypeMapping[event.Type] || "Unknown Event",
    }));

    res.json(eventsWithNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/events/latest/:DEVICE_ID", async (req, res) => {
  try {
    const { DEVICE_ID } = req.params;

    if (!DEVICE_ID) {
      return res.status(400).json({ message: "DEVICE_ID is required" });
    }

    // Mapping of Type to Event Name
    const eventTypeMapping = {
      1: "LOCATION",
      2: "GUEST_REGISTRATION",
      3: "MEMBER_GUEST_DECLARATION",
      4: "CONFIGURATION",
      5: "TAMPER_ALARM",
      6: "SOS_ALARM",
      7: "BATTERY_ALARM",
      8: "METER_INSTALLATION",
      9: "VOLTAGE_STATS",
      10: "TEMPERATURE_STATS",
      11: "NTP_SYNC",
      12: "AUDIENCE_SESSION_CLOSE",
      13: "NETWORK_LATCH",
      14: "REMOTE_PAIRING",
      15: "REMOTE_ACTIVITY",
      16: "SIM_ALERT",
      17: "SYSTEM_ALARM",
      18: "SYSTEM_INFO",
      19: "CONFIG_UPDATE",
      20: "ALIVE",
      21: "METER_OTA",
      22: "BATTERY_VOLTAGE",
      23: "BOOT",
      24: "BOOT_V2",
      25: "STB",
      26: "DERIVED_TV_STATUS",
      27: "AUDIO_SOURCE",
    };

    const latestEvent = await Event.aggregate([
      { $match: { DEVICE_ID: Number(DEVICE_ID) } },
      { $sort: { TS: -1 } }, // Sort by timestamp in descending order
      { $limit: 1 }, // Get only the latest event
    ]);

    if (latestEvent.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for the given DEVICE_ID" });
    }

    // Add eventName field based on the Type
    const eventWithName = {
      ...latestEvent[0],
      eventName: eventTypeMapping[latestEvent[0].Type] || "Unknown Event",
    };

    res.json(eventWithName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
