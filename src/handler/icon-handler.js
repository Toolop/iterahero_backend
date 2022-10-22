const pool = require("../config/db");

const uploadIcon = async (request, h) => {
	let {name,icon} = request.payload;

	let response = "";

	try {
		const result = await pool.query(
			`INSERT INTO public."icon" (name,icon) VALUES ($1,$2) RETURNING *`,
			[name,icon]
		);


		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "icon successfully created",
				data: {
					name: result.rows[0].name,
					icon: result.rows[0].icon,
				}
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Icon failed to create",
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


const getIcon= async (request, h) => {
	let response = "";
	let result = "";

	try {
		
        result = await pool.query(
			'SELECT * FROM public."icon" ORDER BY id_icon ASC',
			[email]
		);
		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (icon) => ({
					name: icon.name,
					icon: icon.icon,
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

module.exports = {uploadIcon,getIcon};