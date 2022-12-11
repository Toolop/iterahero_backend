const pool = require("../config/db");
const { getNameSensorByID } = require("../utils/sensor-utils");

const uploadSensorLog = async (request, h) => {
	const { id_sensor, value, status } = request.payload;

	let response = "";

	try {
		const created_at = getLocalISOString();
		const result = await pool.query(
			`INSERT INTO public."sensor_log" (value, created_at,status,id_sensor) VALUES($1,$2,$3,$4) RETURNING *`,
			[value, created_at, status, id_sensor]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Sensor log successfully created",
				data: {
					id: result.rows[0].id_sensor_log,
					sensor: result.rows[0].id_sensor,
					value: result.rows[0].value,
					created_at: result.rows[0].created_at,
					status: result.rows[0].status,
				},
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Sensor log failed to create",
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

const getSensorLogBySensor = async (request, h) => {
	const { id_sensor } = request.query;
	let { page, size } = request.query;
	let response = "";
	let result = "";

	try {
		page = page || 1;
		size = size || 10;
		if (!id_sensor) {
			result = await pool.query(
				'SELECT * FROM public."sensor_log" ORDER BY created_at ASC OFFSET $1 LIMIT $2',
				[(page - 1) * size, size]
			);
		} else if (id_sensor) {
			result = await pool.query(
				'SELECT * FROM public."sensor_log" WHERE id_sensor = $1 ORDER BY created_at ASC OFFSET $2 LIMIT $3',
				[id_sensor, (page - 1) * size, size]
			);
		}

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (sensor) => ({
					id: sensor.id_sensor_log,
					sensor: sensor.id_sensor,
					value: sensor.value,
					created_at: sensor.created_at,
					status: sensor.status,
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

const getSensorLogDetail = async (request, h) => {
	const { id } = request.params;
	let response = "";
	let result = "";
	try {
		result = await pool.query(
			'SELECT * FROM public."sensor_log" WHERE id_sensor_log = $1 LIMIT 1',
			[id]
		);

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (sensor) => ({
					id: sensor.id_sensor_log,
					sensor: sensor.id_sensor,
					value: sensor.value,
					created_at: sensor.created_at,
					status: sensor.status,
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

module.exports = {
	uploadSensorLog,
	getSensorLogBySensor,
	getSensorLogDetail,
};

