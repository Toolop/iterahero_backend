const mqtt = require("mqtt");
const modelCamera = require("../models/model-camera");
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://broker.hivemq.com:1883/mqtt`;

const subscribeCamera = async () => {
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
    const topic = "iterahero/camera/status/#";
    await client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
      });
    });

    await client.on("message", async (topic, payload) => {
      try {
        let getData = JSON.parse(payload.toString());
        const result = await modelCamera
          .find({ id_camera: getData[0].id_camera })
          .sort({ createdAt: -1 })
          .limit(1);
        if (result[0]) {
          if (result[0].status != getData[0].status) {
            await modelCamera.insertMany(getData);
          }
        } else {
          await modelCamera.insertMany(getData);
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { subscribeCamera };
