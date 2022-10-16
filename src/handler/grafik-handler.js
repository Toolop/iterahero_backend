const sensor = require('../models/model-sensor');

const getGrafik = async (request, h) => {
	let {getDateQuery,page,size} = request.query;
	let { id_sensor } = request.params;
  let result = "";
  const monthStrings = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	try {
      if (page && size){
        if(getDateQuery == "Week"){
          result = await sensor.aggregate([
              { $match : { id_sensor : parseInt(id_sensor) } },
              {
                $group: {
                  _id: {
                      year : { $year : "$createdAt" }, 
                      month : { $month : "$createdAt" },        
                      day : { $dayOfMonth : "$createdAt" },       
                  },
                  data: {$avg : '$value'},
                },
              },
              {
                  $project: {
                    label: '$_id.day',
                    date: {$concat: [ {$toString:"$_id.day"}, "/",{$toString: "$_id.month"},"/",{$toString:"$_id.year"} ] },
                    data : "$data",
                  }
              },
              {
                $sort:{"date": -1}
              },
              {
                $skip:  parseInt((page - 1) * size),
              },
              {
                $limit: parseInt(size),
              },

          ]);
      }
      else if(getDateQuery == "Month"){
          result = await sensor.aggregate([
              { $match : { id_sensor : parseInt(id_sensor) } },
              {
                $group: {
                  _id: {
                      year : { $year : "$createdAt" },    
                      month : { $month : "$createdAt" },        
                  },
                  data: {$avg : '$value'}
                },
              },
              {
                  $project: {
                    label: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            monthStrings,
                            "$_id.month"
                          ]
                        },
                      ]
                    },
                    date: {$concat: [{$toString: "$_id.month"},"/",{$toString:"$_id.year"} ] },
                    data : "$data",
                    count: 1,
                  }
              },
              {
                $sort:{"date": -1}
              },
              {
                $skip:  parseInt((page - 1) * size),
              },
              {
                $limit: parseInt(size),
              },
          ])
      }else if(getDateQuery == "Year"){
          result = await sensor.aggregate([
              { $match : { id_sensor : parseInt(id_sensor) } },
              {
                $group: {
                  _id: {
                      year : { $year : "$createdAt" },        
                  },
                  average: {$avg : '$value'}
                },
              },
              {
                  $project: {
                  date: {$concat: [{$toString:"$_id.year"} ] },
                    label: '$_id.year',
                    data : "$data",
                    count: 1,
                  }
              },
              {
                $sort:{"date":-1}
              },
              {
                $skip:  parseInt((page - 1) * size),
              },
              {
                $limit: parseInt(size),
              },
          ]);
      }
      }
      else{
          if(getDateQuery == "Week"){
            result = await sensor.aggregate([
                { $match : { id_sensor : parseInt(id_sensor) } },
                {
                  $group: {
                    _id: {
                        year : { $year : "$createdAt" }, 
                        month : { $month : "$createdAt" },        
                        day : { $dayOfMonth : "$createdAt" },       
                    },
                    data: {$avg : '$value'},
                  },
                },
                {
                    $project: {
                      label: '$_id.day',
                      date: {$concat: [ {$toString:"$_id.day"}, "/",{$toString: "$_id.month"},"/",{$toString:"$_id.year"} ] },
                      data : "$data",
                    }
                },
                {
                    $sort: { "date": -1 }
                },
                {
                    $limit: 7,
                },
                {
                    $sort:{"date":1}
                }
            ]);
        }
        else if(getDateQuery == "Month"){
            result = await sensor.aggregate([
                { $match : { id_sensor : parseInt(id_sensor) } },
                {
                  $group: {
                    _id: {
                        year : { $year : "$createdAt" },    
                        month : { $month : "$createdAt" },        
                    },
                    data: {$avg : '$value'}
                  },
                },
                {
                    $project: {
                      label: {
                        $concat: [
                          {
                            $arrayElemAt: [
                              monthStrings,
                              "$_id.month"
                            ]
                          },
                        ]
                      },
                      date: {$concat: [{$toString: "$_id.month"},"/",{$toString:"$_id.year"} ] },
                      data : "$data",
                      count: 1,
                    }
                },
                {
                    $sort: { "date": -1 }
                },
                {
                    $limit: 12,
                },
                {
                    $sort:{"date":1}
                }
            ])
        }else if(getDateQuery == "Year"){
            result = await sensor.aggregate([
                { $match : { id_sensor : parseInt(id_sensor) } },
                {
                  $group: {
                    _id: {
                        year : { $year : "$createdAt" },        
                    },
                    average: {$avg : '$value'}
                  },
                },
                {
                    $project: {
                    date: {$concat: [{$toString:"$_id.year"} ] },
                      label: '$_id.year',
                      data : "$data",
                      count: 1,
                    }
                },
                {
                    $sort: { "date": 1 }
                },
            ]);
        }
      }
        
      if (Object.keys(result).length > 0) {
			response = h.response({
				code: 200,
				status: "OK",
				data: result,
			});

			response.code(200);
		} else {
			response = h.response({
				code: 404,
				status: "Not Found",
				message: "Sensor not found",
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

module.exports = { getGrafik };
