const pool = require('../config/db');
const {getSensorCategory} = require('./category-utils');
const {getGreenHouseName} = require('./greenhouse-util');

const getSensor = async (id) => {
	let sensor = {};

	try {
		const result = await pool.query(
			'SELECT * FROM public."sensor" WHERE id_sensor=$1',
			[id]
		);

		if (result.rows[0]) {
			const sensorData = result.rows[0];
			sensor = {
				id: sensorData.id_sensor,
			  name: sensorData.name,
			  unit_measurement: sensorData.unit_measurement,
				brand: sensorData.brand,
				icon: sensorData.icon,
				color: sensorData.color,
				range_min: sensorData.range_min,
				range_max: sensorData.range_max,
        category: await getSensorCategory(sensorData.id_category_sensor),
        created_at: sensorData.created_at,
        id_greenhouse: sensorData.id_greenhouse,
        greenhouse: await getGreenHouseName(sensorData.id_greenhouse),
        notify: sensorData.notify,
			};
		}
	} catch (err) {
		console.log(err);
	}

	return sensor;
};

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

module.exports = { getNameSensorByID,isSensorExist,getSensor };