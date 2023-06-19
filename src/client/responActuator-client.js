const mqtt = require("mqtt");
const pool = require("../config/db");

const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;

const connectUrl = `ws://broker.hivemq.com:8000/mqtt`;
const responActuator = async () => {
  try {
    const client = mqtt.connect(connectUrl, {
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
