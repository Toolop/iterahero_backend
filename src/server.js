const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./route');
const jwt = require('hapi-auth-jwt2');
const {validate} = require('./utils/jwt-utils');

const init = async () =>{
    dotenv.config();

    const server = Hapi.server({
        port: process.env.PORT || 3001,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });

    await server.register(jwt);

    server.auth.strategy('jwt', 'jwt',
    { key: process.env.JWT_SECRET, // Never Share your secret key
      expiresIn: '8h',
      validate:validate
    });

    server.auth.default('jwt');

    server.route(routes);
    try{
        await server.start();
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
    console.log(`Server is running on ${server.info.uri}`);
    
}

init();
