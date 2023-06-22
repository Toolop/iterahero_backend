const mqtt = require("mqtt");
const pool = require("../config/db");
const { isActuatorExist } = require("../utils/actuator-util");
const { isSensorExist } = require("../utils/sensor-utils");
const { isMacExist } = require("../utils/mac-utils");

const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`;

const connectUrl = `ws://broker.hivemq.com:8000/mqtt`;
const subscribeMac = async () => {
  try {
    const client = mqtt.connect(connectUrl, {
      clientId,
      keepalive: 30,
      protocolId: "ws",
      protocolVersion: 4,
      clean: true,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false,
      reconnectPeriod: 1000,
    });
    const topic = "iterahero/macaddress/#";
    await client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
      });
    });

    client.on("message", async (topic, payload) => {
      try {
        getData = payload.toString();
        var n = topic.lastIndexOf("/");
        var last = topic.substring(n + 1);
        if (await !isMacExist(last)) {
          if (topic.includes("sensor")) {
            if (await isSensorExist(last)) {
              await pool.query(
                `INSERT INTO public.mac_address (id_sensor, mac_address)VALUES($1, $2);`,
                [last, getData]
              );
            }
          } else if (topic.includes("actuator")) {
            if (await isActuatorExist(last)) {
              await pool.query(
                `INSERT INTO public.mac_address (id_actuator, mac_address)VALUES($1, $2);`,
                [last, getData]
              );
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { subscribeMac };
