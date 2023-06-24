const pool = require("../../../config/db");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadAutomation = async (request, h) => {
  const { id_actuator, id_sensor, condition, status_lifecycle, constanta } =
    request.payload;

  let response = "";

  try {
    const created_at = getLocalISOString();

    const result = await pool.query(
      `INSERT INTO public.automation (id_actuator,id_sensor,condition,status_lifecycle,created_at,constanta) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;`,
      [
        id_actuator,
        id_sensor,
        condition,
        status_lifecycle,
        created_at,
        constanta,
      ]
    );

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Automation successfully created",
        data: {
          id_actuator: result.rows[0].id_actuator,
          id_sensor: result.rows[0].id_sensor,
          condition: result.rows[0].condition,
          status_lifecycle: result.rows[0].status_lifecycle,
          created_at: result.rows[0].created_at,
          constanta: result.rows[0].constanta,
        },
      });

      response.code(201);
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
