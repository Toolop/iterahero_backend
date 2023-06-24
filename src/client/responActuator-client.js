const pool = require("../config/db");
const client = require("../config/mqtt");

const responActuator = async () => {
  try {
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
