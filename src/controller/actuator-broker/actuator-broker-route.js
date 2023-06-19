const { getActuatorBroker } = require("./handler/get-actuator-broker");
const prefix = require("../../utils/prefix-utils.js");

module.exports = [
  {
    method: "GET",
    path: `${prefix}/actuator-broker`,
    config: {
      auth: false,
    },
    handler: getActuatorBroker,
  },
];
