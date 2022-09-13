const pool = require("../config/db");

const getGreenHouse = async (id) => {
	let greenhouse = {};

	try {
		const result = await pool.query(
			'SELECT * FROM public."greenhouse" WHERE id_greenhouse=$1',
			[id]
		);

		if (result.rows[0]) {
			const greenhouseData = result.rows[0];
			greenhouse = {
				id: greenhouseData.id_greenhouse,
				name: greenhouseData.name,
				location: greenhouseData.location,
			};
		}
	} catch (err) {
		console.log(err);
	}

	return greenhouse;
};

module.exports = { getGreenHouse };
