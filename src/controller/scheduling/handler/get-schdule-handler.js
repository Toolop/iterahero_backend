const pool = require("../../../config/db");
const { getNameActuatorByID } = require("../../../utils/actuator-util");

const getSchedule = async (request, h) => {
  let { status, actuatorid } = request.query;
  let result = "";
  let response = "";

  try {
    if (actuatorid && status) {
      result = await pool.query(
        `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
        FROM public.schedule where status_schedule=$1 AND id_actuator=$2;`,
        [status, actuatorid]
      );
    }
    if (status) {
      result = await pool.query(
        `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
        FROM public.schedule where status_schedule=$1;`,
        [status]
      );
    } else if (actuatorid) {
      result = await pool.query(
        `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
        FROM public.schedule where status_schedule=$1 AND id_actuator=$2;`,
        [1, actuatorid]
      );
    } else {
      result = await pool.query(
        `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
        FROM public.schedule;`
      );
    }
    response = h.response({
      code: 200,
      status: "Ok",
      data: await Promise.all(
        result.rows.map(async (row) => ({
          start: row.start_time,
          interval: row.interval,
          repeat: row.repeat,
          status: row.status_schedule,
          duration: row.duration,
          id_schedule: row.id_schedule,
          actuator: await getNameActuatorByID(row.id_actuator),
          hour: row.hour,
          minute: row.minute,
          dayOfWeek: row.dayOfWeek,
        }))
      ),
    });

    response.code(201);
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

module.exports = { getSchedule };
