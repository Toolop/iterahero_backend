const pool = require("../../../config/db");

const getSensorLogDetail = async (request, h) => {
  const { id } = request.params;
  let response = "";
  let result = "";
  try {
    result = await pool.query(
      'SELECT * FROM public."sensor_log" WHERE id_sensor_log = $1 LIMIT 1',
      [id]
    );

    response = h.response({
      code: 200,
      status: "OK",
      data: await Promise.all(
        result.rows.map(async (sensor) => ({
          id: sensor.id_sensor_log,
          sensor: sensor.id_sensor,
          value: sensor.value,
          created_at: sensor.created_at,
          status: sensor.status,
        }))
      ),
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
  getSensorLogDetail,
};
