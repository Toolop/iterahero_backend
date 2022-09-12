const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const uploadActuator = async (request, h) => {
	const { name, status_lifecycle, color, id_greenhouse } = request.payload;

	let { icon } = request.payload;

	let response = "";

	try {
		const uploadIconPayload = await uploadImage("icon_files", icon);
		icon = uploadIconPayload.url;

		const created_at = new Date().toISOString().slice(0, 10);

		const result = await pool.query(
			`INSERT INTO public."actuator" (name, status_lifecycle, color, icon, created_at, id_greenhouse) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
			[name, status_lifecycle, color, icon, created_at, id_greenhouse]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Actuator successfully created",
				data: {
					id: result.rows[0].id_actuator,
					name: result.rows[0].name,
					status_lifecycle: result.rows[0].status_lifecycle,
					color: result.rows[0].color,
					icon: result.rows[0].icon,
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

const getActuators = async (request, h) => {
	let { page, size } = request.query;
	const { by_greenhouse_id } = request.query;
	let result = "";
	let response = "";

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		if (!by_greenhouse_id) {
			result = await pool.query(
				`SELECT * FROM public."actuator" ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
				[offset, size]
			);
		}

		if (by_greenhouse_id) {
			result = await pool.query(
				`SELECT * FROM public."actuator" WHERE id_greenhouse = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
				[by_greenhouse_id, offset, size]
			);
		}

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (actuator) => ({
					id: actuator.id_actuator,
					name: actuator.name,
					status_lifecycle: actuator.status_lifecycle,
					color: actuator.color,
					icon: actuator.icon,
					created_at: actuator.created_at,
					updated_at: actuator.updated_at,
					id_greenhouse: actuator.id_greenhouse,
				}))
			),
		});
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

const getActuatorDetail = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."actuator" WHERE id_actuator = $1`,
			[id]
		);

		if (result.rowCount > 0) {
			response = h.response({
				code: 200,
				status: "OK",
				data: {
					id: result.rows[0].id_actuator,
					name: result.rows[0].name,
					status_lifecycle: result.rows[0].status_lifecycle,
					color: result.rows[0].color,
					icon: result.rows[0].icon,
					created_at: result.rows[0].created_at,
					updated_at: result.rows[0].updated_at,
					id_greenhouse: result.rows[0].id_greenhouse,
				},
			});

			response.code(200);
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Actuator not found",
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
	uploadActuator,
	getActuators,
	getActuatorDetail,
};