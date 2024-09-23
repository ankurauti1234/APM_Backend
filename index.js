require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mqttRoutes = require("./routes/mqttRoutes");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const locationRoutes = require("./routes/locationRoutes");
const userRoutes = require("./routes/userRoutes");
const dataRoutes = require("./routes/dataRoutes");
const mqttService = require("./services/mqttService");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");




const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Use environment variable for CORS origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route setup
app.use("/mqtt", mqttRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/search", searchRoutes);
app.use("/location", locationRoutes);
app.use("/data", dataRoutes);

// Error handling for 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Initialize MQTT service
    await mqttService.initMQTT();

    // Start the server and listen on all interfaces
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server and MQTT client");
  await mongoose.disconnect();
  await mqttService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server and MQTT client");
  await mongoose.disconnect();
  await mqttService.disconnect();
  process.exit(0);
});

startServer();
