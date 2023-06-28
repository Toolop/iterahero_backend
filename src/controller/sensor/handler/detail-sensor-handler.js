const pool = require("../../../config/db");
const { getSensorCategory } = require("../../../utils/category-utils");
const { getGreenHouseName } = require("../../../utils/greenhouse-util");

const getSensorById = async (request, h) => {
  const { id } = request.params;
  let response = "";
  let result = "";

  try {
    result = await pool.query(
      'SELECT * FROM public."sensor" WHERE id_sensor = $1 LIMIT 1',
      [id]
    );

    if (result.rows[0]) {
      response = h.response({
        code: 200,
        status: "OK",
        data: await Promise.all(
          result.rows.map(async (sensor) => ({
            id: sensor.id_sensor,
            name: sensor.name,
            unit_measurement: sensor.unit_measurement,
            brand: sensor.brand,
            icon: sensor.icon,
            color: sensor.color,
            range_min: sensor.range_min,
            range_max: sensor.range_max,
            category: await getSensorCategory(sensor.id_category_sensor),
            created_at: sensor.created_at,
            id_greenhouse: sensor.id_greenhouse,
            greenhouse: await getGreenHouseName(sensor.id_greenhouse),
            calibration: sensor.calibration,
            detail: sensor.detail,
            sensor_image: sensor.sensor_image,
            posisition: sensor.posisition,
          }))
        ),
      });
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Sensor not found",
      });

      response.code(404);
    }

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
  getSensorById,
};
