const prefix = require("../../utils/prefix-utils.js");
const {
  getSensorLogDetail,
} = require("./handler/detail-sensor-log-handler.js");
const { getSensorLogBySensor } = require("./handler/get-sensor-log-handler.js");
const { uploadSensorLog } = require("./handler/upload-sensor-log-handler.js");

module.exports = [
  {
    method: "POST",
    path: `${prefix}/sensor-log`,
    config: { auth: "jwt" },
    handler: uploadSensorLog,
  },
  {
    method: "GET",
    path: `${prefix}/sensor-log`,
    config: { auth: "jwt" },
    handler: getSensorLogBySensor,
  },
  {
    method: "GET",
    path: `${prefix}/sensor-log/{id}`,
    config: { auth: "jwt" },
    handler: getSensorLogDetail,
  },
];
