const prefix = require("../../utils/prefix-utils");
const { postHandler } = require("./handler/postHandler");
const { deleteHandler } = require("./handler/deleteHandler");
const { getHandler } = require("./handler/getHandler");
const { patchHandler } = require("./handler/patchHandler");

path = `${prefix}/penjadwalan`;

module.exports = [
  {
    method: "GET",
    path,
    handler: getHandler,
  },
  {
    method: "POST",
    path,
    handler: postHandler,
  },
  {
    method: "PATCH",
    path,
    handler: patchHandler,
  },
  {
    method: "DELETE",
    path,
    handler: deleteHandler,
  },
];
