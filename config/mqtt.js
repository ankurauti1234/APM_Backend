const path = require("path");

const certPath = path.join(__dirname, "./config/certs/test.cert.pem.crt");
const keyPath = path.join(__dirname, "./config/certs/test.private.pem.key");
const caPath = path.join(__dirname, "./config/certs/root-CA.crt");

console.log("Certificate Path:", certPath);
console.log("Key Path:", keyPath);
console.log("CA Path:", caPath);

module.exports = {
  endpoint: "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com",
  certPath,
  keyPath,
  caPath,
  clientId: "mqtt-client-" + Math.random().toString(16).substr(2, 8),
  topicsToSubscribe: ["apm/device/data", "apm/logo"],
};
