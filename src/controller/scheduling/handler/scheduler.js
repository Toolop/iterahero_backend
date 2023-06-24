const schedule = require("node-schedule");
const scheduleListOff = require("../../../models/model-scheduleOff");
const scheduleListOn = require("../../../models/model-scheduleOn");
const { uploadActuatorLogUtil } = require("../../../utils/actuator-log-utli");

const initSchedule = async () => {
  const JobOn = schedule.scheduleJob(scheduleListOn[0], function () {
    var date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    scheduleListOn[0].map((item) => {
      item.hour.map((data, index) => {
        if (
          item.hour[index] == hour &&
          item.minute[index] == minutes &&
          item.actuator.automation_status == 1
        ) {
          uploadActuatorLogUtil(item.id_actuator, item.status);
        }
      });
    });
  });
  const JobOff = schedule.scheduleJob(scheduleListOff[0], function () {
    var date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    scheduleListOff[0].map((item) => {
      item.hour.map((data, index) => {
        if (
          item.hour[index] == hour &&
          item.minute[index] == minutes &&
          item.actuator.automation_status == 1
        ) {
          uploadActuatorLogUtil(item.id_actuator, item.status);
        }
      });
    });
  });
};

module.exports = { initSchedule };
