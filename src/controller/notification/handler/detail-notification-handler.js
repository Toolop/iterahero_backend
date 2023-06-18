const pool = require("../../../config/db");

const getNotificationDetail = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."notification" WHERE id_notification = $1`,
			[id]
		);

		if (result.rowCount > 0) {
			response = h.response({
				code: 200,
				status: "OK",
				data: {
					id: result.rows[0].id_notification,
					detail: result.rows[0].detail,
					created_at: result.rows[0].created_at,
					type: result.rows[0].type,
					status: result.rows[0].status,
					id_sensor: result.rows[0].id_sensor,
				},
			});

			response.code(200);
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Notification not found",
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
	getNotificationDetail,
};
