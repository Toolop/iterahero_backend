const { getCameraByGreenhouseId } = require("./handler/getHandler");
const { addCameraByGreenhouseId } = require("./handler/postHandler");
const prefix = require("../../utils/prefix-utils");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/camera`,
    config: {
      auth: "jwt",
    },
    handler: getCameraByGreenhouseId,
  },
  {
    method: "POST",
    path: `${prefix}/camera`,
    config: {
      auth: "jwt",
      payload: {
        multipart: true,
      },
    },
    handler: addCameraByGreenhouseId,
  },
];
