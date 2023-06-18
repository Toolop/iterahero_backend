const pool = require("../../../config/db");

const getIcon= async (request, h) => {
    let {type} = request.query;
	let response = "";
	let result = "";

	try {
        if (type){
            result = await pool.query(
                'SELECT * FROM public."icon" WHERE type = $1 ORDER BY id_icon ASC',
                [type]
            );
        }else if(!type){
            result = await pool.query(
                'SELECT * FROM public."icon" ORDER BY id_icon ASC'
            );
        }
        
		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (icon) => ({
					name: icon.name,
					icon: icon.icon,
                    type:icon.type,
                    color: icon.color,
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

module.exports = {getIcon};