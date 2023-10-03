const pool = require("../config/db");
const { isActuatorExist } = require("../utils/actuator-util");
const { isSensorExist } = require("../utils/sensor-utils");
const { isMacExist } = require("../utils/mac-utils");
const { client } = require("../config/mqtt");

const subscribeMac = async () => {
  try {
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
