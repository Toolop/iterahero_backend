const {
  getGrafik,
  getHistorySensor,
  getyear,
} = require("./handler/grafik-handler");
const prefix = require("../../utils/prefix-utils.js");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/grafik/{id_sensor}`,
    config: {
      auth: false,
    },
    handler: getGrafik,
  },
  {
    method: "GET",
    path: `${prefix}/grafik/year/{id_sensor}`,
    config: {
      auth: false,
    },
    handler: getyear,
  },
  {
    method: "GET",
    path: `${prefix}/history/sensor/{id_sensor}`,
    config: {
      auth: false,
    },
    handler: getHistorySensor,
  },
];
