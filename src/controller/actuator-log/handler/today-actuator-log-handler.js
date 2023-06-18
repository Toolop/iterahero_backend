const pool = require("../../../config/db");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const getActuatorLogsToday = async (request, h) => {
	const { id } = request.params;
	let result_on = "";
    let result_off = "";
	let response = "";

	try {
        const now = getLocalISOString();
        result_on = await pool.query(
            `SELECT on_off_status FROM public."actuator_log" WHERE id_actuator=$1 AND on_off_status = '1' AND date(created_at) = date($2) `,
            [id,now]
        );
        result_off = await pool.query(
            `SELECT on_off_status FROM public."actuator_log" WHERE id_actuator=$1 AND on_off_status = '0' AND date(created_at) = date($2) `,
            [id,now]
        );
        if(result_on && result_off){
            response = h.response({
                code: 200,
                status: "OK",
                data: {
                    count_on : result_on.rowCount,
                    count_off : result_off.rowCount,
                },
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
	getActuatorLogsToday
};
