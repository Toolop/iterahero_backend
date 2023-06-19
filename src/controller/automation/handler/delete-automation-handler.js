const pool = require("../../../config/db");
const { isAutomationExist } = require("../../../utils/automation-utils");

const deleteAutomation = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isAutomationExist(id)) {
      result = await pool.query(
        'DELETE FROM public."automation" WHERE id_automation=$1',
        [id]
      );

      if (result) {
        response = h.response({
          code: 200,
          status: "OK",
          message: "Automation has been deleted",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Automation cannot be deleted",
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
  deleteAutomation,
};
