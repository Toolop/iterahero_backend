const { getCameraBroker } = require("./handler/get-camera-broker.js");
const prefix = require("../../utils/prefix-utils.js");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/camera-broker`,
    config: {
      auth: false,
    },
    handler: getCameraBroker,
  },
];
