const prefix = require("../../utils/prefix-utils.js");
const { uploadSensor } = require("./handler/add-sensor-handler.js");
const { deleteSensor } = require("./handler/delete-sensor-handler.js");
const { getSensorById } = require("./handler/detail-sensor-handler.js");
const {
  getSensorByGreenHouse,
} = require("./handler/getbygreenhouse-sensor-handler.js");
const { updateSensor } = require("./handler/update-sensor-handler.js");

module.exports = [
  {
    method: "POST",
    path: `${prefix}/sensor`,
    config: {
      auth: "jwt",
      payload: {
        multipart: true,
      },
    },
    handler: uploadSensor,
  },
  {
    method: "GET",
    path: `${prefix}/sensor`,
    config: { auth: "jwt" },
    handler: getSensorByGreenHouse,
  },
  {
    method: "GET",
    path: `${prefix}/sensor/{id}`,
    config: { auth: "jwt" },
    handler: getSensorById,
  },
  {
    method: "PUT",
    path: `${prefix}/sensor/{id}`,
    config: {
      auth: "jwt",
      payload: {
        multipart: true,
      },
    },
    handler: updateSensor,
  },
  {
    method: "DELETE",
    path: `${prefix}/sensor/{id}`,
    config: {
      auth: "jwt",
    },
    handler: deleteSensor,
  },
];
