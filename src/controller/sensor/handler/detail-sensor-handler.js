const { prisma } = require("../../../config/prisma");

const getSensorById = async (request, h) => {
  const { id } = request.params;
  let response = "";

  try {
    const result = await prisma.sensor.findUnique({
      where: {
        id_sensor: id
      }
    })

    if (result) {
      response = h.response({
        code: 200,
        status: "OK",
        data: result
      }).code(200);
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Sensor not found",
      }).code(404);

      response.code(404);
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
  getSensorById,
};
