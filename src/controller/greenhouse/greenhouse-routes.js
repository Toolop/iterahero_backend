const prefix = require("../../utils/prefix-utils.js");
const { getSensorByGreenHouse } = require("../sensor/handler/getbygreenhouse-sensor-handler.js");
const { actuatorByGreenhouseId } = require("./handler/actuatorByGreenhouseId.js");
const { uploadGreenHouse } = require("./handler/add-greenhouse-handler.js");
const { deleteGreenhouse } = require("./handler/delete-greenhouse-handler.js");
const {
  getGreenHouseDetail,
} = require("./handler/detail-greenhouse-handler.js");
const { getGreenHouses } = require("./handler/get-greenhouse-handler.js");
const { sensorByGreenhouseId } = require("./handler/sensorByGreenhouseId.js");
const { updateGreenhouse } = require("./handler/update-greenhouse-handler.js");

const path = `${prefix}/greenhouse`

module.exports = [
  {
    method: "GET",
    path: `${path}`,
    config: { auth: "jwt" },
    handler: getGreenHouses,
  },
  {
    method: "GET",
    path: `${path}/{id}`,
    config: { auth: "jwt" },
    handler: getGreenHouseDetail,
  },
  {
    method: "GET",
    path: path + "/{id}/sensor",
    handler: sensorByGreenhouseId
},
{
  method: "GET",
  path: path + "/{id}/actuator",
  handler: actuatorByGreenhouseId
},
  {
    method: "POST",
    path: `${path}`,
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
    path: `${path}/{id}`,
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
    path: `${path}/{id}`,
    config: {
      auth: "jwt",
    },
    handler: deleteGreenhouse,
  },
];
