const { uploadImage } = require("../utils/cloudinary");
const pool = require("../config/db");
const axios = require("axios");

const uploadImageServer = async (request, h) => {
	let {email,camera,line,id_sensor,id_greenhouse} = request.payload;
	let { image } = request.payload;
	let result = "";
	let response = "";
	let volume = 0;

	try {
		let imageBase64 = await new Buffer(image).toString('base64');
		const total = await  pool.query(`SELECT * FROM public."ml_image" WHERE camera = $1`,
		[camera]);
		
		await axios({
			method: "POST",
			url: "https://detect.roboflow.com/cnn-melon/3",
			params: {
				api_key: "scvUwcOaTuhifPhPoqVI"
			},
			data: imageBase64,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		})
		.then(function(response) {
			let condition = "";
			let num_con = 0;
			let get = response.data['predictions'];
			for (i in get){
				if(i == 0){
					if(get[i]['class'] ==  "daun kuning"){
						num_con = 3;
					}
					else if(get[i]['class'] == "bercak"){
						num_con = 2;
					}
					else if(get[i]['class'] == "daun sehat"){
						num_con = 1;
					}
				}else{
					if(get[i]['class'] == "daun kuning" && num_con <= 3){
						condition = "daun kuning"
						break;
					}
					else if(get[i]['class'] == "bercak" && num_con <= 2){
						num_con = 3;
						condition = "bercak"
					}
					else if(get[i]['class'] == "daun sehat" && num_con <= 1){
						num_con = 2;
						condition = "daun sehat"
					}
				}
			}
		
			let count = total.rowCount;
			if (count >= 14 && count <= 50){
				if(condition ==  "daun kuning"){
					volume = "800";
				}
				else if(condition == "bercak"){
					volume = "700";
				}
				else if(condition == "daun sehat"){
					volume = "600";
				}
			}
			else if(count >50){
				if(condition ==  "daun kuning"){
					volume = "1900";
				}
				else if(condition == "bercak"){
					volume = "1700";
				}
				else if(condition == "daun sehat"){
					volume = "1500";
				}
			}
			
		})
		.catch(function(error) {
			console.log(error.message);
		});

		const uploadImagePayload = await uploadImage("ml_images", image);
		let getCountURL = uploadImagePayload.url.length;
		let getUrl = uploadImagePayload.url.slice(4,getCountURL);
		let addText = "https";
		image = addText + getUrl;
		const sensor = await getSensor(getData[i].id_sensor);
		const id_user = await getGreenHouse(id_greenhouse);
		let type = condition;
		let status = 0;
		let detail = `line ${line} pada greenhouse ${sensor.greenhouse} kondisi ${condition}`;
	
		const created_at = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Jakarta",
		});

		const result = await pool.query(
			`INSERT INTO public."ml_image" (created_at, image,email,camera,line,id_actuator,id_greenhouse) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
			[created_at, image,email,camera,line,id_actuator,id_greenhouse]
		);
		await pool.query(
			'UPDATE public."sensor" SET range_max = $1 WHERE id_sensor = $2',
				[volume,
				id_sensor]
		);
		const getNotif = await pool.query(
			`INSERT INTO public."notification" (detail, created_at, type, status, id_sensor) VALUES($1,$2,$3,$4,$5) RETURNING *`,
			[detail, created_at, type, status, getData[i].id_sensor]
		);
		await pool.query(
			`INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
			[id_user.id_user, getNotif.rows[0].id_notification]
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
					id_greenhouse:result.rows[0].id_greenhouse,
					condition:condition,
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
			result = await pool.query(
				`SELECT * FROM public."ml_image" WHERE created_at::date = '%${date}%' ORDER BY created_at ASC`
			);
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