const Event = require("./sampleDeviceSchema");
const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ankurauti:ankurauti02@cluster0.ng3tq.mongodb.net/TestEvents?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const APM1Ids = [
  100001, 100002, 100003, 100004, 100005, 100006, 100007, 100008, 100009,
  100010,
];
const APM2Ids = [
  200001, 200002, 200003, 200004, 200005, 200006, 200007, 200008, 200009,
  200010,
];
const APM3Ids = [
  300001, 300002, 300003, 300004, 300005, 300006, 300007, 300008, 300009,
  300010,
];

function getRandomDeviceId() {
  const allIds = [APM1Ids, APM2Ids, APM3Ids];
  const randomIdsArray = allIds[Math.floor(Math.random() * allIds.length)];
  return randomIdsArray[Math.floor(Math.random() * randomIdsArray.length)];
}

const dominicanRepublicLocations = [
  { lat: 18.5204, lon: 73.8567 }, // Pune
  { lat: 19.076, lon: 72.8777 }, // Mumbai
  { lat: 20.0074, lon: 73.7898 }, // Nashik
  { lat: 18.922, lon: 72.8347 }, // Thane
  { lat: 19.2183, lon: 73.0978 }, // Kalyan
  { lat: 18.9696, lon: 72.8205 }, // Dombivli
  { lat: 18.5074, lon: 73.8077 }, // Pimpri-Chinchwad
  { lat: 20.011, lon: 73.7602 }, // Nashik Road
  { lat: 19.9975, lon: 73.7898 }, // Deolali
  { lat: 19.845, lon: 72.9081 }, // Palghar
];

let lastDeviceId = 0;

function generateRandomData() {
  lastDeviceId++;
  const randomDominicanRepublicLocation =
    dominicanRepublicLocations[
      Math.floor(Math.random() * dominicanRepublicLocations.length)
    ];
  const alertTypes = ["Generated", "Pending", "Resolved"];
  const randomAlertType =
    alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const HWversion = ["APM1", "APM2", "APM3"];
  const randomHWversion =
    HWversion[Math.floor(Math.random() * HWversion.length)];

  const eventTypes = [
    {
      ID: lastDeviceId,
      DEVICE_ID: getRandomDeviceId(),
      TS: Date.now(),
      Type: 1,
      Cell_Info: {
        region: "India",
        lat: randomDominicanRepublicLocation.lat,
        lon: randomDominicanRepublicLocation.lon,
      },
      Installing: faker.datatype.boolean(),
    },
    // ... (rest of the event types)
  ];

  const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  return randomEvent; // Directly return the event object
}

async function saveDataToMongo(inputJSON, schema) {
  try {
    const result = await schema.insertMany(inputJSON);
    if (result.length > 0) {
      return {
        statusCode: 200,
        message: "Document inserted successfully",
      };
    } else {
      throw new Error("Document not inserted");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

function sendDataToMongoEvery5min() {
  setInterval(() => {
    const event = generateRandomData();
    saveDataToMongo([event], Event)
      .then((result) => {
        console.log(result.message);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, 5000); // 5 seconds in milliseconds
}

sendDataToMongoEvery5min();

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  ID: Number,
  DEVICE_ID: Number,
  TS: Date,
  Type: Number,
  AlertType: String,
  Cell_Info: {
    region: String,
    lat: Number,
    lon: Number,
  },
  Installing: Boolean,
  guest_id: Number,
  registering: Boolean,
  guest_age: Number,
  guest_male: Boolean,
  member_keys: [Boolean],
  guests: [Boolean],
  confidence: Number,
  differential_mode: Boolean,
  software_version: String,
  hardware_version: String,
  power_pcb_firmware_version: String,
  remote_firmware_version: String,
  audio_configuration: [Boolean],
  audience_day_start_time: Number,
  no_of_sessions: Number,
  Meter_tamper: Boolean,
  Tv_plug_tamper: Boolean,
  sos: Boolean,
  main_bat_fail: Boolean,
  rtc_fail: Boolean,
  rtc_bat_low: Boolean,
  HHID: String,
  Success: Boolean,
  high_rail_voltage: Number,
  mid_rail_voltage: Number,
  gsm_rail_voltage: Number,
  rtc_battery_voltage: Number,
  li_ion_battery_voltage: Number,
  remote_battery_voltage: Number,
  battery_temp: Number,
  arm_core_temp: Number,
  power_pcb_temp: Number,
  rtc_temp: Number,
  server: String,
  system_time: Date,
  error_code: Number,
  drift: Number,
  jumped: Boolean,
  stop_time: Number,
  viewing_member_keys: [Boolean],
  viewing_guests: [Boolean],
  tv_on: Boolean,
  last_watermark_id: Number,
  tv_event_ts: Number,
  last_watermark_id_ts: Date,
  marked: Number,
  Ip_up: Boolean,
  Sim: Number,
  remote_id: Number,
  lock: Boolean,
  orr: Boolean,
  absent_key_press: Boolean,
  drop: Boolean,
  sim1_absent: Boolean,
  sim1_changed: Boolean,
  sim2_absent: Boolean,
  sim2_changed: Boolean,
  name: String,
  Details: {
    name: String,
    error_code: Number,
    message: String,
  },
  rpi_serial: String,
  pcb_serial: String,
  imei: String,
  imsi_1: String,
  imsi_2: String,
  eeprom: Number,
  wifi_serial: String,
  mac_serial: String,
  remote_serial: Number,
  key: String,
  value: String,
  old_value: String,
  state: Boolean,
  previous: String,
  update: String,
  Rtc: Number,
  Meter: Number,
  boot_ts: Date,
  last_boot_ts: Date,
  last_shutdown_ts: Date,
  clean: Boolean,
  rtc_ts: Date,
  ntp_ts: Date,
  cell_ts: Date,
  time_approximated: Boolean,
  events_ignored: Boolean,
  Status: String,
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
