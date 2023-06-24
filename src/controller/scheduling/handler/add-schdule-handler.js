const { getLocalISOString } = require("../../../utils/timestamp-utils");
const pool = require("../../../config/db");
const { updateScheduleUtil } = require("../../../utils/schedule-util");

const addSchedule = async (request, h) => {
  let { start, interval, repeat, duration, id_actuator } = request.payload;
  let resultOn = "";
  let resultOff = "";
  let response = "";
  const listOnHour = [];
  const listOnMinute = [];
  const listOffHour = [];
  const listOffMinute = [];
  try {
    let splittingStart = start.split(":");
    let jamAwal = parseInt(splittingStart[0]);
    let menitAwal = parseInt(splittingStart[1]);
    let intervalMenit = parseInt(interval) % 60;
    let intervalJam = Math.floor(parseInt(interval) / 60);
    let tempMinute = menitAwal;
    let temp = jamAwal;
    let menitMati = menitAwal + parseInt(duration);
    let jamMati = Math.floor(parseInt(duration) / 60) + parseInt(start);

    for (let i = 0; i < repeat; i++) {
      tempMinute = tempMinute % 60;
      menitMati = menitMati % 60;
      temp = temp % 24;
      jamMati = jamMati % 24;
      listOffHour.push(jamMati);
      listOffMinute.push(menitMati);
      listOnHour.push(temp);
      listOnMinute.push(tempMinute);
      tempMinute += intervalMenit;
      menitMati += intervalMenit;
      temp += intervalJam + Math.floor(tempMinute / 60);
      jamMati += intervalJam + Math.floor(tempMinute / 60);
    }

    const created_at = getLocalISOString();

    resultOn = await pool.query(
      `INSERT INTO public.schedule(
        id_actuator, start_time,interval, repeat, created_at, updated_at, duration, status_schedule, hour, minute)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *;`,
      [
        parseInt(id_actuator),
        start,
        parseInt(interval),
        parseInt(repeat),
        created_at,
        created_at,
        parseInt(duration),
        1,
        listOnHour,
        listOnMinute,
      ]
    );

    resultOff = await pool.query(
      `INSERT INTO public.schedule(
        id_actuator, start_time,interval, repeat, created_at, updated_at, duration, status_schedule, hour, minute) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        parseInt(id_actuator),
        start,
        parseInt(interval),
        parseInt(repeat),
        created_at,
        created_at,
        parseInt(duration),
        0,
        listOffHour,
        listOffMinute,
      ]
    );
    if (resultOn && resultOff) {
      updateScheduleUtil();
      response = h.response({
        code: 201,
        status: "Created",
        message: "Schedule successfully created",
        data: {
          start: resultOn.rows[0].start_time,
          interval: resultOn.rows[0].interval,
          repeat: resultOn.rows[0].repeat,
          duration: resultOn.rows[0].duration,
          id_schedule: resultOn.rows[0].id_schedule,
          id_actuator: resultOn.rows[0].id_actuator,
        },
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: "Internal Server Error",
        message: "Schedul failed to create",
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

module.exports = { addSchedule };
