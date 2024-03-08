const { prisma } = require("../../../config/prisma");

const getSensorByGreenHouse = async (request, h) => {
  const { by_id_greenhouse } = request.query;
  let { page, size } = request.query;
  let response = "";
  let result = "";
  let totalPage = 0;

  try {
    page = page || 1;
    size = size || 10;

    if (!by_id_greenhouse) {
      result = await prisma.sensor.findMany({
        take: size,
        skip: (page - 1) * size,
      })
      const total = result.length;
      totalPage = Math.ceil(total / size);
    } else if (by_id_greenhouse) {
      result = await prisma.greenhouse.findUnique({
        where: {
          id_greenhouse: parseInt(by_id_greenhouse)
        },
        select: {
          Sensor: {
            take: size,
            skip: (page - 1) * size,
          },
          _count: {
            select: {
              Sensor: true
            }
          }
        }
      })
      totalPage = Math.ceil(result._count.Sensor / size);
    }

    response = h.response({
      code: 200,
      status: "OK",
      data: result.Sensor,
      totalPage: totalPage,
    }).code(200);
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    }).code(400);

    console.log(err);
  }

  return response;
};

module.exports = {
  getSensorByGreenHouse,
};
