const prefix = require("../../utils/prefix-utils.js");
const { downloadSummary } = require("./handler/download-handler.js");
const { getSummary } = require("./handler/sumary-handler");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/summary/{id_sensor}`,
    config: {
      auth: false,
    },
    handler: getSummary,
  },
  {
    method: "GET",
    path: `${prefix}/download_summary/{id_sensor}`,
    config: {
      auth: false,
    },
    handler: downloadSummary,
  },
];
