const mqtt = require("mqtt");
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;
const connectUrl = `ws://broker.hivemq.com:8000/mqtt`;

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

module.exports = client;
