const pool = require("../../../config/db");
const { getGreenHouseName } = require("../../../utils/greenhouse-util");

const getActuatorDetail = async (request, h) => {
  const { id } = request.params;
  let result = "";
  let response = "";

  try {
    result = await pool.query(
      `SELECT * FROM public."actuator" WHERE id_actuator = $1`,
      [id]
    );

    if (result.rowCount > 0) {
      response = h.response({
        code: 200,
        status: "OK",
        data: {
          id: result.rows[0].id_actuator,
          name: result.rows[0].name,
          status_lifecycle: result.rows[0].status_lifecycle,
          color: result.rows[0].color,
          icon: result.rows[0].icon,
          created_at: result.rows[0].created_at,
          updated_at: result.rows[0].updated_at,
          id_greenhouse: result.rows[0].id_greenhouse,
          greenhouse: await getGreenHouseName(result.rows[0].id_greenhouse),
          automation: result.rows[0].automation,
        },
      });

      response.code(200);
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Actuator not found",
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
  getActuatorDetail,
};
