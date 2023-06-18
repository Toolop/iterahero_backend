const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./routes/route');
const jwt = require('hapi-auth-jwt2');
const {validate} = require('./utils/jwt-utils');
const mongoose = require('mongoose');
const {subscribeActuator} = require('./client/subscribe-actuator-client')
// const {subscribeMac} = require('./client/subscribe-mac-client');
// const { responActuator } = require('./client/responActuator-client');
const { subscribeSensor } = require('./client/subscribe-sensor-client');

const init = async () =>{
    dotenv.config();

    const server = await Hapi.server({
        port: process.env.PORT || 8000,
        host: process.env.host || 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });

    await server.register(jwt);
    await mongoose.connect('mongodb://127.0.0.1:27017/iterahero', {
        useNewUrlParser: true,
    });  

    server.auth.strategy('jwt', 'jwt',
    { key: process.env.JWT_SECRET, 
      expiresIn: '365d',
      validate:validate
    });

    server.auth.default('jwt');

    server.route(routes);
    
    try{
      await server.start();
      subscribeActuator();
      // subscribeMac();
      subscribeSensor();
      // responActuator();
    }
    catch(err){
        console.log(err);
    }

    console.log(`Server is running on ${server.info.uri}`);
}

init();
