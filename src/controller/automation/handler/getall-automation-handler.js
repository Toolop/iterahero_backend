const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { getNameActuatorByID } = require("../../../utils/actuator-util");
const { getNameSensorByID } = require("../../../utils/sensor-utils");

const getAllAutomation = async (request, h) => {
  let { id_actuator } = request.query;
  let result = "";
  let response = "";

  try {
    if (!id_actuator) {
      result = await prisma.automation.findMany({
        include: {
          Sensor: true,
          Actuator: true
        }
      });
      // result = await pool.query(
      //   `SELECT * FROM public."automation" ORDER BY (id_automation)`
      // );
    } else {
      result = await prisma.automation.findMany({
        where: {
          id_actuator
        },
        include: {
          Sensor: true,
          Actuator: true
        }
      })
      // result = await pool.query(
      //   `SELECT * FROM public."automation" WHERE id_actuator=$1 ORDER BY (id_automation)`,
      //   [id_actuator]
      // );
    }

    response = h.response({
      code: 200,
      status: "OK",
      data: result
      // data: await Promise.all(
      //   result.rows.map(async (automation) => ({
      //     sensor: await getNameSensorByID(automation.id_sensor),
      //     actuator: await getNameActuatorByID(automation.id_actuator),
      //     condition: automation.condition,
      //     status_lifecycle: automation.status_lifecycle,
      //     created_at: automation.created_at,
      //     constanta: automation.constanta,
      //     id_automation: automation.id_automation,
      //   }))
      // ),
    });

    response.code(200);
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
  getAllAutomation,
};
