const { Query } = require('mongoose');
const sensor = require('../models/model-sensor');



const uploadSensorBroker = async (request, h) => {
	let {value,sensorId} = request.payload;
	let response = "";	

	try {

		let result = await sensor.create({
            value:value,
			id_sensor:sensorId,
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

const getSensorBroker = async (request, h) => {
	const {id_sensor} = request.query;
	let response = "";

	try {
		const result = await sensor.find({id_sensor:id_sensor}).sort( { createdAt:-1 } ).limit(1);

		if (result) {
			response = h.response({
				code: 200,
				status: "Ok",
				data: result,
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

module.exports = {uploadSensorBroker,getSensorBroker};