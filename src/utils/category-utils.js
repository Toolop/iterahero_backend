const pool = require('../config/db');

const getSensorCategory = async (id) => {
  let category = {};

  try {
    const result = await pool.query(
        'SELECT * FROM public."category_sensor" WHERE id_category_sensor = $1',
        [id],
    );

    if (result.rows[0]) {
        category = {
            id: result.rows[0].id_category_sensor,
            name: result.rows[0].name,
        };
    }

    } catch (err) {
        console.log(err);
    }

  return category;
};

module.exports = { getSensorCategory };