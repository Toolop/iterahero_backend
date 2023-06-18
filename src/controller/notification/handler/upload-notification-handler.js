const pool = require("../../../config/db");
const { getActuator } = require("../../../utils/actuator-util");
const { getGreenHouse } = require("../../../utils/greenhouse-util");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadNotification = async (request, h) => {
	const { detail, type, status, id_sensor } = request.payload;

	let response = "";

	try {
		const created_at = getLocalISOString();

		const actuator = await getActuator(id_sensor);
		const id_user = (await getGreenHouse(actuator.id_greenhouse)).id_user;

		const result = await pool.query(
			`INSERT INTO public."notification" (detail, created_at, type, status, id_sensor) VALUES($1,$2,$3,$4,$5) RETURNING *`,
			[detail, created_at, type, status, id_sensor]
		);

		const makeReceiver = await pool.query(
			`INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
			[id_user, result.rows[0].id_notification]
		);
		
		if (result && makeReceiver) {
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
					id_sensor: result.rows[0].id_sensor,
					receive_status: "received",
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


module.exports = {
	uploadNotification,
};
