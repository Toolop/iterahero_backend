const pool = require("../../../config/db");

const getSensorLogBySensor = async (request, h) => {
  const { id_sensor } = request.query;
  let { page, size } = request.query;
  let response = "";
  let result = "";

  try {
    page = page || 1;
    size = size || 10;
    if (!id_sensor) {
      result = await pool.query(
        'SELECT * FROM public."sensor_log" ORDER BY created_at ASC OFFSET $1 LIMIT $2',
        [(page - 1) * size, size]
      );
    } else if (id_sensor) {
      result = await pool.query(
        'SELECT * FROM public."sensor_log" WHERE id_sensor = $1 ORDER BY created_at ASC OFFSET $2 LIMIT $3',
        [id_sensor, (page - 1) * size, size]
      );
    }

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
  getSensorLogBySensor,
};
