const pool = require("../../../config/db");
const { getActuator } = require("../../../utils/actuator-util");

const getNotifications = async (request, h) => {
  let { page, size } = request.query;
  const { by_user_id } = request.query;
  let result = "";
  let response = "";
  const { id_user } = request.auth.credentials;
  let totalPage = 0;

  try {
    page = page || 1;
    size = size || 10;
    const offset = (page - 1) * size;

    if (!by_user_id || by_user_id == 0) {
      result = await pool.query(
        `SELECT * FROM public."notification" ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
        [offset, size]
      );
      const totalRows = await pool.query('SELECT * FROM public."notification"');
      totalPage = Math.ceil(totalRows.rowCount / size);
    }

    if (by_user_id && by_user_id == 1) {
      result = await pool.query(
        `SELECT * FROM public."notification" WHERE id_notification IN (SELECT id_notification FROM public."receive" WHERE id_user = $1) ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
        [id_user, offset, size]
      );
      const totalRows = await pool.query(
        'SELECT * FROM public."notification" WHERE id_notification IN (SELECT id_notification FROM public."receive" WHERE id_user = $1)',
        [id_user]
      );
      totalPage = Math.ceil(totalRows.rowCount / size);
    }

    response = h.response({
      code: 200,
      status: "OK",
      data: await Promise.all(
        result.rows.map(async (row) => ({
          id: row.id_notification,
          detail: row.detail,
          created_at: row.created_at,
          type: row.type,
          status: row.status,
          id_sensor: row.id_sensor,
          id_greenhouse: (await getActuator(row.id_sensor)).id_greenhouse,
          greenhouse_loc: (await getActuator(row.id_sensor)).greenhouse_loc,
          photo: row.photo,
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
  getNotifications,
};
