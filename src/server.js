const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");
const routes = require("./routes/route");
const { validate } = require("./utils/jwt-utils");
const mongoose = require("mongoose");
const { subscribeActuator } = require("./client/subscribe-actuator-client");
// const {subscribeMac} = require('./client/subscribe-mac-client');
// const { responActuator } = require('./client/responActuator-client');
// const { subscribeSensor } = require("./client/subscribe-sensor-client");
const { updateScheduleUtil } = require("./utils/schedule-util");
const { initSchedule } = require("./controller/scheduling/handler/scheduler");
const { initAgenda } = require("./agenda/delete-actuator");
const Jwt = require("@hapi/jwt");
const jwt = require("jsonwebtoken");

const init = async () => {
  dotenv.config();

  const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: process.env.HOST || "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Jwt);
  await mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });

  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: process.env.JWT_AUD,
      iss: process.env.JWT_ISS,
      sub: process.env.JWT_SUB,
      nbf: true,
      exp: true,
      maxAgeSec: 60 * 60 * 24 * 3,
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => {
      const obj = jwt.decode(artifacts.token);
      if (obj.exp > Date.now() / 1000) {
        return {
          isValid: true,
          credentials: jwt.decode(artifacts.token),
        };
      } else {
        return {
          isValid: false,
        };
      }
    },
  });

  server.auth.default("jwt");

  server.route(routes);

  try {
    await updateScheduleUtil();
    // subscribeMac();
    // responActuator();
    // await subscribeCamera();
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
