const actuator = require("../models/model-actuator");
const schedule = require("node-schedule");

const initAgenda = async () => {
  const delete_sensor = schedule.scheduleJob("0 7 * * *", function () {
    actuator.deleteMany();
  });
};

module.exports = { initAgenda };
