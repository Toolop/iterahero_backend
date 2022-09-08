const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./route')


const init = async () =>{
    dotenv.config();

    const server = Hapi.server({
        port: process.env.PORT || 80,
        host: 'localhost'
    });

    server.route(routes);

    await server.start();
    console.log(`Server is running on ${server.info.uri}`);
}


init();