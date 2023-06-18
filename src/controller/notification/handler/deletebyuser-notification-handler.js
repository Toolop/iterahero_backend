const pool = require("../../../config/db");

const deleteNotificationByUser = async (request, h) => {
	const { user_id } = request.params;
	let result = "";
	let response = "";

	try {
		if (user_id) {
			result = await pool.query(
				`DELETE FROM public."receive" WHERE id_notification = $1`,
				[user_id]
			);


			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Notification successfully deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Notification failed to delete",
				});

				response.code(500);
			}
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
	deleteNotificationByUser,
};
