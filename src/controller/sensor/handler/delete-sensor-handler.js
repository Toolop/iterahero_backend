const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { isSensorExist } = require("../../../utils/sensor-utils");

const deleteSensor = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isSensorExist(id)) {
      result = await prisma.sensor.delete({
        where: {
          id_sensor: parseInt(id)
        }
      });

      if (result) {
        response = h.response({
          code: 201,
          status: "OK",
          message: "Sensor has been deleted",
        }).code(201);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Sensor cannot be deleted",
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
  deleteSensor,
};
