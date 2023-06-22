const pool = require("../../../config/db");

const getDetailSchedule = async (request, h) => {
  let result = "";
  let response = "";

  try {
    result = await pool.query(
      `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
        FROM public.schedule LIMIT 1;`
    );
    if (result.rowCount > 0) {
      response = h.response({
        code: 200,
        status: "Ok",
        message: "Schedule successfully created",
        data: {
          start: result.rows[0].start_time,
          interval: result.rows[0].row.interval,
          repeat: result.rows[0].repeat,
          status: result.rows[0].status_schedule,
          duration: result.rows[0].duration,
          id_schedule: result.rows[0].id_schedule,
          id_actuator: result.rows[0].id_actuator,
          hour: result.rows[0].hour,
          minute: result.rows[0].minute,
          dayOfWeek: result.rows[0].dayOfWeek,
        },
      });

      response.code(201);
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Schedule not found",
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

module.exports = { getDetailSchedule };
