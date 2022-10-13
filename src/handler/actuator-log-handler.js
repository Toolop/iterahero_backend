const pool = require("../config/db");
const mqtt = require('mqtt')
const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`


const uploadActuatorLog = async (request, h) => {
	const { id_actuator, on_off_status } = request.payload;

	let response = "";
	let result = ""

	try {
		
		const client = mqtt.connect(connectUrl, {
			clientId,
			keepalive: 30,
			protocolId: 'MQTT',
			protocolVersion: 4,
			clean: true,
			connectTimeout: 30 * 1000,
			rejectUnauthorized: false,
			reconnectPeriod: 1000,
		});

		const topic = "iterahero/actuator";
		const pubTopic = `${topic}/${id_actuator}`;

		await client.on('connect', () => {
			console.log('Connected')
				var message =  on_off_status;
				client.publish(pubTopic, JSON.stringify(message) , { qos: 0, retain: false }, async (error) => {
					if (error) {
					console.error(error)
					}
					else{
						const created_at = new Date().toLocaleString("en-US", {
							timeZone: "Asia/Jakarta",
						});
						result = await pool.query(
							`INSERT INTO public."actuator_log" (id_actuator, on_off_status, created_at) VALUES($1,$2,$3) RETURNING *`,
							[id_actuator, on_off_status, created_at]
						);
						await pool.query(
							`UPDATE public."actuator" SET "status_lifecycle"=$1 WHERE id_actuator = $2`,
							[on_off_status, id_actuator]
						);
						client.end();
					}
				});
		});

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

const getActuatorLogs = async (request, h) => {
	let { page, size } = request.query;
	const { by_actuator_id } = request.query;
	let result = "";
	let response = "";

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		if (!by_actuator_id) {
			result = await pool.query(
				`SELECT * FROM public."actuator_log" ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
				[offset, size]
			);
		}

		if (by_actuator_id) {
			result = await pool.query(
				`SELECT * FROM public."actuator_log" WHERE id_actuator = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
				[by_actuator_id, offset, size]
			);
		}

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (actuator_log) => ({
					id: actuator_log.id_actuator_log,
					id_actuator: actuator_log.id_actuator,
					on_off_status: actuator_log.on_off_status,
					created_at: actuator_log.created_at,
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

const getActuatorLogDetail = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."actuator_log" WHERE id_actuator_log = $1`,
			[id]
		);

		if (result.rowCount > 0) {
			response = h.response({
				code: 200,
				status: "OK",
				message: "Actuator log successfully retrieved",
				data: {
					id: result.rows[0].id_actuator_log,
					id_actuator: result.rows[0].id_actuator,
					on_off_status: result.rows[0].on_off_status,
					created_at: result.rows[0].created_at,
				},
			});

			response.code(200);
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Actuator log not found",
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
	uploadActuatorLog,
	getActuatorLogDetail,
	getActuatorLogs,
};
