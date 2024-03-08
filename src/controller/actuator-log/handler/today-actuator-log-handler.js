const { prisma } = require("../../../config/prisma");

const getActuatorLogsToday = async (request, h) => {
  const { id } = request.params;
  let result;
  let response;
  
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  try {
    result = await prisma.actuator_log.findMany({
      where: {
        id_actuator: parseInt(id),
        created_at: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    })
    if (result) {
      response = h.response({
        code: 200,
        status: "OK",
        data: {
          count_on: result.filter(item => item.on_off_status === 1),
          count_off: result.filter(item => item.on_off_status === 0),
        },
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

module.exports = {
  getActuatorLogsToday,
};
