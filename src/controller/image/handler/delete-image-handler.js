const pool = require("../../../config/db");

const deleteImageML = async (request, h) => {
	const {email,kamera} = request.query;
	let result = "";
	let response = "";

	try {
		if (kamera) {
			result = await pool.query(
				'DELETE FROM public."ml_image" WHERE camera=$1',
				[kamera]
			);
		}else if(email){
			result = await pool.query(
				'DELETE FROM public."ml_image" WHERE email=$1',
				[email]
			);
		}
		else{
			result = await pool.query(
				'DELETE FROM public."ml_image"',
				[email]
			);
		}

		if (result) {
			response = h.response({
				code: 200,
				status: "OK",
				message: "Image Ml has been deleted",
			});

			response.code(200);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Image Ml cannot be deleted",
			});

			response.code(500);
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

module.exports = {deleteImageML};