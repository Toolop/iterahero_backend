const pool = require("../../../config/db");
const { getSensorCategory } = require("../../../utils/category-utils");
const { getGreenHouseName } = require("../../../utils/greenhouse-util");

const getSensorByGreenHouse = async (request, h) => {
  const { by_id_greenhouse } = request.query;
  let { page, size } = request.query;
  let response = "";
  let result = "";
  let totalPage = 0;

  try {
    page = page || 1;
    size = size || 10;

    if (!by_id_greenhouse) {
      result = await pool.query(
        'SELECT * FROM public."sensor" ORDER BY created_at ASC OFFSET $1 LIMIT $2',
        [(page - 1) * size, size]
      );
      const totalRows = await pool.query('SELECT * FROM public."sensor"');
      totalPage = Math.ceil(totalRows.rowCount / size);
    } else if (by_id_greenhouse) {
      result = await pool.query(
        'SELECT * FROM public."sensor" WHERE id_greenhouse = $1 ORDER BY created_at ASC OFFSET $2 LIMIT $3',
        [by_id_greenhouse, (page - 1) * size, size]
      );
      const totalRows = await pool.query(
        'SELECT * FROM public."sensor" WHERE id_greenhouse=$1',
        [by_id_greenhouse]
      );
      totalPage = Math.ceil(totalRows.rowCount / size);
    }

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
          greenhouse: await getGreenHouseName(sensor.id_greenhouse),
          created_at: sensor.created_at,
          id_greenhouse: sensor.id_greenhouse,
          calibration: sensor.calibration,
          detail: sensor.detail,
          sensor_image: sensor.sensor_image,
          posisition: sensor.posisition,
        }))
      ),
      totalPage: totalPage,
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
  getSensorByGreenHouse,
};
