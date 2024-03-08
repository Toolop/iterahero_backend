const client = require("../../../config/mqtt");
const { prisma } = require("../../../config/prisma");

const uploadActuatorLog = async (request, h) => {
  const { id_actuator, on_off_status } = request.payload;

  let response = "";
  let result = "";
  let test = "";

  try {
    const topic = "iterahero";
    const pubTopic = `${topic}/actuator/${id_actuator}`;

    await client.on("connect", async () => {
      var message = parseInt(on_off_status);
      await client.publish(
        pubTopic,
        JSON.stringify(message),
        { qos: 1, retain: false },
        async (error) => {
          if (error) {
            console.error(error);
          } else {
            client.end();
          }
        }
      );
    });

    result = await prisma.actuator_log.create({
      data: {
        id_actuator,
        on_off_status
      }
    })

    await prisma.actuator.update({
      where: {
        id_actuator,
      },
      data: {
        status_lifecycle: on_off_status
      }
    })

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Actuator log successfully created",
      }).code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Actuator log failed to create",
      }).code(500);
    }
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
  uploadActuatorLog,
};
