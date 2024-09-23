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
  const eventTypes = [
    { type: 1, fields: ["Cell_Info", "Installing"] },
    { type: 2, fields: ["guest_id", "registering", "guest_age", "guest_male"] },
    { type: 3, fields: ["member_keys", "guests", "confidence"] },
    {
      type: 4,
      fields: [
        "differential_mode",
        "member_keys",
        "guest_cancellation_time",
        "software_version",
        "hardware_version",
        "power_pcb_firmware_version",
        "remote_firmware_version",
        "audio_configuration",
        "audience_day_start_time",
        "no_of_sessions",
      ],
    },
    { type: 5, fields: ["AlertType", "Meter_tamper", "Tv_plug_tamper"] },
    { type: 6, fields: ["AlertType", "sos"] },
    {
      type: 7,
      fields: ["AlertType", "main_bat_fail", "rtc_fail", "rtc_bat_low"],
    },
    { type: 8, fields: ["HHID", "Success"] },
    {
      type: 9,
      fields: [
        "high_rail_voltage",
        "mid_rail_voltage",
        "gsm_rail_voltage",
        "rtc_battery_voltage",
        "li_ion_battery_voltage",
        "remote_battery_voltage",
      ],
    },
    {
      type: 10,
      fields: ["battery_temp", "arm_core_temp", "power_pcb_temp", "rtc_temp"],
    },
    {
      type: 11,
      fields: [
        "server",
        "system_time",
        "success",
        "error_code",
        "drift",
        "jumped",
      ],
    },
    {
      type: 12,
      fields: [
        "stop_time",
        "viewing_member_keys",
        "viewing_guests",
        "tv_on",
        "last_watermark_id",
        "tv_event_ts",
        "last_watermark_id_ts",
        "marked",
      ],
    },
    { type: 13, fields: ["Ip_up", "Sim"] },
    { type: 14, fields: ["remote_id", "success"] },
    { type: 15, fields: ["lock", "orr", "absent_key_press", "drop"] },
    {
      type: 16,
      fields: [
        "AlertType",
        "sim1_absent",
        "sim1_changed",
        "sim2_absent",
        "sim2_changed",
      ],
    },
    { type: 17, fields: ["name", "AlertType", "Details"] },
    {
      type: 18,
      fields: [
        "rpi_serial",
        "pcb_serial",
        "imei",
        "imsi_1",
        "imsi_2",
        "eeprom",
        "wifi_serial",
        "mac_serial",
        "remote_serial",
      ],
    },
    { type: 19, fields: ["key", "value", "old_value"] },
    { type: 20, fields: ["state"] },
    { type: 21, fields: ["previous", "update", "success"] },
    { type: 22, fields: ["Rtc", "Meter"] },
    {
      type: 23,
      fields: ["boot_ts", "last_boot_ts", "last_shutdown_ts", "clean"],
    },
    {
      type: 24,
      fields: [
        "rtc_ts",
        "ntp_ts",
        "cell_ts",
        "boot_ts",
        "clean",
        "time_approximated",
        "events_ignored",
      ],
    },
    { type: 25, fields: ["state"] },
    { type: 26, fields: ["state"] },
    { type: 27, fields: ["Status"] },
  ];

  const randomEventType =
    eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const event = {
    ID: lastDeviceId++,
    DEVICE_ID: getRandomDeviceId(),
    TS: Date.now(),
    Type: randomEventType.type,
  };

  randomEventType.fields.forEach((field) => {
    switch (field) {
      case "Cell_Info":
        event.Cell_Info = {
          region: "India",
          lat: getRandomLocation().lat,
          lon: getRandomLocation().lon,
        };
        break;
      case "Installing":
      case "registering":
      case "guest_male":
      case "differential_mode":
      case "Meter_tamper":
      case "Tv_plug_tamper":
      case "sos":
      case "main_bat_fail":
      case "rtc_fail":
      case "rtc_bat_low":
      case "Success":
      case "tv_on":
      case "Ip_up":
      case "lock":
      case "orr":
      case "absent_key_press":
      case "drop":
      case "sim1_absent":
      case "sim1_changed":
      case "sim2_absent":
      case "sim2_changed":
      case "success":
      case "clean":
      case "time_approximated":
      case "events_ignored":
      case "state":
        event[field] = faker.datatype.boolean();
        break;
      case "guest_id":
      case "guest_age":
      case "confidence":
      case "guest_cancellation_time":
      case "audience_day_start_time":
      case "no_of_sessions":
      case "high_rail_voltage":
      case "mid_rail_voltage":
      case "gsm_rail_voltage":
      case "rtc_battery_voltage":
      case "li_ion_battery_voltage":
      case "remote_battery_voltage":
      case "battery_temp":
      case "arm_core_temp":
      case "power_pcb_temp":
      case "rtc_temp":
      case "error_code":
      case "drift":
      case "stop_time":
      case "last_watermark_id":
      case "tv_event_ts":
      case "marked":
      case "Sim":
      case "remote_id":
      case "Rtc":
      case "Meter":
        event[field] = faker.number.int({ min: 1, max: 100 });
        break;
      case "AlertType":
        event.AlertType = ["Generated", "Pending", "Resolved"][
          Math.floor(Math.random() * 3)
        ];
        break;
      case "software_version":
      case "hardware_version":
      case "power_pcb_firmware_version":
      case "remote_firmware_version":
      case "previous":
      case "update":
        event[field] = faker.system.semver();
        break;
      case "member_keys":
      case "guests":
      case "audio_configuration":
      case "viewing_member_keys":
      case "viewing_guests":
        event[field] = Array(faker.number.int({ min: 1, max: 12 })).fill(
          faker.datatype.boolean()
        );
        break;
      case "server":
        event.server = "time.google.com";
        break;
      case "system_time":
      case "boot_ts":
      case "last_boot_ts":
      case "last_shutdown_ts":
      case "rtc_ts":
      case "ntp_ts":
      case "cell_ts":
      case "last_watermark_id_ts":
        event[field] = Date.now();
        break;
      case "Details":
        event.Details = {
          name: "System Error",
          error_code: faker.number.int({ min: 400, max: 599 }),
          message: faker.lorem.words({ min: 5, max: 10 }),
        };
        break;
      case "rpi_serial":
      case "pcb_serial":
      case "imei":
      case "imsi_1":
      case "imsi_2":
      case "wifi_serial":
      case "mac_serial":
        event[field] = faker.string.alphanumeric(10);
        break;
      case "eeprom":
      case "remote_serial":
        event[field] = faker.number.int();
        break;
      case "key":
        event.key = "timeout";
        break;
      case "value":
      case "old_value":
        event[field] = faker.string.numeric(2);
        break;
      case "name":
        event.name = "System Alarm";
        break;
      case "Status":
        event.Status = "line_in";
        break;
    }
  });

  return event;
}


function getRandomLocation() {
  return dominicanRepublicLocations[
    Math.floor(Math.random() * dominicanRepublicLocations.length)
  ];
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
