const sensor = require('../models/model-sensor');


const uploadSensorBroker = async (request, h) => {
	let {name,value} = request.payload;

	let response = "";

	try {
		const created_at = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Jakarta",
		});
	
		let result = await sensor.create({
            name:name,
            value:value,
            created_at:created_at,
        })

		if (result) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "sensor broker added successfully created",
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

module.exports = {uploadSensorBroker};