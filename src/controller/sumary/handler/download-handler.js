const sensor = require("../../../models/model-sensor");

const downloadSummary = async (request, h) => {
  let { getDateQuery } = request.query;
  let { id_sensor } = request.params;
  let result = "";

  try {
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
      ]);
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

module.exports = { downloadSummary };
