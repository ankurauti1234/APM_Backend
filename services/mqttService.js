const awsIot = require("aws-iot-device-sdk-v2");
const mqtt = awsIot.mqtt;
const config = require("../config/mqtt"); // Adjusted import based on provided structure
const DeviceData = require("../models/deviceData");
const Logo = require("../models/logo");
// const Fingerprint = require("../models/fingerprint");

let client;

async function connectToAWS() {
  const configOptions =
    awsIot.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
      config.certPath,
      config.keyPath
    )
      .with_certificate_authority_from_path(undefined, config.caPath)
      .with_clean_session(true)
      .with_client_id(config.clientId)
      .with_endpoint(config.endpoint)
      .build();

  const client = new mqtt.MqttClient();
  const connection = client.new_connection(configOptions);

  await connection.connect();
  console.log("Connected to AWS IoT");

  for (const topic of config.topicsToSubscribe) {
    await connection.subscribe(
      topic,
      mqtt.QoS.AtLeastOnce,
      (topic, payload) => {
        handleMessage(topic, payload);
      }
    );
    console.log(`Subscribed to ${topic}`);
  }

  return connection;
}

async function handleMessage(topic, payload) {
  try {
    let message;

    if (payload instanceof ArrayBuffer) {
      const buffer = Buffer.from(payload);
      message = JSON.parse(buffer.toString("utf-8"));
    } else if (Buffer.isBuffer(payload)) {
      message = JSON.parse(payload.toString("utf-8"));
    } else if (typeof payload === "string") {
      message = JSON.parse(payload);
    } else {
      console.warn(
        `Unexpected payload type for topic ${topic}:`,
        typeof payload
      );
      return;
    }

    switch (topic) {
      case "apm/device/data":
        await DeviceData.create(message);
        break;
      case "apm/logo":
        console.log(message);
        await Logo.create(message);
        break;
      // case "apm/fp":
      //   await Fingerprint.create(message);
      //   break;
      default:
        console.log(`Unhandled topic: ${topic}`);
    }
  } catch (error) {
    console.error(`Failed to handle message on topic ${topic}:`, error);
  }
}

async function initMQTT() {
  try {
    client = await connectToAWS();
  } catch (error) {
    console.error("Failed to connect to AWS IoT:", error);
    process.exit(1);
  }
}

async function publishMessage(topic, message) {
  if (!client) {
    throw new Error("MQTT client not initialized");
  }
  await client.publish(topic, JSON.stringify(message), mqtt.QoS.AtLeastOnce);
}

module.exports = {
  initMQTT,
  publishMessage,
};
