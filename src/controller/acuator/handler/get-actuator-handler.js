const pool = require("../../../config/db");
const { getGreenHouseName } = require("../../../utils/greenhouse-util");

const getActuators = async (request, h) => {
  let { page, size } = request.query;
  const { by_greenhouse_id } = request.query;
  let result = "";
  let response = "";
  let totalPage = 0;

  try {
    page = page || 1;
    size = size || 10;
    const offset = (page - 1) * size;

    if (!by_greenhouse_id) {
      result = await pool.query(
        `SELECT * FROM public."actuator" ORDER BY created_at ASC OFFSET $1 LIMIT $2`,
        [offset, size]
      );
      const totalRows = await pool.query('SELECT * FROM public."actuator"');
      totalPage = Math.ceil(totalRows.rowCount / size);
    }

    if (by_greenhouse_id) {
      result = await pool.query(
        `SELECT * FROM public."actuator" WHERE id_greenhouse = $1 ORDER BY created_at ASC OFFSET $2 LIMIT $3`,
        [by_greenhouse_id, offset, size]
      );
      const totalRows = await pool.query(
        'SELECT * FROM public."actuator" WHERE id_greenhouse=$1',
        [by_greenhouse_id]
      );
      totalPage = Math.ceil(totalRows.rowCount / size);
    }

    response = h.response({
      code: 200,
      status: "OK",
      data: await Promise.all(
        result.rows.map(async (actuator) => ({
          id: actuator.id_actuator,
          name: actuator.name,
          status_lifecycle: actuator.status_lifecycle,
          color: actuator.color,
          icon: actuator.icon,
          created_at: actuator.created_at,
          updated_at: actuator.updated_at,
          id_greenhouse: actuator.id_greenhouse,
          greenhouse: await getGreenHouseName(actuator.id_greenhouse),
          automation: actuator.automation,
          detailact: actuator.detailact,
          posisitionact: actuator.posisitionact,
          actuator_image: actuator.actuator_image,
        }))
      ),
      totalPage: totalPage,
    });
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
  getActuators,
};
