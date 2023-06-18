const pool = require("../../../config/db");
const { getUser } = require("../../../utils/user-util");

const getGreenHouseDetail = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."greenhouse" WHERE id_greenhouse=$1`,
			[id]
		);

		if (result.rowCount > 0) {
			response = h.response({
				code: 200,
				status: "OK",
				data: {
					id: result.rows[0].id_greenhouse,
					name: result.rows[0].name,
					image: result.rows[0].image,
					location: result.rows[0].location,
					created_at: result.rows[0].created_at,
					user_id: result.rows[0].id_user,
					user_name: (await getUser(result.rows[0].id_user)).name,
				},
			});

			response.code(200);
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Greenhouse not found",
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
	getGreenHouseDetail,
};
