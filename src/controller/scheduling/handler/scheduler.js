const schedule = require("node-schedule");
const scheduleListOff = require("../../../models/model-scheduleOff");
const scheduleListOn = require("../../../models/model-scheduleOn");
const { uploadActuatorLogUtil } = require("../../../utils/actuator-log-utli");
const { uploadNotification } = require("../../../utils/notification-util");
const initSchedule = async () => {
  schedule.scheduleJob(scheduleListOn[0], function () {
    const date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    scheduleListOn[0].map((item) => {
      item.hour.map(async (data, index) => {
        if (
          parseInt(item.hour[index]) == parseInt(hour) &&
          parseInt(item.minute[index]) == parseInt(minutes) &&
          parseInt(item.actuator.automation_status) == 1
        ) {
          await uploadActuatorLogUtil(item.id_actuator, item.status);
          await uploadNotification(item.status, item.id_actuator);
        }
      });
    });
  });
  schedule.scheduleJob(scheduleListOff[0], function () {
    const date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    scheduleListOff[0].map((item) => {
      item.hour.map(async (data, index) => {
        if (
          parseInt(item.hour[index]) == parseInt(hour) &&
          parseInt(item.minute[index]) == parseInt(minutes) &&
          item.actuator.automation_status == 1
        ) {
          await uploadActuatorLogUtil(item.id_actuator, item.status);
          await uploadNotification(item.status, item.id_actuator);
        }
      });
    });
  });
};

module.exports = { initSchedule };
