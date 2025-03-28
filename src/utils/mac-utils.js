const pool = require("../config/db");

const isMacExist = async (id) => {
  let isExist = [];

  try {
    const result = await pool.query(
      'SELECT * FROM public."mac_address" WHERE id_sensor = $1 OR id_actuator = $2',
      [id, id]
    );

    if (result.rows[0]) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};

module.exports = { isMacExist };
