const pool = require("../../../config/db");
const { isScheduleExist } = require("../../../utils/schedule-util");

const updateSchedule = async (request, h) => {
  const { id } = request.params;
  let { start, interval, repeat, duration } = request.payload;
  let result = "";
  let response = "";
  const listOnHour = [];
  const listOnMinute = [];
  const listOffHour = [];
  const listOffMinute = [];

  try {
    if (await isScheduleExist) {
      let intervalMenit = parseInt(interval) % 60;
      let intervalJam = Math.floor(parseInt(interval) / 60);
      let tempMinute = 0;
      let temp = parseInt(start);
      let menitMati = parseInt(duration);
      let jamMati = Math.floor(parseInt(duration) / 60) + parseInt(start);

      for (let i = 0; i < repeat; i++) {
        tempMinute = tempMinute % 60;
        menitMati = menitMati % 60;
        listOffHour.push(jamMati);
        listOffMinute.push(menitMati);
        listOnHour.push(temp);
        listOnMinute.push(tempMinute);
        tempMinute += intervalMenit;
        menitMati += intervalMenit;
        temp += intervalJam + Math.floor(tempMinute / 60);
        jamMati += intervalJam + Math.floor(tempMinute / 60);
      }

      const updated_at = getLocalISOString();
      result = await pool.query(
        `UPDATE public.schedule
          SET repeat=$1, updated_at=$2, duration=$3, hour=$4, minute=$5, "interval"=$6, start_time=$7
          WHERE id_schedule=$8;`,
        [
          repeat,
          updated_at,
          duration,
          listOnHour,
          listOnMinute,
          interval,
          start,
          id,
        ]
      );
      await pool.query(
        `UPDATE public.schedule
          SET repeat=$1, updated_at=$2, duration=$3, hour=$4, minute=$5, "interval"=$6, start_time=$7
          WHERE id_schedule=$8;`,
        [
          repeat,
          updated_at,
          duration,
          listOffHour,
          listOffMinute,
          interval,
          start,
          id + 1,
        ]
      );

      if (result) {
        response = h.response({
          code: 200,
          status: "Update Successfully",
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: "Internal Server Error",
          message: "Schedule failed to delete",
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: "Not Found",
        message: "Schedule is not found",
      });

      response.code(500);
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
  updateSchedule,
};
