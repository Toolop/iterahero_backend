const pool = require('../config/db');

const getNameSensorByID = async (id) => {
  let sensor = {};

  try {
    const result = await pool.query(
        'SELECT * FROM public."sensor" WHERE id_sensor = $1',
        [id],
    );

    if (result.rows[0]) {
        sensor = {
            id: result.rows[0].id_sensor,
            name: result.rows[0].name,
        };
    }

    } catch (err) {
        console.log(err);
    }

  return sensor;
};
const isSensorExist = async (id) =>{
  let isExist = [];

  try{
    const result = await pool.query(
      'SELECT * FROM public."sensor" WHERE id_sensor = $1',
      [id],
    );

    if (result.rows[0]){
      isExist = true;
    }
    else{
      isExist = false;
    }

  }
  catch(err){
    console.log(err);
  }

  return isExist;
}

module.exports = { getNameSensorByID,isSensorExist };