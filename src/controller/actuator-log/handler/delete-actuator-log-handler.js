const pool = require("../../../config/db");

const deleteActuatorLog = async (request, h) => {
	const { id_actuator,id_actuator_log } = request.query;
	let result = "";
	let response = "";

	try {
		if (id_actuator && !id_actuator_log) {
			result = await pool.query(
				`DELETE FROM public."actuator_log" WHERE id_actuator = $1`,
				[id_actuator]
			);
		}
		else if (id_actuator_log && !id_actuator) {
			result = await pool.query(
				`DELETE FROM public."actuator_log" WHERE id = $1`,
				[id_actuator_log]
			);
		}


		if (result) {
			response = h.response({
				code: 200,
				status: "OK",
				message: "Actuator Log successfully deleted",
			});

			response.code(200);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Actuator Log failed to delete",
			});

			response.code(500);

		}
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
	deleteActuatorLog,
};
