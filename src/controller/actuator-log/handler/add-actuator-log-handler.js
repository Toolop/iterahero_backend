const pool = require("../../../config/db");
const client = require("../../../config/mqtt");
const { getLocalISOString } = require("../../../utils/timestamp-utils");

const uploadActuatorLog = async (request, h) => {
  const { id_actuator, on_off_status } = request.payload;

  let response = "";
  let result = "";
  let test = "";

  try {
    const topic = "iterahero";
    const pubTopic = `${topic}/actuator/${id_actuator}`;

    await client.on("connect", async () => {
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

    if (result) {
      response = h.response({
        code: 201,
        status: "Created",
        message: "Actuator log successfully created",
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Actuator log failed to create",
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
  uploadActuatorLog,
};
