const pool = require("../../../config/db");
const { isActuatorExist } = require("../../../utils/actuator-util");
const { prisma } = require('../../../config/prisma');

const deleteActuator = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isActuatorExist(id)) {
      result = await prisma.actuator.delete({
        where: {
          id_actuator: parseInt(id)
        }
      })

      if (result) {
        response = h.response({
          code: 201,
          status: "OK",
          message: "Actuator has been deleted",
        }).code(201);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Actuator cannot be deleted",
        }).code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Actuator is not found",
      });
      response.code(404);
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    });

    response.code(400);
    console.log(err);
  }

  return response;
};

module.exports = {
  deleteActuator,
};
