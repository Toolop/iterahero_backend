const pool = require("../config/db");
const { getActuator } = require("../utils/actuator-util");
const { getGreenHouse } = require("../utils/greenhouse-util");
const { isNotificationExist } = require("../utils/notification-util");

const uploadNotification = async (request, h) => {
	const { detail, type, status, id_actuator } = request.payload;

	let response = "";

	try {
		const created_at = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Jakarta",
		});

		const actuator = await getActuator(id_actuator);
		const id_user = (await getGreenHouse(actuator.id_greenhouse)).id_user;

		const result = await pool.query(
			`INSERT INTO public."notification" (detail, created_at, type, status, id_actuator) VALUES($1,$2,$3,$4,$5) RETURNING *`,
			[detail, created_at, type, status, id_actuator]
		);

		const makeReceiver = await pool.query(
			`INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
			[id_user, result.rows[0].id_notification]
		);

		if (result && makeReceiver) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Notification successfully created",
				data: {
					id: result.rows[0].id_notification,
					detail: result.rows[0].detail,
					created_at: result.rows[0].created_at,
					type: result.rows[0].type,
					status: result.rows[0].status,
					id_actuator: result.rows[0].id_actuator,
					receive_status: "received",
				},
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Notification failed to create",
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

const getNotifications = async (request, h) => {
	let { page, size } = request.query;
	const { by_user_id } = request.query;
	let result = "";
	let response = "";
	const { id_user } = request.auth.credentials;
	let totalPage = 0;
	// console.log("ini paramnya", by_user_id);
	// console.log(id_user);

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		if (!by_user_id || by_user_id == 0) {
			result = await pool.query(
				`SELECT * FROM public."notification" ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
				[offset, size]
			);
			const totalRows = await pool.query('SELECT * FROM public."notification"');
			totalPage = Math.ceil(totalRows.rowCount / size);
		}

		if (by_user_id && by_user_id == 1) {
			result = await pool.query(
				`SELECT * FROM public."notification" WHERE id_notification IN (SELECT id_notification FROM public."receive" WHERE id_user = $1) ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
				[id_user, offset, size]
			);
			const totalRows = await pool.query('SELECT * FROM public."notification"');
			totalPage = Math.ceil(totalRows.rowCount / size);
		}

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (row) => ({
					id: row.id_notification,
					detail: row.detail,
					created_at: row.created_at,
					type: row.type,
					status: row.status,
					id_actuator: row.id_actuator,
					id_greenhouse: (await getActuator(row.id_actuator)).id_greenhouse,
					greenhouse_loc: (await getActuator(row.id_actuator)).greenhouse_loc,
				}))
			),
			totalPage: totalPage,
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

const deleteNotification = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		if (await isNotificationExist) {
			result = await pool.query(
				`DELETE FROM public."receive" WHERE id_notification = $1`,
				[id]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Notification successfully deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Notification failed to delete",
				});

				response.code(500);
			}
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

const getNotificationDetail = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."notification" WHERE id_notification = $1`,
			[id]
		);

		if (result.rowCount > 0) {
			response = h.response({
				code: 200,
				status: "OK",
				data: {
					id: result.rows[0].id_notification,
					detail: result.rows[0].detail,
					created_at: result.rows[0].created_at,
					type: result.rows[0].type,
					status: result.rows[0].status,
					id_actuator: result.rows[0].id_actuator,
				},
			});

			response.code(200);
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Notification not found",
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
	uploadNotification,
	getNotifications,
	deleteNotification,
	getNotificationDetail,
	getCountNotifications,
};
