const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadAutomation = async (request, h) => {
  const { id_actuator, id_sensor, condition, status_lifecycle, constanta } =
    request.payload;

  let response = "";

  try {
    const result = await prisma.automation.create({
      data: {
        id_actuator,
        id_sensor,
        condition,
        status_lifecycle,
        constanta
      }
    })

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Automation successfully created",
        data: result
        // data: {
        //   id_actuator: result.rows[0].id_actuator,
        //   id_sensor: result.rows[0].id_sensor,
        //   condition: result.rows[0].condition,
        //   status_lifecycle: result.rows[0].status_lifecycle,
        //   created_at: result.rows[0].created_at,
        //   constanta: result.rows[0].constanta,
        // },
      }).code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Actuator failed to create",
      });
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    });

    response.code(400);
  }

  return response;
};

module.exports = {
  uploadAutomation,
};
