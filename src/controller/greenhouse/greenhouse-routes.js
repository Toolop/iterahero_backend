const prefix = require("../../utils/prefix-utils.js");
const { uploadGreenHouse } = require("./handler/add-greenhouse-handler.js");
const { deleteGreenhouse } = require("./handler/delete-greenhouse-handler.js");
const {
  getGreenHouseDetail,
} = require("./handler/detail-greenhouse-handler.js");
const { getGreenHouses } = require("./handler/get-greenhouse-handler.js");
const { getActuatorById } = require("./handler/getActuatorById.js");
const { getSensorById } = require("./handler/getSensorById.js");
const { updateGreenhouse } = require("./handler/update-greenhouse-handler.js");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/greenhouse`,
    config: { auth: "jwt" },
    handler: getGreenHouses,
  },
  {
    method: "GET",
    path: `${prefix}/greenhouse/{id}`,
    config: { auth: "jwt" },
    handler: getGreenHouseDetail,
  },
  {
    method: "GET",
    path: `${prefix}/greenhouse/{id}/sensor`,
    handler: getSensorById
  },
  {
    method: "GET",
    path: `${prefix}/greenhouse/{id}/actuator`,
    handler: getActuatorById
  },
  {
    method: "POST",
    path: `${prefix}/greenhouse`,
    config: {
      auth: "jwt",
      payload: {
        multipart: true,
      },
    },
    handler: uploadGreenHouse,
  },
  {
    method: "PUT",
    path: `${prefix}/greenhouse/{id}`,
    config: {
      auth: "jwt",
      payload: {
        multipart: true,
      },
    },
    handler: updateGreenhouse,
  },
  {
    method: "DELETE",
    path: `${prefix}/greenhouse/{id}`,
    config: {
      auth: "jwt",
    },
    handler: deleteGreenhouse,
  },
];
