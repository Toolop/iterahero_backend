const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const uploadActuatorLog = async (request, h) => {
	const { id_actuator, on_off_status } = request.payload;

	let response = "";

	try {
		// const created_at = new Date().toISOString();
        const created_at = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });

		const result = await pool.query(
			`INSERT INTO public."actuator_log" (id_actuator, on_off_status, created_at) VALUES($1,$2,$3) RETURNING *`,
			[id_actuator, on_off_status, created_at]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Actuator log successfully created",
				data: {
					id: result.rows[0].id_actuator_log,
					id_actuator: result.rows[0].id_actuator,
					on_off_status: result.rows[0].on_off_status,
					created_at: result.rows[0].created_at,
				},
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Actuator log failed to create",
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
	uploadActuatorLog,
};
