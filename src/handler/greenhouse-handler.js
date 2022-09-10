const { image } = require("../config/cloudinary");
const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const { getUser } = require("../utils/user-util");

const getGreenHouses = async (request, h) => {
	let { page, size } = request.query;
	const { user_id } = request.query;
	let result = "";
	let response = "";
	const { id_user } = request.auth.credentials;

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		if (!user_id || user_id === "false") {
			result = await pool.query(
				`SELECT * FROM public."greenhouse" ORDER BY created_at DESC OFFSET $1 LIMIT $2`,
				[offset, size]
			);
		}

		if (user_id === "true") {
			result = await pool.query(
				`SELECT * FROM public."greenhouse" WHERE "id_user"=$1 ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
				[id_user, offset, size]
			);
		}

		// console.log(result.rows);
		response = h.response({
			code: 200,
			status: "OK berhasil",
			data: await Promise.all(
				result.rows.map(async (greenHouse) => ({
					id: greenHouse.id_greenhouse,
					name: greenHouse.name,
					image: greenHouse.image,
					location: greenHouse.location,
					created_at: greenHouse.created_at,
					updated_at: greenHouse.updated_at,
					user_id: greenHouse.id_user,
					user_name: (await getUser(greenHouse.id_user)).name,
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

// const uploadGreenHouse = async (request, h) => {

// };

module.exports = {
	getGreenHouses,
};
