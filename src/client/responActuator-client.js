const pool = require("../config/db");
const mqtt = require("mqtt");
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://broker.hivemq.com:1883/mqtt`;

const responActuator = async () => {
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
    const subtopic = `iterahero/respon/actuator/#`;
    await client.on("connect", () => {
      console.log("Connected");
      client.subscribe([subtopic], () => {
        console.log(`Subscribe to topic '${subtopic}'`);
      });
    });

    await client.on("message", async (topic, payload) => {
      getDataBroker = payload.toString();
      var n = topic.lastIndexOf("/");
      var id_actuator = topic.substring(n + 1);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { responActuator };
