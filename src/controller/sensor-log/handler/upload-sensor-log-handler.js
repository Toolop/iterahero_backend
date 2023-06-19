const pool = require("../../../config/db");

const uploadSensorLog = async (request, h) => {
  const { id_sensor, value, status } = request.payload;

  let response = "";

  try {
    const created_at = getLocalISOString();
    const result = await pool.query(
      `INSERT INTO public."sensor_log" (value, created_at,status,id_sensor) VALUES($1,$2,$3,$4) RETURNING *`,
      [value, created_at, status, id_sensor]
    );

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Sensor log successfully created",
        data: {
          id: result.rows[0].id_sensor_log,
          sensor: result.rows[0].id_sensor,
          value: result.rows[0].value,
          created_at: result.rows[0].created_at,
          status: result.rows[0].status,
        },
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Sensor log failed to create",
      });
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
  uploadSensorLog,
};
