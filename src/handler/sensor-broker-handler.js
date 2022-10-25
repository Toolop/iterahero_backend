const { Query } = require('mongoose');
const sensor = require('../models/model-sensor');
const { getSensor } = require('../utils/sensor-utils');


const uploadSensorBroker = async (request, h) => {
	let {value,sensorId} = request.payload;

	let type = "sensor";
	let status = 0;
	let response = "";	

	try {

		let result = await sensor.create({
            value:value,
			id_sensor:sensorId,
        })

		const sensor = await getSensor(sensorId);
		const id_user = (await getGreenHouse(sensor.id_greenhouse)).id_user;

		let detail = `Sensor ${sensor.name} pada greenhouse ${sensor.greenhouse} terjadi masalah`;
		const created_at = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Jakarta",
		});
		 
		if(value < sensor.range_min  && value > sensor.range_max){
			if(sensor.notify == 0){
				const getNotif = await pool.query(
					`INSERT INTO public."notification" (detail, created_at, type, status, id_actuator) VALUES($1,$2,$3,$4,$5) RETURNING *`,
					[detail, created_at, type, status, id_actuator]
				);
		
				await pool.query(
					`INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
					[id_user, getNotif.rows[0].id_notification]
				);
				await pool.query(
					'UPDATE public."sensor" SET "notify"=1, WHERE id_sensor = $1',
					[sensorId]
				);
			}
		}else{
			if(sensor.notify == 1){
				await pool.query(
					'UPDATE public."sensor" SET "notify"=0, WHERE id_sensor = $1',
					[sensorId]
				);
			}
		}

		

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