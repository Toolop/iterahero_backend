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
const cameraRoute = require("../controller/camera/camera-route");
const cameraLogRoute = require("../controller/camera-log/camera-log-route");
const peracikanRoute = require("../controller/peracikan/peracikan-route");
const penjadwalanPeracikanRoute = require("../controller/penjadwalan-peracikan/penjadwalan-peracikan-route");
const resepRoute = require("../controller/resep/resep-route");
const tandoUtamaRoute = require("../controller/tandonUtama/tandonUtama-route");
const tandonUtamaRoute = require("../controller/tandonUtama/tandonUtama-route");

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
  scheduleRoute,
  cameraRoute,
  cameraLogRoute,
  peracikanRoute,
  penjadwalanPeracikanRoute,
  resepRoute,
  tandonUtamaRoute
);

module.exports = routes;
