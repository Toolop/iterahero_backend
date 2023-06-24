const pool = require("../config/db");
const scheduleListOn = require("../models/model-scheduleOff");
const scheduleListOff = require("../models/model-scheduleOn");
const { getNameActuatorByID } = require("./actuator-util");

const isScheduleExist = async (id) => {
  let isExist = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."schedule" WHERE id_schedule=$1',
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

const updateScheduleUtil = async () => {
  let result1 = "";
  let result2 = "";
  try {
    result1 = await pool.query(
      `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
      FROM public.schedule where status_schedule=$1;`,
      [1]
    );
    result2 = await pool.query(
      `SELECT id_actuator, repeat, id_schedule, created_at, updated_at, duration, status_schedule, hour, minute, "dayOfWeek", "interval", start_time
      FROM public.schedule where status_schedule=$1;`,
      [0]
    );
    scheduleListOn.splice(0, scheduleListOn.length);
    scheduleListOff.splice(0, scheduleListOff.length);

    scheduleListOn.push(
      await Promise.all(
        result2.rows.map(async (row) => ({
          start: row.start_time,
          interval: row.interval,
          repeat: row.repeat,
          status: row.status_schedule,
          duration: row.duration,
          id_schedule: row.id_schedule,
          id_actuator: row.id_actuator,
          actuator: await getNameActuatorByID(row.id_actuator),
          hour: row.hour,
          minute: row.minute,
          dayOfWeek: row.dayOfWeek,
        }))
      )
    );
    scheduleListOff.push(
      await Promise.all(
        result1.rows.map(async (row) => ({
          start: row.start_time,
          interval: row.interval,
          repeat: row.repeat,
          status: row.status_schedule,
          duration: row.duration,
          id_schedule: row.id_schedule,
          id_actuator: row.id_actuator,
          hour: row.hour,
          actuator: await getNameActuatorByID(row.id_actuator),
          minute: row.minute,
          dayOfWeek: row.dayOfWeek,
        }))
      )
    );
  } catch (err) {
    console.log(err);
  }

  return result1;
};

module.exports = { isScheduleExist, updateScheduleUtil };
