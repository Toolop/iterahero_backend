const { prisma } = require("../../../config/prisma");

const deleteActuatorLog = async (request, h) => {
  const { id_actuator, id_actuator_log } = request.query;
  let result = "";
  let response = "";

  try {
    if (id_actuator || id_actuator_log) {
      if (id_actuator) {
        result = await prisma.actuator_log.deleteMany({
          where: {
            id_actuator: parseInt(id_actuator)
          }
        })
      } else if (id_actuator_log) {
        result = await prisma.actuator_log.delete({
          where: {
            id_actuator_log: parseInt(id_actuator_log)
          }
        })
      }

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Actuator Log successfully deleted",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Actuator Log failed to delete",
        });
      }
      response = h.response({
        status: "Bad Request",
        message: "Invalid id provided"
      }).code(400)
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
  deleteActuatorLog,
};
