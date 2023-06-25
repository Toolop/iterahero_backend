const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");
const routes = require("./routes/route");
const jwt = require("hapi-auth-jwt2");
const { validate } = require("./utils/jwt-utils");
const mongoose = require("mongoose");
const { subscribeActuator } = require("./client/subscribe-actuator-client");
// const {subscribeMac} = require('./client/subscribe-mac-client');
// const { responActuator } = require('./client/responActuator-client');
// const { subscribeSensor } = require("./client/subscribe-sensor-client");
const { updateScheduleUtil } = require("./utils/schedule-util");
const { initSchedule } = require("./controller/scheduling/handler/scheduler");
const { initAgenda } = require("./agenda/delete-actuator");
const client = require("./config/mqtt");

const init = async () => {
  dotenv.config();
  const server = await Hapi.server({
    port: 8000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(jwt);
  await mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    expiresIn: "365d",
    validate: validate,
  });

  server.auth.default("jwt");

  server.route(routes);

  try {
    await updateScheduleUtil();
    // subscribeMac();
    // responActuator();
    await subscribeActuator();
    await initAgenda();
    await initSchedule();
    await server.start();
  } catch (err) {
    console.log(err);
  }

  console.log(`Server is running on ${server.info.uri}`);
};

init();
