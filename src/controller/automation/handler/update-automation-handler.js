const pool = require("../../../config/db");
const { isAutomationExist } = require("../../../utils/automation-utils");

const updateAutomation = async (request, h) => {
  const { id } = request.params;

  const { id_actuator, id_sensor, between, status_lifecycle, constanta } =
    request.payload;

  let result = "";
  let response = "";

  try {
    if (await isAutomationExist(id)) {
      result = await pool.query(
        'UPDATE public."automation" SET id_actuator=$1,id_sensor=$2,between=$3,status_lifecycle=$4,constanta=$5 WHERE id_automation = $6',
        [id_actuator, id_sensor, between, status_lifecycle, constanta, id]
      );

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Automation has been edited successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Automation cannot be edited",
        });

        response.code(500);
      }
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
  updateAutomation,
};
