const pool = require("../config/db");
const { getActuator } = require("./actuator-util");
const { getGreenHouse } = require("./greenhouse-util");
const { getLocalISOString } = require("./timestamp-utils");

const isNotificationExist = async (id) => {
  let isExist = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."receive" WHERE id_notification=$1',
      [id]
    );

    if (result.rows[0]) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};

const uploadNotification = async (status_lifecycle, id_actuator) => {
  let response = "";
  let detail = "";

  try {
    const created_at = getLocalISOString();
    let type = "actuator";
    let status = 0;
    const actuator = await getActuator(id_actuator);
    const greenhouse = await getGreenHouse(parseInt(actuator.id_greenhouse));
    if (status_lifecycle == 1) {
      detail = `Actuator ${actuator.name} pada greenhouse ${greenhouse.name} menyala`;
    } else {
      detail = `Actuator ${actuator.name} pada greenhouse ${greenhouse.name} mati`;
    }

    const result = await pool.query(
      `INSERT INTO public."notification" (detail, created_at, type, status, id_actuator) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [detail, created_at, type, status, id_actuator]
    );

    const makeReceiver = await pool.query(
      `INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
      [greenhouse.id_user, result.rows[0].id_notification]
    );

    if (result && makeReceiver) {
      response = {
        id: result.rows[0].id_notification,
        detail: result.rows[0].detail,
        created_at: result.rows[0].created_at,
        type: result.rows[0].type,
        status: result.rows[0].status,
        receive_status: "received",
      };
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  isNotificationExist,
  uploadNotification,
};
