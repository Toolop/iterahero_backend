const pool = require("../config/db");

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
			};
		}
	} catch (err) {
		console.log(err);
	}

	return actuator;
};

module.exports = { getActuator };
