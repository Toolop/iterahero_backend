const prefix = require("../../utils/prefix-utils.js");
const { uploadImageServer } = require("./handler/add-image-handler.js");
const { deleteImageML } = require("./handler/delete-image-handler.js");
const { getImageServer } = require("./handler/get-image-handler.js");

module.exports = [
  {
    method: "POST",
    path: `${prefix}/upload/ml`,
    config: {
      auth: false,
      payload: {
        multipart: true,
      },
    },
    handler: uploadImageServer,
  },
  {
    method: "GET",
    path: `${prefix}/ml`,
    config: {
      auth: false,
    },
    handler: getImageServer,
  },
  {
    method: "DELETE",
    path: `${prefix}/image/ml`,
    config: {
      auth: false,
    },
    handler: deleteImageML,
  },
];
