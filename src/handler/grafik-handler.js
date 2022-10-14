const pool = require("../config/db");

const getGrafik = async (request, h) => {
	let {getDateQuery} = request.query;
	let { id_sensor } = request.params;
    const result = "";

	try {
        if(getDateQuery == "Week"){
            await sensor.aggregate([
                {
                  $group: {
                    _id: {
                        id_sensor: '$id_sensor',
                        year : { $year : "$createdAt" }, 
                        month : { $month : "$createdAt" },        
                        day : { $dayOfMonth : "$creteadAt" },       
                    },
                    average: {$avg : '$value'}
                  },
                },
                {
                    $match: { 
                        "id_sensor": id_sensor 
                    } 
                }
            ]).exec((err, sensor) => {
                if (err) throw err;
                console.log(sensor);
            });
        }
        else if(getDateQuery == "Month"){
            await sensor.aggregate([
                {
                  $group: {
                    _id: {
                        id_sensor: '$id_sensor',
                        year : { $year : "$createdAt" },    
                        month : { $month : "$createdAt" },        
                        day : { $dayOfMonth : "$creteadAt" },    
                    },
                    average: {$avg : '$value'}
                  },
                },
                {
                    $match: { 
                        "id_sensor": id_sensor 
                    } 
                }
            ]).exec((err, sensor) => {
                if (err) throw err;
                console.log(sensor);
            });
        }else if(getDateQuery == "Year"){
            await sensor.aggregate([
                {
                  $group: {
                    _id: {
                        id_sensor: '$id_sensor',
                        year : { $year : "$createdAt" },        
                    },
                    average: {$avg : '$value'}
                  },
                },
                {
                    $match: { 
                        "id_sensor": id_sensor 
                    } 
                }
            ]).exec((err, sensor) => {
                if (err) throw err;
                console.log(sensor);
            });
        }

		response = h.response({
			code: 200,
			status: "OK",
			data: {
				greenhouse: getGreenhouseCount.rows[0].count,
				sensor: getSensorCount.rows[0].count,
				actuator: getActuatorCount.rows[0].count,
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

module.exports = { getGrafik };
