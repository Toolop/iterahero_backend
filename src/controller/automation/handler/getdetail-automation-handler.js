const pool = require("../../../config/db");
const { getNameActuatorByID } = require("../../../utils/actuator-util");
const { isAutomationExist } = require("../../../utils/automation-utils");
const { getNameSensorByID } = require("../../../utils/sensor-utils");

const getDetailAutomation = async (request, h) => {
  let { id } = request.params;
  let result = "";
  let response = "";

  try {
    result = await pool.query(
      `SELECT * FROM public."automation" WHERE id_automation = $1`,
      [id]
    );

    if (result.rowCount > 0) {
      response = h.response({
        code: 200,
        status: "OK",
        data: {
          sensor: await getNameSensorByID(result.rows[0].id_sensor),
          actuator: await getNameActuatorByID(result.rows[0].id_actuator),
          condition: result.rows[0].condition,
          status_lifecycle: result.rows[0].status_lifecycle,
          created_at: result.rows[0].created_at,
          constanta: result.rows[0].constanta,
          id_automation: result.rows[0].id_automation,
        },
      });

      response.code(200);
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Automation is not found",
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
  getDetailAutomation,
};
