const pool = require("../config/db");

const uploadCategorySensor = async (request, h) => {
	const { name } = request.payload;

	let response = "";

	try {
		const result = await pool.query(
			`INSERT INTO public.category_sensor (name) VALUES($1) RETURNING *;`,
			[name]
		);
		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Sensor successfully created",
				data: {
					id: result.rows[0].id_category_sensor,
					name: result.rows[0].name,
				},
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Sensor failed to create",
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

const getCategorySensor = async (request, h) => {
	let result = "";
	let response = "";

	try {
		result = await pool.query(`SELECT * FROM public."category_sensor"`);

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (sensor) => ({
					id: sensor.id_category_sensor,
					name: sensor.name,
				}))
			),
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

module.exports = { uploadCategorySensor, getCategorySensor };
