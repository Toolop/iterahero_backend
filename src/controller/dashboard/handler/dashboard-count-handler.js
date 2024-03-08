const pool = require("../../../config/db");
const { prisma } = require("../../../config/prisma");
const { getUser } = require("../../../utils/user-util");

const getCountDashboard = async (request, h) => {
  let response;
  let { getGreenhouseCount, getSensorCount, getActuatorCount, getTandonCount } = 0;
  const { id_user } = request.auth.credentials;

  try {
    const result = await prisma.user.findUnique({
      where: {
        id_user,
      },
      select: {
        _count: true,
        Greenhouse: {
          select: {
            _count: true
          }
        },
        tandon: {
          select: {
            _count: true
          }
        },
        name: true
      },
    })

    getGreenhouseCount = result._count.Greenhouse;
    getTandonCount = result._count.tandon;
    
    const sensorGh = result.Greenhouse.reduce((temp, a) => temp + a._count.Sensor, 0);
    const sensorTandon = result.tandon.reduce((temp, a) => temp + a._count.sensor, 0);
    getSensorCount = sensorGh + sensorTandon

    const actuatorGh = result.Greenhouse.reduce((temp, a) => temp + a._count.Actuator, 0);
    const actuatorTandon = result.tandon.reduce((temp, a) => temp + a._count.actuator, 0);
    getActuatorCount = actuatorGh + actuatorTandon;

    response = h.response({
      code: 200,
      status: "OK",
      data: {
        greenhouse: getGreenhouseCount,
        tandon: getTandonCount,
        sensor: getSensorCount,
        actuator: getActuatorCount,
        name: result.name
      }
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

module.exports = { getCountDashboard };
