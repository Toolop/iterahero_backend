const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const { getUser } = require("../utils/user-util");

const getGreenHouses = async (request, h) => {
	let { page, size } = request.query;
	const { by_user_id } = request.query;
	let result = "";
	let response = "";
	const { id_user } = request.auth.credentials;
	// console.log(id_user);
	// console.log("ini paramnya", by_user_id);

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		if (!by_user_id || by_user_id == 0) {
			result = await pool.query(
				`SELECT * FROM public."greenhouse" ORDER BY created_at ASC OFFSET $1 LIMIT $2`,
				[offset, size]
			);
		}

		if (by_user_id == 1) {
			result = await pool.query(
				`SELECT * FROM public."greenhouse" WHERE "id_user"=$1 ORDER BY created_at ASC OFFSET $2 LIMIT $3`,
				[id_user, offset, size]
			);
		}

		// console.log(result.rows);
		response = h.response({
			code: 200,
			status: "OK",
			data: await Promise.all(
				result.rows.map(async (greenHouse) => ({
					id: greenHouse.id_greenhouse,
					name: greenHouse.name,
					image: greenHouse.image,
					location: greenHouse.location,
					created_at: greenHouse.created_at,
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

const getGreenHouseDetail = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		result = await pool.query(
			`SELECT * FROM public."greenhouse" WHERE id_greenhouse=$1`,
			[id]
		);

		response = h.response({
			code: 200,
			status: "OK",
			data: {
				id: result.rows[0].id_greenhouse,
				name: result.rows[0].name,
				image: result.rows[0].image,
				location: result.rows[0].location,
				created_at: result.rows[0].created_at,
				user_id: result.rows[0].id_user,
				user_name: (await getUser(result.rows[0].id_user)).name,
			},
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

const uploadGreenHouse = async (request, h) => {
	const { name, location } = request.payload;
	const { id_user } = request.auth.credentials;

	let { image } = request.payload;

	let response = "";

	try {
		const uploadImagePayload = await uploadImage("greenhouse_images", image);
		image = uploadImagePayload.url;

		const created_at = new Date().toISOString().slice(0, 10);

		const result = await pool.query(
			`INSERT INTO public."greenhouse" (name, image, location, created_at, id_user) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[name, image, location, created_at, id_user]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Greenhouse successfully created",
				data: {
					id: result.rows[0].id_greenhouse,
					name: result.rows[0].name,
					image: result.rows[0].image,
					location: result.rows[0].location,
					created_at: result.rows[0].created_at,
					user_id: result.rows[0].id_user,
					user_name: (await getUser(result.rows[0].id_user)).name,
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

module.exports = {
	getGreenHouses,
	getGreenHouseDetail,
	uploadGreenHouse,
};
