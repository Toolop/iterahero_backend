const pool = require("../../../config/db");
const {
  isScheduleExist,
  updateScheduleUtil,
} = require("../../../utils/schedule-util");

const deleteSchedule = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    if (await isScheduleExist) {
      result = await pool.query(
        `DELETE FROM public."schedule" WHERE id_schedule = $1`,
        [id]
      );
      result = await pool.query(
        `DELETE FROM public."schedule" WHERE id_schedule = $1`,
        [parseInt(id) + 1]
      );

      if (result) {
        await updateScheduleUtil();
        response = h.response({
          code: 200,
          status: "OK",
          message: "Schedule successfully deleted",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Schedule failed to delete",
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Schedule is not found",
      });

      response.code(500);
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
  deleteSchedule,
};
