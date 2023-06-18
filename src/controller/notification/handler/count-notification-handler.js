const pool = require("../../../config/db");

const getCountNotifications = async (request, h) => {
	const { id_user } = request.auth.credentials;
	let countNotif = "";

	try {
		const totalRows = await pool.query(`SELECT * FROM public."notification" WHERE status = '0' and id_notification IN (SELECT id_notification FROM public."receive" WHERE id_user = $1)`,[id_user]);
		countNotif = totalRows.rowCount;
		
		response = h.response({
			code: 200,
			status: "OK",
			count: countNotif,
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
	getCountNotifications,
};
