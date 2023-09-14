const { getCameraBroker } = require("./handler/get-camera-broker.js");
const prefix = require("../../utils/prefix-utils.js");
const { uploadCameraBroker } = require("./handler/add-camera-broker.js");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/camera-broker`,
    config: {
      auth: false,
    },
    handler: getCameraBroker,
  },
  {
    method: "POST",
    path: `${prefix}/camera-broker`,
    config: {
      auth: false,
    },
    handler: uploadCameraBroker,
  },
];
