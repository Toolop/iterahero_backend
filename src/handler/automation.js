const pool = require("../config/db");

const uploadAutomation = async (request, h) => {
	const {
		id_actuator,
		id_sensor,
		between,
		status_lifecycle,
	} = request.payload;

	let response = "";

	try {
		const created_at = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Jakarta",
		});

		const result = await pool.query(
			`INSERT INTO public.sensor (id_actuator,id_sensor,between,status_lifecycle) VALUES($1,$2,$3,$4) RETURNING *;`,
			[
				id_actuator,id_sensor,between,status_lifecycle,created_at
			]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Automation successfully created",
				data: {
					id_actuator:result.rows[0].id_actuator,
                    id_sensor:result.rows[0].id_sensor,
                    between:result.rows[0].between,
                    status_lifecycle:result.rows[0].status_lifecycle,
                    created_at:result.rows[0].created_at,
				},
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Actuator failed to create",
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
	uploadAutomation,
};
