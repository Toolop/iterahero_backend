const prefix = require("../../utils/prefix-utils.js");
const { uploadActuatorLog } = require("./handler/add-actuator-log-handler.js");
const {
  deleteActuatorLog,
} = require("./handler/delete-actuator-log-handler.js");
const {
  getActuatorLogDetail,
} = require("./handler/detail-actuator-log-handler.js");
const { getActuatorLogs } = require("./handler/get-actuator-log-handler.js");
const {
  getActuatorLogsToday,
} = require("./handler/today-actuator-log-handler.js");

module.exports = [
  {
    method: "POST",
    path: `${prefix}/actuator-log`,
    config: {
      auth: false,
      payload: {
        multipart: true,
      },
    },
    handler: uploadActuatorLog,
  },
  {
    method: "GET",
    path: `${prefix}/actuator-log`,
    config: { auth: "jwt" },
    handler: getActuatorLogs,
  },
  {
    method: "GET",
    path: `${prefix}/actuator-log/{id}`,
    config: { auth: "jwt" },
    handler: getActuatorLogDetail,
  },
  {
    method: "DELETE",
    path: `${prefix}/actuator-log`,
    config: { auth: "jwt" },
    handler: deleteActuatorLog,
  },
  {
    method: "GET",
    path: `${prefix}/actuator-log-today/{id}`,
    config: { auth: "jwt" },
    handler: getActuatorLogsToday,
  },
];
