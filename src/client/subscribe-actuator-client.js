const actuator = require("../models/model-actuator");
const pool = require("../config/db");
const { client } = require("../config/mqtt");

const subscribeActuator = async () => {
  try {
    const topic = "iterahero/status/actuator/#";
    await client.on("connect", () => {
      console.log("Connected");
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
      });
    });

    await client.on("message", async (topic, payload) => {
      try {
        let getData = JSON.parse(payload.toString());
        const result = await actuator
          .find({ id_actuator: getData[0].id_actuator })
          .sort({ createdAt: -1 })
          .limit(1);
        if (result[0]) {
          if (result[0].status != getData[0].status) {
            if (getData[0].status == "offline") {
              await pool.query(
                `UPDATE public."actuator" SET "status_lifecycle"=$1 WHERE id_actuator = $2`,
                [0, getData[0].id_actuator]
              );
            }
            let save = await actuator.insertMany(getData);
          }
        } else {
          let save = await actuator.insertMany(getData);
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { subscribeActuator };
