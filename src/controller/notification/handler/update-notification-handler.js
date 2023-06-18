const pool = require("../../../config/db");

const updateNotifications = async (request, h) => {
	const { id_user } = request.auth.credentials;
	try {
		await pool.query(`UPDATE public."notification" SET status = '1' WHERE id_notification IN (SELECT id_notification FROM public."receive" WHERE id_user = $1)`,[id_user]);
		
		response = h.response({
			code: 200,
			status: "Update Successfully",
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

module.exports = {
	updateNotifications,
};
