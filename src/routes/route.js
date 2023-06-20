const actuatorBrokerRoute = require("../controller/actuator-broker/actuator-broker-route");
const actuatorLogRoute = require("../controller/actuator-log/actuator-log-route");
const actuatorRoute = require("../controller/acuator/actuator-route");
const automationRoute = require("../controller/automation/automation-route");
const categoryRoute = require("../controller/category/category-route");
const dashboardRoute = require("../controller/dashboard/dashboard-route");
const grafikRoute = require("../controller/grafik/grafik-route");
const greenhouseRoutes = require("../controller/greenhouse/greenhouse-routes");
const iconRoute = require("../controller/icon/icon-route");
const imageMlRoute = require("../controller/image/image-ml-route");
const notificationRoute = require("../controller/notification/notification-route");
const sensorLogRoute = require("../controller/sensor-log/sensor-log-route");
const sensorRoute = require("../controller/sensor/sensor-route");
const userRoute = require("../controller/user/user-route");
const sensorBrokerRoute = require("../controller/sensor-broker/sensor-broker-route");
const scheduleRoute = require("../controller/scheduling/schedule-route");

const routes = [].concat(
  actuatorBrokerRoute,
  actuatorLogRoute,
  sensorBrokerRoute,
  actuatorRoute,
  automationRoute,
  categoryRoute,
  dashboardRoute,
  grafikRoute,
  greenhouseRoutes,
  iconRoute,
  imageMlRoute,
  notificationRoute,
  sensorLogRoute,
  sensorRoute,
  userRoute,
  scheduleRoute
);

module.exports = routes;
