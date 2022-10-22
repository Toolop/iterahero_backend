const pool = require("../config/db");
const { uploadImage } = require("../utils/cloudinary");
const {
	isGreenhouseExist,
	deletimageGreenhouse,
} = require("../utils/greenhouse-util");
const { getUser } = require("../utils/user-util");

const getGreenHouses = async (request, h) => {
	let { page, size } = request.query;
	let result = "";
	let response = "";
	const { id_user } = request.auth.credentials;
	// console.log(id_user);
	// console.log("ini paramnya", by_user_id);

	try {
		page = page || 1;
		size = size || 10;
		const offset = (page - 1) * size;

		result = await pool.query(
			`SELECT * FROM public."greenhouse" WHERE "id_user"=$1 ORDER BY created_at ASC OFFSET $2 LIMIT $3`,
			[id_user, offset, size]
		);


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

		if (result.rowCount > 0) {
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
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Greenhouse not found",
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

const uploadGreenHouse = async (request, h) => {
	const { name, location } = request.payload;
	const { id_user } = request.auth.credentials;

	let { image } = request.payload;

	let response = "";

	try {
		if (image){
			const uploadImagePayload = await uploadImage("greenhouse_images", image);
			let getCount = uploadImagePayload.url.length;
			let getUrl = uploadImagePayload.url.slice(4, getCount);
			let addText = "https";
			image = addText + getUrl;
		}

		const created_at = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Jakarta",
		});

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

const updateGreenhouse = async (request, h) => {
	const { id } = request.params;
	const { name, location } = request.payload;
	let { image } = request.payload;
	let result = "";
	let response = "";

	try {
		if (await isGreenhouseExist(id)) {
			const updated_at = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Jakarta",
			});

			if (image) {
				deletimageGreenhouse(id);
				const uploadImageResult = await uploadImage("greenhouse_images", image);
				let getCount = uploadImageResult.url.length;
				let getUrl = uploadImageResult.url.slice(4, getCount);
				let addText = "https";
				image = addText + getUrl;

				result = await pool.query(
					'UPDATE public."greenhouse" SET name=$1, image=$2, "location"=$3, updated_at=$4 WHERE id_greenhouse=$5',
					[name, image, location, updated_at, id]
				);
			} else {
				result = await pool.query(
					'UPDATE public."greenhouse" SET name=$1, "location"=$2, updated_at=$3 WHERE id_greenhouse =$4',
					[name, location, updated_at, id]
				);
			}

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Greenhouse has been edited successfully",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Greenhouse cannot be edited",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Greenhouse is not found",
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

const deleteGreenhouse = async (request, h) => {
	const { id } = request.params;
	let result = "";
	let response = "";

	try {
		if (await isGreenhouseExist(id)) {
			await deletimageGreenhouse(id);

			result = await pool.query(
				'DELETE FROM public."greenhouse" WHERE id_greenhouse=$1',
				[id]
			);

			if (result) {
				response = h.response({
					code: 200,
					status: "OK",
					message: "Greenhouse has been deleted",
				});

				response.code(200);
			} else {
				response = h.response({
					code: 500,
					status: "Internal Server Error",
					message: "Greenhouse cannot be deleted",
				});

				response.code(500);
			}
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Greenhouse is not found",
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
	getGreenHouses,
	getGreenHouseDetail,
	uploadGreenHouse,
	updateGreenhouse,
	deleteGreenhouse,
};
