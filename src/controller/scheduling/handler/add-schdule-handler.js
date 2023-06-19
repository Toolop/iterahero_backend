const { uploadImage } = require("../../../utils/cloudinary");
const { getLocalISOString } = require("../../../utils/timestamp-utils");
const pool = require("../../../config/db");
const axios = require("axios");

const addSchedule = async (request, h) => {
	let {start,end,interval,repeat,duration,id_actuator} = request.payload;
	let result = "";
	let response = "";
    const listOn = [];

	try {
        let intervalMenit = parseInt(interval) % 60;
        let intervalJam = parseInt(interval) / 60;
        let temp =  parseInt(start);
        let offDuration = parseInt(duration) + intervalMenit;
        for(let i = 0;i < repeat;i++){
            listOn.push(temp);
            temp += intervalJam

        }
        const created_at = getLocalISOString();


		if (true) {
			response = h.response({
				code: 201,
				status: "Created",
				message: "Greenhouse successfully created",
				data: {
					created_at: created_at,
					dayOfWeek: [0,1,2,3,4,5,6,7],
					minute:offDuration,
                    minuteNyala: intervalMenit,
					hour:listOn,
					id_actuator:id_actuator
				}
			});

			response.code(201);
		} else {
			response = h.response({
				code: 500,
				status: "Internal Server Error",
				message: "Schedul failed to create",
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


module.exports = {addSchedule};