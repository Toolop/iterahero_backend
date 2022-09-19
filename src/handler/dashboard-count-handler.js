const pool = require("../config/db");

const getCountDashboard = async (request, h) => {
	let response = "";
	let { getGreenhouseCount, getSensorCount, getActuatorCount } = "";
	const { id_user, email } = request.auth.credentials;

	try {
		getGreenhouseCount = await pool.query(
			`SELECT COUNT(*) from public."greenhouse" WHERE id_user = $1`,
			[id_user]
		);

		getSensorCount = await pool.query(
			`SELECT COUNT(*) from public."sensor" as ss JOIN public."greenhouse" as gh ON ss.id_greenhouse = gh.id_greenhouse WHERE id_user = $1`,
			[id_user]
		);

		getActuatorCount = await pool.query(
			`SELECT COUNT(*) from public."actuator" as ac JOIN public."greenhouse" as gh ON ac.id_greenhouse = gh.id_greenhouse WHERE id_user = $1`,
			[id_user]
		);

		response = h.response({
			code: 200,
			status: "OK",
			data: {
				greenhouse: getGreenhouseCount.rows[0].count,
				sensor: getSensorCount.rows[0].count,
				actuator: getActuatorCount.rows[0].count,
			},
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

module.exports = { getCountDashboard };
