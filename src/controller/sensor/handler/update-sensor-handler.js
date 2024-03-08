const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { isSensorExist } = require("../../../utils/sensor-utils");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateSensor = async (request, h) => {
  const { id } = request.params;
  const {
    name,
    brand,
    range_min,
    range_max,
    categoryId,
    calibration,
  } = request.payload;
  let result = "";
  let response = "";

  try {
    if (await isSensorExist(id)) {
      const updated_at = getLocalISOString();

      result = await prisma.sensor.update({
        where: {
          id_sensor: parseInt(id)
        },
        data: {
          brand,
          name,
          range_min,
          range_max,
          calibration,
          categoryId
        }
      })
    
      if (result) {
        response = h.response({
          code: 201,
          status: "OK",
          message: "Sensor has been edited successfully",
        }).code(201);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Sensor cannot be edited",
        }).code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Sensor is not found",
      }).code(404);
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    }).code(400);

    console.log(err);
  }

  return response;
};

module.exports = {
  updateSensor,
};
