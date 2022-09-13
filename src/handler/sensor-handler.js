const pool = require("../config/db");
const { uploadImage, deleteImage } = require("../utils/cloudinary");
const {getSensorCategory} = require("../utils/category-utils");

const uploadSensor = async (request, h) => {
	const { name,unit_measurement, brand,color, id_greenhouse,range_min,range_max,id_category_sensor} = request.payload;

	let { icon } = request.payload;

	let response = "";

	try {
		const uploadIconPayload = await uploadImage("icon_sensor", icon);
		icon = uploadIconPayload.url;

		const created_at = new Date().toISOString().slice(0, 10);

		const result = await pool.query(
			`INSERT INTO public.sensor ("name", unit_measurement, brand, created_at, updated_at, icon, color, id_greenhouse, range_min, range_max, id_category_sensor) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;`,
			[name,unit_measurement, brand, created_at,created_at,icon,color, id_greenhouse,range_min,range_max,id_category_sensor]
		);

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Sensor successfully created",
				data: {
					id: result.rows[0].id_sensor,
					name: result.rows[0].name,
					brand: result.rows[0].brand, 
                    icon: result.rows[0].icon,
                    color: result.rows[0].color, 
                    range_min: result.rows[0].range_min,
                    range_max: result.rows[0].range_max,
                    id_category_sensor: result.rows[0].id_category_sensor,
					created_at: result.rows[0].created_at,
					id_greenhouse: result.rows[0].id_greenhouse,
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

		console.log(err);
	}

	return response;
};

const getSensorByGreenHouse = async (request, h) => {
	const { by_id_greenhouse } = request.query;
	let { page, size } = request.query;
	let response = '';
	let result = '';
  
	try {
	  	page = page || 1;
	  	size = size || 10;
		if(!by_id_greenhouse) {
			result = await pool.query(
				'SELECT * FROM public."sensor" ORDER BY created_at ASC OFFSET $1 LIMIT $2',
				[(page - 1) * size, size],
			);
		}
		else if(by_id_greenhouse){
			result = await pool.query(
				'SELECT * FROM public."sensor" WHERE id_greenhouse = $1 ORDER BY created_at ASC OFFSET $2 LIMIT $3',
				[by_id_greenhouse,(page - 1) * size, size],
			);
		}
	   
	  	response = h.response({
			code: 200,
			status: 'OK',
			data: await Promise.all(result.rows.map(async (sensor) => ({
				id: sensor.id_sensor,
				name: sensor.name,
				brand: sensor.brand, 
                icon: sensor.icon,
                color: sensor.color, 
                range_min: sensor.range_min,
                range_max: sensor.range_max,
                category: await getSensorCategory(sensor.id_category_sensor),
				created_at: sensor.created_at,
				id_greenhouse: sensor.id_greenhouse,
			}))),
	  	});
  
	  response.code(200);
	} catch (err) {
	  	response = h.response({
			code: 400,
			status: 'Bad Request',
			message: 'error',
	  	});
  
	  response.code(400);
  
	  console.log(err);
	}
  
	return response;
  };




module.exports = {
	uploadSensor,getSensorByGreenHouse
};
