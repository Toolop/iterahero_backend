const pool = require("../../../config/db");
const { isActuatorExist } = require("../../../utils/actuator-util");

const deleteActuator = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		if (await isActuatorExist(id)) {
			result = await pool.query(
				'DELETE FROM public."actuator" WHERE id_actuator=$1',
				[id]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Actuator has been deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Actuator cannot be deleted",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Actuator is not found",
			});
			response.code(404);
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
	deleteActuator,
};
