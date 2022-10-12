const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const { getSensorCategory } = require("../utils/category-utils");
const { isSensorExist } = require("../utils/sensor-utils");
const { getGreenHouseName } = require("../utils/greenhouse-util");

const uploadSensor = async (request, h) => {
	const {
		name,
		unit_measurement,
		brand,
		color,
		icon,
		id_greenhouse,
		range_min,
		range_max,
		id_category_sensor,
	} = request.payload;

	let response = "";

	try {
		const created_at = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Jakarta",
		});

		const result = await pool.query(
			`INSERT INTO public.sensor ("name", unit_measurement, brand, created_at, updated_at, icon, color, id_greenhouse, range_min, range_max, id_category_sensor) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;`,
			[
				name,
				unit_measurement,
				brand,
				created_at,
				created_at,
				icon,
				color,
				id_greenhouse,
				range_min,
				range_max,
				id_category_sensor,
			]
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
					unit_measurement: result.rows[0].unit_measurement,
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

const getSensorByGreenHouse = async (request, h) => {
	const { by_id_greenhouse } = request.query;
	let { page, size } = request.query;
	let response = "";
	let result = "";

	try {
		page = page || 1;
		size = size || 10;

		const totalRows = await pool.query('SELECT * FROM public."sensor"');

		totalPage = Math.ceil(totalRows.rowCount / size);

		if (!by_id_greenhouse) {
			result = await pool.query(
				'SELECT * FROM public."sensor" ORDER BY created_at ASC OFFSET $1 LIMIT $2',
				[(page - 1) * size, size]
			);
		} else if (by_id_greenhouse) {
			result = await pool.query(
				'SELECT * FROM public."sensor" WHERE id_greenhouse = $1 ORDER BY created_at ASC OFFSET $2 LIMIT $3',
				[by_id_greenhouse, (page - 1) * size, size]
			);
		}

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (sensor) => ({
					id: sensor.id_sensor,
					name: sensor.name,
					unit_measurement: sensor.unit_measurement,
					brand: sensor.brand,
					icon: sensor.icon,
					color: sensor.color,
					range_min: sensor.range_min,
					range_max: sensor.range_max,
					category: await getSensorCategory(sensor.id_category_sensor),
					greenhouse: await getGreenHouseName(sensor.id_greenhouse),
					created_at: sensor.created_at,
					id_greenhouse: sensor.id_greenhouse,
				}))
			),
			totalpage: totalPage,
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

const getSensorById = async (request, h) => {
	const { id } = request.params;
	let response = "";
	let result = "";

	try {
		result = await pool.query(
			'SELECT * FROM public."sensor" WHERE id_sensor = $1 LIMIT 1',
			[id]
		);

		if (result.rows[0]) {
			response = h.response({
				code: 200,
				status: "OK",
				data: await Promise.all(
					result.rows.map(async (sensor) => ({
						id: sensor.id_sensor,
						name: sensor.name,
						unit_measurement:sensor.unit_measurement,
						brand: sensor.brand,
						icon: sensor.icon,
						color: sensor.color,
						range_min: sensor.range_min,
						range_max: sensor.range_max,
						category: await getSensorCategory(sensor.id_category_sensor),
						created_at: sensor.created_at,
						id_greenhouse: sensor.id_greenhouse,
						greenhouse: await getGreenHouseName(sensor.id_greenhouse),
					}))
				),
			});
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Sensor not found",
			});

			response.code(404);
		}

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

const updateSensor = async (request, h) => {
	const { id } = request.params;
	const {
		name,
		unit_measurement,
		brand,
		color,
		icon,
		range_min,
		range_max,
		id_category_sensor,
	} = request.payload;
	let result = "";
	let response = "";

	try {
		if (await isSensorExist(id)) {
			const updated_at = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Jakarta",
			});

			result = await pool.query(
				'UPDATE public."sensor" SET "name"=$1, unit_measurement=$2, brand=$3, updated_at=$4, icon=$5, color=$6, range_min = $7,range_max = $8,id_category_sensor = $9, WHERE id_sensor = $10',
				[
					name,
					unit_measurement,
					brand,
					updated_at,
					icon,
					color,
					range_min,
					range_max,
					id_category_sensor,
					id,
					
				]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Sensor has been edited successfully",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Sensor cannot be edited",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Sensor is not found",
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

const deleteSensor = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		if (await isSensorExist(id)) {
			result = await pool.query(
				'DELETE FROM public."sensor" WHERE id_sensor=$1',
				[id]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Sensor has been deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Sensor cannot be deleted",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Sensor is not found",
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
	uploadSensor,
	getSensorByGreenHouse,
	getSensorById,
	updateSensor,
	deleteSensor,
};
