const pool = require("../config/db");
const { client } = require("../config/mqtt");
const { getLocalISOString } = require("./timestamp-utils");

const uploadActuatorLogUtil = async (id_actuator, on_off_status) => {
  let result = "";

  try {
    const topic = "iterahero";
    const pubTopic = `${topic}/actuator/${id_actuator}`;

    client.on("connect", async () => {
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
    const created_at = getLocalISOString();

    result = await pool.query(
      `INSERT INTO public."actuator_log" (id_actuator, on_off_status, created_at) VALUES($1,$2,$3) RETURNING *`,
      [id_actuator, on_off_status, created_at]
    );
    await pool.query(
      `UPDATE public."actuator" SET "status_lifecycle"=$1 WHERE id_actuator = $2`,
      [on_off_status, id_actuator]
    );

    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = { uploadActuatorLogUtil };
