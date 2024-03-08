const { prisma } = require("../../../config/prisma");
const { isAutomationExist } = require("../../../utils/automation-utils");

const deleteAutomation = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isAutomationExist(id)) {
      result = await prisma.automation.delete({
        where: {
          id_automation: parseInt(id)
        }
      })
      // result = await pool.query(
      //   'DELETE FROM public."automation" WHERE id_automation=$1',
      //   [id]
      // );

      if (result) {
        response = h.response({
          code: 201,
          status: "OK",
          message: "Automation has been deleted",
        }).code(201);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Automation cannot be deleted",
        }).code(500);
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
