const pool = require("../config/db");
const { getSensor } = require('../utils/sensor-utils');
const { getGreenHouse } = require("../utils/greenhouse-util");
const { getAutomation,isAutomationExist} = require('../utils/automation-utils');
const {getLocalISOString}  = require("../utils/timestamp-utils");


const uploadAutomation = async (request, h) => {
	const {
		id_actuator,
		id_sensor,
		between,
		status_lifecycle,
		constanta
	} = request.payload;

	let response = "";

	try {
		const created_at = getLocalISOString();

		const result = await pool.query(
			`INSERT INTO public.automation (id_actuator,id_sensor,between,status_lifecycle,created_at,constanta) VALUES($1,$2,$3,$4,$5,$6) RETURNING *;`,
			[
				id_actuator,id_sensor,between,status_lifecycle,created_at,constanta
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
					constanta:result.rows[0].constanta
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
	}

	return response;
};

const getAllAutomation = async(request,h) => {
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."automation" ORDER BY (id_automation)`,
		);

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (automation) => ({
					sensor: automation.id_sensor,
					actuator:automation.id_actuator,
					between: automation.between,
					status_lifecycle: automation.status_lifecycle,
					created_at: automation.created_at,
					constanta: automation.constanta,
					id_automation: automation.id_automation,
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
}

const updateAutomation = async (request, h) => {
	const { id } = request.params;

	const {
		id_actuator,
		id_sensor,
		between,
		status_lifecycle,
		constanta
	} = request.payload;

	let result = "";
	let response = "";

	try {
		if (await isAutomationExist(id)) {
			result = await pool.query(
				'UPDATE public."automation" SET id_actuator=$1,id_sensor=$2,between=$3,status_lifecycle=$4,constanta=$5 WHERE id_automation = $6',
				[
					id_actuator,
					id_sensor,
					between,
					status_lifecycle,
					constanta,
					id,
				]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Automation has been edited successfully",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Automation cannot be edited",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Automation is not found",
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


const deleteAutomation = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		if (await isAutomationExist(id)) {
			result = await pool.query(
				'DELETE FROM public."automation" WHERE id_automation=$1',
				[id]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Automation has been deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Automation cannot be deleted",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Automation is not found",
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
	uploadAutomation,getAllAutomation,updateAutomation,deleteAutomation
};
