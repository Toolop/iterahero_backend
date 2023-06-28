const sensor = require("../../../models/model-sensor");
const { getSensor } = require("../../../utils/sensor-utils");

const getSummary = async (request, h) => {
  let { getDateQuery } = request.query;
  let { id_sensor } = request.params;
  let result = "";

  try {
    const sensorValue = await getSensor(id_sensor);
    let condition = " ";
    let conditionType = 1;
    if (getDateQuery == "Day") {
      var start = new Date();
      start.setHours(0, 0, 0, 0);

      var end = new Date();
      end.setHours(23, 59, 59, 999);
      result = await sensor.aggregate([
        {
          $match: {
            $and: [
              { id_sensor: parseInt(id_sensor) },
              { createdAt: { $gte: start, $lt: end } },
              { status: "online" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$value" },
            max: { $max: "$value" },
            min: { $min: "$value" },
          },
        },
      ]);
    }
    if (getDateQuery == "Week") {
      var date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();

      result = await sensor.aggregate([
        {
          $match: {
            $and: [
              { id_sensor: parseInt(id_sensor) },
              {
                createdAt: {
                  $gte: new Date(year, month, 1),
                  $lt: new Date(year, month + 1, 0),
                },
              },
              { status: "online" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$value" },
            max: { $max: "$value" },
            min: { $min: "$value" },
          },
        },
      ]);
    } else if (getDateQuery == "Month") {
      var date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      result = await sensor.aggregate([
        {
          $match: {
            $and: [
              { id_sensor: parseInt(id_sensor) },
              {
                createdAt: {
                  $gte: new Date(year, month, 1),
                  $lt: new Date(year, month + 1, 0),
                },
              },
              { status: "online" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$value" },
            max: { $max: "$value" },
            min: { $min: "$value" },
          },
        },
      ]);
    } else if (getDateQuery == "Year") {
      var date = new Date();
      const year = date.getFullYear();
      result = await sensor.aggregate([
        {
          $match: {
            $and: [
              { id_sensor: parseInt(id_sensor) },
              {
                createdAt: {
                  $gte: new Date(year, 1, 1),
                  $lt: new Date(year, 12, 0),
                },
              },
              { status: "online" },
            ],
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$value" },
            max: { $max: "$value" },
            min: { $min: "$value" },
          },
        },
      ]);
    }
    if (Object.keys(result).length > 0) {
      response = h.response({
        code: 200,
        status: "OK",
        data: result[0],
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

module.exports = { getSummary };
