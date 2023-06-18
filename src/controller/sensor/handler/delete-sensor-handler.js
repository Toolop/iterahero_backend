const pool = require("../../../config/db");
const { isSensorExist } = require("../../../utils/sensor-utils");


const deleteSensor = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		if (await isSensorExist(id)) {
			result = await pool.query(
				'DELETE FROM public."sensor" WHERE id_sensor=$1',
				[id]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Sensor has been deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Sensor cannot be deleted",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Sensor is not found",
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
	deleteSensor,
};
