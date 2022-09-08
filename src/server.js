const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./route');

const init = async () =>{
    dotenv.config();

    const server = Hapi.server({
        port: process.env.PORT || 80,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    });

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