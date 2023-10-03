const { getCameraByGreenhouseId } = require("./handler/getHandler");
const { addCameraByGreenhouseId } = require("./handler/postHandler");
const prefix = require("../../utils/prefix-utils");
const { updateCamera } = require("./handler/camera-update-handler");
const { deleteCamera } = require("./handler/camera-delete-handler");

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
  {
    method: "PUT",
    path: `${prefix}/camera/{id}`,
    config: {
      auth: "jwt",
    },
    handler: updateCamera,
  },
  {
    method: "DELETE",
    path: `${prefix}/camera/{id}`,
    config: {
      auth: "jwt",
    },
    handler: deleteCamera,
  },
];
