const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const uploadSensor = async (request, h) => {
	const { name,unit_measurement, brand,color, id_greenhouse,range_min,range_max,id_category_sensor} = request.payload;

	let { icon } = request.payload;

	let response = "";

	try {
		const uploadIconPayload = await uploadImage("icon_sensor", icon);
		icon = uploadIconPayload.url;

		const created_at = new Date().toISOString().slice(0, 10);

		const result = await pool.query(
			`SELECT id_sensor, "name", unit_measurement, brand, created_at, updated_at, icon, color, id_greenhouse, range_min, range_max, id_category_sensor FROM public.sensor RETURNING *;`,
			[name,unit_measurement, brand, created_at,created_at,icon,color, id_greenhouse,range_min,range_max,id_category_sensor]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Sensor successfully created",
				data: {
					id: result.rows[0].id_sensor,
					name: result.rows[0].name,
					brand: result.rows[0].brand, 
                    icon: result.rows[0].icon,
                    color: result.rows[0].color, 
                    range_min: result.rows[0].range_min,
                    range_max: result.rows[0].range_max,
                    id_category_sensor: result.rows[0].id_category_sensor,
					created_at: result.rows[0].created_at,
					id_greenhouse: result.rows[0].id_greenhouse,
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
	uploadSensor,
};
