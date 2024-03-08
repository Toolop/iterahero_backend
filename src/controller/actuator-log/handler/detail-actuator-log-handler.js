const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");

const getActuatorLogDetail = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    result = await prisma.actuator_log.findUnique({
      where: {
        id_actuator_log: parseInt(id)
      }
    })

    if (result) {
      response = h.response({
        code: 200,
        status: "OK",
        message: "Actuator log successfully retrieved",
        data: result
        // data: {
        //   id: result.rows[0].id_actuator_log,
        //   id_actuator: result.rows[0].id_actuator,
        //   on_off_status: result.rows[0].on_off_status,
        //   created_at: result.rows[0].created_at,
        // },
      }).code(200);
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Actuator log not found",
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
  getActuatorLogDetail,
};
