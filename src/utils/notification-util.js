const pool = require("../config/db");

const isNotificationExist = async (id) => {
  let isExist = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."receive" WHERE id_notification=$1',
      [id]
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

module.exports = {
  isNotificationExist,
};
