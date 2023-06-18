const pool = require("../../../config/db");

const getActuatorLogs = async (request, h) => {
	let { page, size } = request.query;
	const { by_actuator_id } = request.query;
	let result = "";
	let response = "";
	let totalPage = 0;
	let totalData = 0;

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		if (!by_actuator_id) {
			result = await pool.query(
				`SELECT * FROM public."actuator_log" ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
				[offset, size]
			);
			const totalRows = await pool.query('SELECT * FROM public."actuator_log"');
			totalPage = Math.ceil(totalRows.rowCount / size);
			totalData = totalRows.rowCount;
		}

		if (by_actuator_id) {
			result = await pool.query(
				`SELECT * FROM public."actuator_log" WHERE id_actuator = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
				[by_actuator_id, offset, size]
			);
			const totalRows = await pool.query('SELECT * FROM public."actuator_log" WHERE id_actuator = $1',[by_actuator_id]);
			totalPage = Math.ceil(totalRows.rowCount / size);
			totalData = totalRows.rowCount;
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
			totalPage:totalPage,
			totalData:totalData
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


module.exports = {
	getActuatorLogs
    };
