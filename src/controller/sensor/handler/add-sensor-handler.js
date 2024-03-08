const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");

const uploadSensor = async (request, h) => {
  const {
    name,
    brand,
    id_greenhouse,
    range_min,
    range_max,
    categoryId,
    calibration,
    tandonId,
  } = request.payload;

  let response = "";

  try {
    const result = await prisma.sensor.create({
      data: {
        name,
        brand,
        id_greenhouse,
        tandonId,
        calibration,
        range_min,
        range_max,
        categoryId,
      }
    })

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Sensor successfully created",
        data: result,
      }).code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Actuator failed to create",
      }).code(500)
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
  uploadSensor,
};
