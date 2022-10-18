const { uploadImage } = require("../utils/cloudinary");
const pool = require("../config/db");

const uploadImageServer = async (request, h) => {
	let {email,camera,line,id_actuator} = request.payload;
	let { image } = request.payload;

	let response = "";

	try {
		const uploadImagePayload = await uploadImage("ml_images", image);
		image = uploadImagePayload.url;
	
		const created_at = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Jakarta",
		});
	
		const result = await pool.query(
			`INSERT INTO public."ml_image" (created_at, image,email,camera,line,id_actuator) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
			[created_at, image,email,camera,line,id_actuator]
		);


		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Greenhouse successfully created",
				data: {
					created_at: result.rows[0].created_at,
					image: result.rows[0].image,
					email:result.rows[0].email,
					camera:result.rows[0].camera,
					line:result.rows[0].line,
					id_actuator:result.rows[0].id_actuator,
				}
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Greenhouse failed to create",
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


const getImageServer= async (request, h) => {
	const { email, date} = request.query;
	let response = "";
	let result = "";

	try {

		if (email) {
			result = await pool.query(
				'SELECT * FROM public."ml_image" WHERE email = $1 ORDER BY created_at ASC',
				[email]
			);
		}else if (date){
			`SELECT * FROM public."ml_image" WHERE created_at ILIKE '%${date}%' ORDER BY created_at ASC`
		}

		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (image) => ({
					created_at: image.created_at,
					email:image.email,
					image:image.image,
					camera:image.camera,
					line:image.line,
					id_actuator:image.id_actuator,
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

module.exports = {uploadImageServer,getImageServer};