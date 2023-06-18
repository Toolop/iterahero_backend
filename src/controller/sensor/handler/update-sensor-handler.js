const pool = require("../../../config/db");
const { isSensorExist } = require("../../../utils/sensor-utils");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const updateSensor = async (request, h) => {
	const { id } = request.params;
	const {
		name,
		unit_measurement,
		brand,
		color,
		icon,
		range_min,
		range_max,
		id_category_sensor,
		calibration,
	} = request.payload;
	let result = "";
	let response = "";

	try {
		if (await isSensorExist(id)) {
			const updated_at = getLocalISOString();

			result = await pool.query(
				'UPDATE public."sensor" SET "name"=$1, unit_measurement=$2, brand=$3, updated_at=$4, icon=$5, color=$6, range_min = $7,range_max = $8,id_category_sensor = $9, calibration = $10 WHERE id_sensor = $11',
				[
					name,
					unit_measurement,
					brand,
					updated_at,
					icon,
					color,
					range_min,
					range_max,
					id_category_sensor,
					calibration,
					id,
				]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Sensor has been edited successfully",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Sensor cannot be edited",
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
	updateSensor,
};
