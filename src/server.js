const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./route');
const jwt = require('hapi-auth-jwt2');
const {validate} = require('./utils/jwt-utils');
const mongoose = require('mongoose');
const {subscribeSensor} = require('./client/subscribe-sensor-client')
const {subscribeActuator} = require('./client/subscribe-actuator-client')
const {subscribeMac} = require('./client/subscribe-mac-client')

const init = async () =>{
    dotenv.config();

    const server = await Hapi.server({
//        port: process.env.PORT || 80,
        port: process.env.PORT || 3001,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });

    await server.register(jwt);
    await mongoose.connect(`mongodb+srv://${process.env.MONGGOUSERNAME}:${process.env.MONGGOPASSWORD}@iteraherosensors.4e0t2al.mongodb.net/iterahero?retryWrites=true&w=majority`, {
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
      subscribeSensor();
      subscribeActuator();
      subscribeMac();
    }
    catch(err){
        console.log(err);
    }

    console.log(`Server is running on ${server.info.uri}`);
}

init();
