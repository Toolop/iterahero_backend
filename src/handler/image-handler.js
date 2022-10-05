const { uploadImage } = require("../utils/cloudinary");
const pool = require("../config/db");

const uploadImageServer = async (request, h) => {
	let {email,camera,line} = request.payload;
	let { image } = request.payload;

	let response = "";

	try {
		const uploadImagePayload = await uploadImage("ml_images", image);
		image = uploadImagePayload.url;
	
		const created_at = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Jakarta",
		});
	
		const result = await pool.query(
			`INSERT INTO public."ml_image" (created_at, image,email,camera,line) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
			[created_at, image,email,camera,line]
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
				},
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

module.exports = {uploadImageServer};