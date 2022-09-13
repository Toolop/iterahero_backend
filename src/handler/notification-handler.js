const pool = require("../config/db");
const { getActuator } = require("../utils/actuator-util");
const { getGreenHouse } = require("../utils/greenhouse-util");

const uploadNotification = async (request, h) => {
	const { detail, type, status, id_actuator } = request.payload;

	let response = "";

	try {
		const created_at = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Jakarta",
		});

		const result = await pool.query(
			`INSERT INTO public."notification" (detail, created_at, type, status, id_actuator) VALUES($1,$2,$3,$4,$5) RETURNING *`,
			[detail, created_at, type, status, id_actuator]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Notification successfully created",
				data: {
					id: result.rows[0].id_notification,
					detail: result.rows[0].detail,
					created_at: result.rows[0].created_at,
					type: result.rows[0].type,
					status: result.rows[0].status,
					id_actuator: result.rows[0].id_actuator,
					// buat di getnya
					// actuator_name: await getActuator(result.rows[0].id_actuator).name,
					// actuator_status_lifecycle: await getActuator(
					// 	result.rows[0].id_actuator
					// ).status_lifecycle,
					// greenhouse_name: await getGreenHouse(
					// 	await getActuator(result.rows[0].id_actuator).id_greenhouse
					// ).name,
					// greenhouse_location: await getGreenHouse(
					// 	await getActuator(result.rows[0].id_actuator).id_greenhouse
					// ).location,
				},
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Notification failed to create",
			});
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

// const uploadReceive = async (request, h) => {

// };

module.exports = {
	uploadNotification,
	// uploadReceive,
};
