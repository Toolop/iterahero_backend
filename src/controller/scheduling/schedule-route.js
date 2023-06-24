const prefix = require("../../utils/prefix-utils.js");
const { addSchedule } = require("./handler/add-schdule-handler.js");
const { deleteSchedule } = require("./handler/delete-schedule-handler.js");
const { getSchedule } = require("./handler/get-schdule-handler.js");
const {
  getDetailSchedule,
} = require("./handler/getdetail-schedule-handler.js");
const { updateSchedule } = require("./handler/update-schedule-handler.js");

module.exports = [
  {
    method: "POST",
    path: `${prefix}/schedule`,
    config: {
      auth: "jwt",
    },
    handler: addSchedule,
  },
  {
    method: "GET",
    path: `${prefix}/schedule`,
    config: {
      auth: false,
    },
    handler: getSchedule,
  },
  {
    method: "GET",
    path: `${prefix}/schedule/{id}`,
    config: {
      auth: false,
    },
    handler: getDetailSchedule,
  },
  {
    method: "PUT",
    path: `${prefix}/schedule/{id}`,
    config: {
      auth: false,
    },
    handler: updateSchedule,
  },
  {
    method: "DELETE",
    path: `${prefix}/schedule/{id}`,
    config: {
      auth: false,
    },
    handler: deleteSchedule,
  },
];
