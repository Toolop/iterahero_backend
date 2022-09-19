const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./route');
<<<<<<< HEAD
=======
const jwt = require('hapi-auth-jwt2');
const {validate} = require('./utils/jwt-utils');
>>>>>>> 23486b345a014c14802c09f4c4da3ce7af1ba84b

const init = async () =>{
    dotenv.config();

    const server = Hapi.server({
<<<<<<< HEAD
        port: process.env.PORT || 80,
=======
        port: process.env.PORT || 3000,
>>>>>>> 23486b345a014c14802c09f4c4da3ce7af1ba84b
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    });

    await server.register(jwt);

    server.auth.strategy('jwt', 'jwt',
    { key: process.env.JWT_SECRET, // Never Share your secret key
      expiresIn: '8d',
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