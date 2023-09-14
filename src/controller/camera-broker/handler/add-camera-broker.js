const mqtt = require("mqtt");
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://broker.hivemq.com:1883/mqtt`;

const uploadCameraBroker = async (request, h) => {
  const { id_camera } = request.payload;

  let response = "";
  let result = "";

  try {
    const client = await mqtt.connect(connectUrl, {
      clientId,
      keepalive: 30,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,
      reconnectPeriod: 1000,
    });
    const topic = "iterahero";
    const pubTopic = `${topic}/camera/${id_camera}`;

    await client.on("connect", async () => {
      var message = parseInt(i);
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

    if (result) {
      response = h.response({
        code: 200,
        status: "Created",
        message: "Camera success to capture",
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Camera failed to capture",
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
  uploadCameraBroker,
};
