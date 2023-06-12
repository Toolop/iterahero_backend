const pool = require("../config/db");
const { getGreenHouse } = require("./greenhouse-util");

const getActuator = async (id) => {
	let actuator = {};

	try {
		const result = await pool.query(
			'SELECT * FROM public."actuator" WHERE id_actuator=$1',
			[id]
		);

		if (result.rows[0]) {
			const actuatorData = result.rows[0];
			actuator = {
				id: actuatorData.id_actuator,
				name: actuatorData.name,
				status_lifecycle: actuatorData.status_lifecycle,
				id_greenhouse: actuatorData.id_greenhouse,
				greenhouse_loc: (await getGreenHouse(actuatorData.id_greenhouse)).location,
				automation: actuatorData.automation,
			};
		}
	} catch (err) {
		console.log(err);
	}

	return actuator;
};

const isActuatorExist = async (id) => {
	let isExist = [];

	try {
		const result = await pool.query(
			'SELECT * FROM public."actuator" WHERE id_actuator = $1',
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

module.exports = { getActuator, isActuatorExist };
